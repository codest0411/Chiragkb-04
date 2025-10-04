import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Code, Palette, Zap, Users, Award, BookOpen } from 'lucide-react'
import { skillsAPI } from '../utils/supabase'

const About = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await skillsAPI.getByCategory()
        setSkills(skillsData)
      } catch (error) {
        console.error('Error fetching skills:', error)
        // Fallback to static data if Supabase fails
        setSkills([
          {
            category: 'Frontend',
            technologies: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
            color: 'from-blue-500 to-purple-600'
          },
          {
            category: 'Backend',
            technologies: ['Node.js', 'Express.js', 'MongoDB', 'Supabase', 'MySQL', 'PostgreSQL', 'PHP'],
            color: 'from-green-500 to-teal-600'
          },
          {
            category: 'Languages & Tools',
            technologies: ['Java', 'JavaScript', 'Python', 'PHP', 'SQL', 'Git', 'GitHub', 'VS Code'],
            color: 'from-orange-500 to-red-600'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const values = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and well-documented code that stands the test of time.'
    },
    {
      icon: Palette,
      title: 'Design Focus',
      description: 'Creating beautiful, intuitive interfaces that provide exceptional user experiences.'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimizing applications for speed, efficiency, and seamless user interactions.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively with teams to deliver projects that exceed expectations.'
    }
  ]

  const education = [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'KLE\'s B.K. BCA College, Chikodi',
      year: '2022-2025',
      description: 'CGPA: 7.84. Focused on software engineering, web development, and database management.'
    },
    {
      degree: 'Pre-University (Commerce)',
      institution: 'Shri Hari Vidyalaya PU College, Ugar Khurd',
      year: '2020-2022',
      description: 'Percentage: 59.63%. Commerce stream with strong foundation in business and mathematics.'
    },
    {
      degree: 'SSLC',
      institution: 'Shri Hari Vidyalaya High School, Ugar Khurd',
      year: '2019-2020',
      description: 'Percentage: 58.88%. Completed secondary education with focus on science and mathematics.'
    },
    {
      degree: 'The Complete 2025 Full-Stack Web Development Bootcamp',
      institution: 'Angela Yu, Udemy',
      year: '2024',
      description: '61.5 Hours comprehensive course covering modern web technologies and best practices.'
    }
  ]

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
        <title>About Me - Portfolio</title>
        <meta name="description" content="Learn more about my background, skills, and passion for web development." />
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
                About <span className="text-gradient dark:text-gradient-dark">Me</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Passionate developer with a love for creating digital experiences that make a difference
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-400 to-navy-600 dark:from-emerald-400 dark:to-purple-600 p-1">
                    <div className="w-full h-full rounded-2xl bg-gray-200 dark:bg-dark-card overflow-hidden">
                      <img 
                        src="https://ibb.co/Rph6sCG2" 
                        alt="Chirag Keshav Bhandarkar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-6xl">👨‍💻</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500 dark:bg-emerald-500 rounded-full flex items-center justify-center">
                    <Code size={32} className="text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Hi, I'm Chirag Keshav Bhandarkar
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    I'm a motivated BCA graduate and Full-Stack Web Developer with expertise in MERN stack development. 
                    Currently working as a Web Development Intern at Labmentix, Bangalore (Remote), where I develop 
                    responsive web applications using React.js, Node.js, and MongoDB, build reusable Tailwind CSS 
                    components with mobile-first design, and participate in Agile workflows and code reviews.
                  </p>
                  <p>
                    Previously, I completed a Web Development Internship at Leosias Technologies, Belagavi, where I 
                    developed and optimized web applications, enhancing functionality and performance while collaborating 
                    with teams to build and deploy responsive, scalable web solutions. I gained hands-on experience in 
                    full-stack development and applied best coding practices.
                  </p>
                  <p>
                    When I'm not coding, you can find me exploring new technologies, gaming & e-sports strategy 
                    (I've won awards in state-level Free Fire & COD tournaments), puzzle-solving & brain games like 
                    chess and Sudoku, learning new programming languages or frameworks, and traveling to explore 
                    tech communities. I speak English, Hindi, Marathi, Kannada, and Konkani.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="text-gradient dark:text-gradient-dark">What I Value</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-emerald-900/20 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-emerald-800/30 transition-colors">
                      <value.icon size={32} className="text-primary-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="text-gradient dark:text-gradient-dark">Technical Skills</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={skillGroup.category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="card p-6"
                  >
                    <div className={`w-full h-1 bg-gradient-to-r ${skillGroup.color} rounded-full mb-6`} />
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-dark-surface text-sm rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-emerald-900/20 transition-colors cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                <span className="text-gradient dark:text-gradient-dark">Education</span>
              </h2>
              <div className="max-w-3xl mx-auto space-y-8">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.degree}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="card p-6 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={24} className="text-primary-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {edu.degree}
                      </h3>
                      <p className="text-primary-600 dark:text-emerald-400 font-medium mb-2">
                        {edu.institution} • {edu.year}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
