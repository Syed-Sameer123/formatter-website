const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const runShell = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { shell: true }, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve(stdout);
    });
  });

const isToolAvailable = (tool) =>
  new Promise((resolve) => {
    exec(`${tool} --version`, (error) => {
      resolve(!error);
    });
  });

const languageMap = {
  js: 'javascript',
  py: 'python',
  cpp: 'cpp',
  html: 'html',
  css: 'css',
  json: 'json',
  php: 'php',
  java: 'java',
  go: 'go',
};

const formatters = {
  javascript: async (code) =>
    prettier.format(code, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    }),

  html: async (code) => prettier.format(code, { parser: 'html' }),
  css: async (code) => prettier.format(code, { parser: 'css' }),
  json: async (code) => prettier.format(code, { parser: 'json' }),

  python: async (code) => {
    const file = path.join(__dirname, 'temp.py');
    fs.writeFileSync(file, code);
    try {
      await runShell(`black "${file}" --quiet`);
      return fs.readFileSync(file, 'utf8');
    } catch {
      throw new Error('⚠️ Python formatter (black) is not available or failed.');
    }
  },

  java: async (code) => {
    const file = path.join(__dirname, 'Temp.java');
    const jarPath = path.join(__dirname, 'tools', 'google-java-format.jar');
    fs.writeFileSync(file, code);
    try {
      return await runShell(`java -jar "${jarPath}" "${file}"`);
    } catch {
      throw new Error('⚠️ Java formatter (google-java-format) not available or failed.');
    }
  },

  php: async (code) => {
    const file = path.join(__dirname, 'temp.php');
    const fixerPath = path.join(__dirname, 'tools', 'php-cs-fixer.phar');
    fs.writeFileSync(file, code);
    if (!fs.existsSync(fixerPath)) {
      throw new Error('⚠️ php-cs-fixer.phar not found.');
    }
    try {
      await runShell(`php "${fixerPath}" fix "${file}" --rules=@PSR12 --quiet`);
      return fs.readFileSync(file, 'utf8');
    } catch {
      throw new Error('⚠️ php-cs-fixer failed to format.');
    }
  },

  go: async (code) => {
    const file = path.join(__dirname, 'temp.go');
    fs.writeFileSync(file, code);
    const available = await isToolAvailable('gofmt');
    if (!available) {
      throw new Error('⚠️ gofmt is not installed.');
    }
    return await runShell(`gofmt "${file}"`);
  },

  cpp: async (code) => {
    const file = path.join(__dirname, 'temp.cpp');
    fs.writeFileSync(file, code);
    const available = await isToolAvailable('clang-format');
    if (!available) {
      throw new Error('⚠️ clang-format is not installed.');
    }
    return await runShell(`clang-format "${file}"`);
  },
};

app.post('/format', async (req, res) => {
  console.log("🔥 /format hit");

  const { code, language } = req.body;
  const trimmed = code?.slice(0, 50).replace(/\s+/g, ' ');
  console.log(`📦 Language: ${language}`);
  console.log(`📄 Code preview: ${trimmed}...`);

  const langKey = languageMap[language.toLowerCase()] || language.toLowerCase();
  const formatter = formatters[langKey];

  if (!formatter) {
    console.warn("❌ Unsupported language:", language);
    return res.status(400).json({
      error: `🚫 The language "${language}" is not supported yet. Please try JavaScript, Python, PHP, Java, CSS, etc.`,
    });
  }

  try {
    console.log("⚙️ Formatting...");
    const formattedCode = await formatter(code);
    console.log("✅ Formatting success");
    res.json({ formattedCode });
  } catch (err) {
    console.error("❌ Format error:", err.message);

    // Friendly error message for user:
    let friendlyMessage = err.message;

    if (
      friendlyMessage.toLowerCase().includes('missing semicolon') ||
      friendlyMessage.toLowerCase().includes('syntax error') ||
      friendlyMessage.toLowerCase().includes('not installed') ||
      friendlyMessage.toLowerCase().includes('not found') ||
      friendlyMessage.toLowerCase().includes('failed')
    ) {
      friendlyMessage =
        '🚫 Sorry, this language or code is not supported or has syntax errors. Please try another language or check your code.';
    }

    res.status(500).json({
      error: friendlyMessage || '⚠️ Internal formatter error. Please check your code or tool setup.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
