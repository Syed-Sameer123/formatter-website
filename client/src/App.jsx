import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import Hero from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { CodeFormatter } from './components/CodeFormatter';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'how-it-works', 'formatter', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFormatter = () => {
    const element = document.getElementById('formatter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('formatter');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="pt-16">
        <Hero onGetStarted={scrollToFormatter} />
        <HowItWorks />
        <CodeFormatter />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
