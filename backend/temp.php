import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Copy,
  Check,
  Loader2,
  FileText,
  Zap,
  UploadCloud,
  Trash2,
  Download,
} from 'lucide-react';

export function CodeFormatter() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const detectLanguage = (code) => {
    if (/class\s+\w+\s*\{/.test(code) && /public static void main/.test(code)) return 'java';
    if (/def\s+\w+\(/.test(code)) return 'python';
    if (/<?php/.test(code)) return 'php';
    if (/package\s+\w+/.test(code) || /func\s+\w+\(/.test(code)) return 'go';
    if (/#include\s*</.test(code) || /int\s+main\s*\(/.test(code)) return 'cpp';
    if (/^\s*{\s*".*":/.test(code)) return 'json';
    if (/<[a-z][\s\S]*?>/.test(code)) return 'html';
    if (/^[a-zA-Z0-9\-\.#]+[{]/.test(code) && /[;}]/.test(code)) return 'css';
    if (/^(\s|\n)*[a-zA-Z0-9\s]+\s*{[\s\S]*}/.test(code) && /;/g.test(code)) return 'js';
    return 'js';
  };

  const handleFormat = async () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to format');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutputCode('');

    const language = detectLanguage(inputCode);
    setDetectedLanguage(language);

    try {
      const response = await fetch('http://localhost:5000/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode, language }),
      });

      const data = await response.json();
      if (data.formattedCode) {
        setOutputCode(data.formattedCode);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unexpected error from formatter');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (outputCode) {
      await navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputCode('');
    setOutputCode('');
    setDetectedLanguage('');
    setError('');
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputCode(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${detectedLanguage || 'txt'}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="formatter" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Code Formatter
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Paste your code below and watch it transform into beautiful, readable format
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Input Code
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    id="upload-code"
                  />
                  <span className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:scale-105 transition-all duration-200">
                    <UploadCloud className="w-4 h-4" />
                    Upload
                  </span>
                </label>

                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-all duration-200 shadow"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 md:h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {inputCode && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                  {inputCode.length} characters
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFormat}
              disabled={isLoading || !inputCode.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Formatting...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Format Code</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Formatted Code
                </h3>
                {detectedLanguage && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {detectedLanguage}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {outputCode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </motion.button>
                )}

                {outputCode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </motion.button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={outputCode}
                readOnly
                placeholder="Your formatted code will appear here..."
                className="w-full h-64 md:h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm leading-relaxed resize-none focus:outline-none"
              />
              {outputCode && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                  {outputCode.length} characters
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
