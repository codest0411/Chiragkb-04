import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'chiragbhandarkar780@gmail.com',
      href: 'mailto:chiragbhandarkar780@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9632961796',
      href: 'tel:+919632961796'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Ugar Khurd, Belagavi',
      href: 'https://maps.google.com/?q=Ugar+Khurd,Belagavi'
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/codest0411', label: 'GitHub' },
    { icon: Linkedin, href: 'http://www.linkedin.com/in/chiragkb04', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:chiragbhandarkar780@gmail.com', label: 'Email' }
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // EmailJS configuration from environment variables
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      
      console.log('EmailJS Config:', { serviceID, templateID, publicKey })
      
      const templateParams = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }

      console.log('Template Params:', templateParams)
      
      const result = await emailjs.send(serviceID, templateID, templateParams, publicKey)
      console.log('EmailJS Result:', result)
      
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
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

  return (
    <>
      <Helmet>
        <title>Contact Me - Portfolio</title>
        <meta name="description" content="Get in touch with me for collaborations, opportunities, or just to say hello." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding py-20 hero-bg">
          <div className="container-custom">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Let's <span className="text-gradient dark:text-gradient-dark">Connect</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Have a project in mind or just want to chat? I'd love to hear from you!
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                    I'm always open to discussing new opportunities, creative projects, 
                    or potential collaborations. Whether you have a question or just want 
                    to say hi, I'll try my best to get back to you!
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <motion.a
                      key={info.label}
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-emerald-900/20 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-emerald-800/30 transition-colors">
                        <info.icon size={24} className="text-primary-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{info.label}</p>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{info.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Follow Me
                  </h3>
                  <div className="flex gap-4">
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
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  Send me a message
                </h3>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                    <p className="text-red-700 dark:text-red-300">
                      Failed to send message. Please try again or contact me directly.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 transition-colors"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 transition-colors"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 transition-colors"
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message', { required: 'Message is required' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 transition-colors resize-none"
                      placeholder="Tell me about your project or just say hello!"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="section-padding py-20 bg-gray-50 dark:bg-dark-surface">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-gradient dark:text-gradient-dark">Find Me Here</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Based in Ugar Khurd, Belagavi, Karnataka, India
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Placeholder for Google Maps */}
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-navy-100 dark:from-emerald-900/20 dark:to-purple-900/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-primary-600 dark:text-emerald-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {/* Interactive map would be embedded here */}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Ugar Khurd, Belagavi, Karnataka
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
