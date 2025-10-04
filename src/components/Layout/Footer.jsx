import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'

const Footer = () => {
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
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-1 text-red-500" /> by Chirag Keshav Bhandarkar
            </p> */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
