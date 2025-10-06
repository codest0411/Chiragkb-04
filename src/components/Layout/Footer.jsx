import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart, Eye, Users } from 'lucide-react'
import { useVisitorCounter } from '../../hooks/useVisitorCounter'

const Footer = () => {
  const { visitorCount, loading, error } = useVisitorCounter()
  
  const socialLinks = [
    { icon: Github, href: 'https://github.com/codest0411', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/chirag-bhandarkar-206124232', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:chiragbhandarkar780@gmail.com', label: 'Email' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border">
      <div className="container-custom section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient dark:text-gradient-dark">
              CHIRAG BHANDARKAR
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            We can never truly grow into the people we are meant to become if we remain the same as we are today.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['About', 'Projects', 'Experience', 'Blog', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-emerald-400 transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Connect
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-emerald-400 hover:border-primary-300 dark:hover:border-emerald-600 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {currentYear} All rights reserved.
              </p>
              
              {/* Real-time Visitor Counter */}
              <motion.div 
                className="flex items-center space-x-2 px-3 py-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Eye size={14} className="text-primary-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : error ? (
                    <span className="text-red-500">Error</span>
                  ) : (
                    <motion.span
                      key={visitorCount}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {visitorCount.toLocaleString()} visitors
                    </motion.span>
                  )}
                </span>
              </motion.div>
            </div>
            
            {/* Made with love message */}
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-1 text-red-500 animate-pulse" /> by Chirag Keshav Bhandarkar
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
