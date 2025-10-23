import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { statisticsAPI, resumeAPI } from '../utils/supabase'

const Home = () => {
  const [statistics, setStatistics] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf')
  const [resumeFilename, setResumeFilename] = useState('resume.pdf')

  useEffect(() => {
    loadStatistics()
    loadResumeUrl()

    // Listen for real-time resume updates from admin
    const handleResumeUpdate = (event) => {
      const updatedResume = event.detail
      setResumeUrl(updatedResume.resume_url)
      setResumeFilename(updatedResume.filename)
    }

    window.addEventListener('resumeUpdated', handleResumeUpdate)
    
    return () => {
      window.removeEventListener('resumeUpdated', handleResumeUpdate)
    }
  }, [])

  const loadStatistics = async () => {
    try {
      const stats = await statisticsAPI.getAll()
      setStatistics(stats)
    } catch (error) {
      console.error('Failed to load statistics:', error)
      // Show error message to user
      console.warn('Please ensure your Supabase database is properly configured with a statistics table')
      // Fallback to default statistics
      setStatistics([
        { id: 1, number: '5+', label: 'Projects Completed', order: 1 },
        { id: 2, number: '1+', label: 'Years Experience', order: 2 },
        { id: 3, number: '8+', label: 'Students Helped', order: 3 },
        { id: 4, number: '10+', label: 'Technologies', order: 4 }
      ])
    } finally {
      setLoadingStats(false)
    }
  }

  const loadResumeUrl = async () => {
    try {
      const resumeData = await resumeAPI.getResumeUrl()
      setResumeUrl(resumeData.resume_url)
      setResumeFilename(resumeData.filename)
    } catch (error) {
      console.error('Failed to load resume URL:', error)
      // Keep default values
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/codest0411', label: 'GitHub' },
    { icon: Linkedin, href: 'http://www.linkedin.com/in/chiragkb04', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:chiragbhandarkar780@gmail.com', label: 'Email' }
  ]

  return (
    <div className="min-h-screen hero-bg">
      {/* Hero Section */}
      <section className="pt-32 pb-20 section-padding">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-primary-600 dark:text-emerald-400 font-medium mb-4"
            >
              Hello, I'm
            </motion.p>

            {/* Name with animated text */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient dark:text-gradient-dark">
                Chirag Bhandarkar
              </span>
            </motion.h1>

            {/* Role/Title */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
            >
              Full Stack Web Developer
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Motivated BCA graduate and Full-Stack Web Developer with expertise in MERN stack development. 
              Skilled in building responsive web applications, integrating APIs, and developing scalable backend systems. 
              Experienced in Agile workflows, client-side projects, and collaborative coding, seeking to contribute to innovative web development teams.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link
                to="/contact"
                className="btn-primary flex items-center gap-2 group"
              >
                Hire Me
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href={resumeUrl}
                download={resumeFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
                onClick={(e) => {
                  // Force download instead of opening in browser
                  e.preventDefault()
                  resumeAPI.forceDownload(resumeUrl, resumeFilename)
                }}
              >
                <Download size={20} />
                Download Resume
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-6"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white dark:bg-dark-card shadow-lg border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-emerald-400 hover:shadow-xl transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 dark:bg-emerald-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-200/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm">
        <div className="container-custom section-padding">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {loadingStats ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </motion.div>
              ))
            ) : (
              statistics.map((stat, index) => (
                <motion.div
                  key={stat.id || stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gradient dark:text-gradient-dark">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Skills Preview */}
      <section className="py-20">
        <div className="container-custom section-padding">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient dark:text-gradient-dark">
                Technologies I Love
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of the technologies and tools I work with to bring ideas to life
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center"
          >
            {[
              'React.js', 'Node.js', 'JavaScript', 'Java', 'MongoDB', 'Express.js',
              'HTML5', 'CSS3', 'TailwindCSS', 'Supabase', 'MySQL', 'Git'
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="p-4 rounded-xl bg-white dark:bg-dark-card shadow-sm hover:shadow-lg border border-gray-200 dark:border-dark-border transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tech}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/about"
              className="btn-secondary inline-flex items-center gap-2 group"
            >
              Learn More About Me
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
