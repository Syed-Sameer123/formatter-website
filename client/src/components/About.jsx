import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Zap, Heart, Star, Globe } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Code,
      title: 'Multi-Language Support',
      description:
        'Support for JavaScript, Python, Java, C++, PHP, and many more programming languages',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant formatting with our optimized backend processing engine',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Developer Friendly',
      description: 'Built by developers, for developers. Clean, intuitive interface',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Always Available',
      description: 'Cloud-based service available 24/7 from anywhere in the world',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { number: '10+', label: 'Languages Supported' },
    { number: '99.9%', label: 'Uptime' },
    { number: '1M+', label: 'Lines Formatted' },
    { number: '50K+', label: 'Happy Developers' },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About CodeFormatter
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're passionate about making code beautiful and readable. Our mission is to help
            developers write cleaner, more maintainable code with our intelligent formatting tools.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Built with Modern Technology
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our stack ensures reliability, performance, and scalability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', description: 'Frontend Framework' },
              { name: 'Node.js', description: 'Backend Runtime' },
              { name: 'Express', description: 'Web Framework' },
              { name: 'Prettier', description: 'Code Formatter' },
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl mb-3">
                  <div className="font-semibold">{tech.name}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <Heart className="h-8 w-8 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Made with ❤️ for the Developer Community</h3>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of developers who trust CodeFormatter for their daily coding needs
            </p>
            <div className="flex justify-center space-x-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current text-yellow-300" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
