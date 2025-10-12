import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Briefcase, GraduationCap, Award, Download, Calendar, MapPin } from 'lucide-react'
import { experienceAPI } from '../utils/supabase'

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for development
  const mockExperiences = [
    {
      id: 1,
      type: 'work',
      title: 'Web Development Intern',
      company: 'Labmentix',
      location: 'Bangalore (Remote)',
      start_date: '2025-07-01',
      end_date: null,
      current: true,
      description: 'Contributing to the development of dynamic, responsive web applications using React.js, Node.js, and MongoDB. Working in an Agile environment with daily standups and collaborative Git-based workflows.',
      achievements: [
        'Built and integrated reusable frontend components using Tailwind CSS',
        'Developed and tested RESTful APIs for dynamic data exchange',
        'Enhanced technical skills through client-side projects in fast-paced environment',
        'Participated in code reviews and collaborative development processes'
      ],
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'RESTful APIs', 'Git', 'Agile']
    },
    {
      id: 2,
      type: 'work',
      title: 'Web Development Intern',
      company: 'Leosias Technologies',
      location: 'Belagavi',
      start_date: '2025-01-01',
      end_date: '2025-02-28',
      current: false,
      description: 'Developed and optimized web applications, enhancing functionality and performance. Collaborated with team to build and deploy responsive, scalable web solutions.',
      achievements: [
        'Developed and optimized web applications enhancing functionality and performance',
        'Collaborated with team to build and deploy responsive, scalable web solutions',
        'Gained hands-on experience in full-stack development and applied best coding practices'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'Git']
    }
  ]

  const mockEducation = [
    {
      id: 3,
      type: 'education',
      title: 'Bachelor of Computer Applications (BCA)',
      company: 'KLE\'s B.K. BCA College, Chikodi',
      location: 'Chikodi, Karnataka',
      start_date: '2022-06-01',
      end_date: '2025-05-31',
      current: false,
      description: 'Focused on software engineering, web development, and database management. Strong foundation in programming and system design with specialization in full-stack development.',
      achievements: [
        'CGPA: 7.84',
        'Specialized in full-stack web development and MERN stack',
        'Active participation in KLE Technova Fest - won awards for Gaming & Web Development',
        'Strong foundation in Data Structures, Algorithms, and Database Management'
      ],
      technologies: ['Java', 'JavaScript', 'HTML5', 'CSS3', 'SQL', 'Data Structures', 'Algorithms']
    },
    {
      id: 4,
      type: 'education',
      title: 'Pre-University (Commerce)',
      company: 'Shri Hari Vidyalaya PU College',
      location: 'Ugar Khurd, Belagavi',
      start_date: '2020-06-01',
      end_date: '2022-05-31',
      current: false,
      description: 'Commerce stream with strong foundation in business mathematics and analytical thinking. Built problem-solving skills and logical reasoning abilities.',
      achievements: [
        'Percentage: 59.63%',
        'Commerce stream with focus on Mathematics and Business Studies',
        'Developed strong analytical and problem-solving skills'
      ],
      technologies: ['Mathematics', 'Business Studies', 'Analytical Thinking', 'Problem Solving']
    },
    {
      id: 5,
      type: 'education',
      title: 'SSLC (Secondary School Leaving Certificate)',
      company: 'Shri Hari Vidyalaya High School',
      location: 'Ugar Khurd, Belagavi',
      start_date: '2019-06-01',
      end_date: '2020-05-31',
      current: false,
      description: 'Completed secondary education with focus on science and mathematics. Built foundational knowledge in core subjects.',
      achievements: [
        'Percentage: 58.88%',
        'Strong performance in Mathematics and Science subjects',
        'Active participation in sports - won medals in Cricket & Badminton'
      ],
      technologies: ['Mathematics', 'Science', 'Basic Computer Knowledge']
    }
  ]

  const mockCertifications = [
    {
      id: 1,
      title: 'The Complete 2025 Full-Stack Web Development Bootcamp',
      issuer: 'Angela Yu, Udemy',
      date: '2024-12-01',
      credential_id: '61.5 Hours Course Completion',
      url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/'
    },
    {
      id: 2,
      title: 'State-level Free Fire & COD Gaming Tournaments - Best IGL Award',
      issuer: 'Gaming Tournament Organizers',
      date: '2023-2024',
      credential_id: 'GAMING-IGL-AWARD-2023',
      url: '#'
    },
    {
      id: 3,
      title: 'KLE Technova Fest Awards - Gaming & Web Development',
      issuer: 'KLE Technological University',
      date: '2024-03-15',
      credential_id: 'KLE-TECHNOVA-2024',
      url: '#'
    },
    {
      id: 4,
      title: 'Sparkmind Fest - Runner-up',
      issuer: 'Educational Institution',
      date: '2024-02-10',
      credential_id: 'SPARKMIND-RUNNERUP-2024',
      url: '#'
    },
    {
      id: 5,
      title: 'Cricket & Badminton Medals',
      issuer: 'Sports Competitions',
      date: '2020-2024',
      credential_id: 'SPORTS-MEDALS-2020-24',
      url: '#'
    }
  ]

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await experienceAPI.getAll()
        if (data && data.length > 0) {
          // Show all experiences (both current and past) for a complete timeline
          setExperiences(data)
        } else {
          // Fallback to mock data if no experiences in database
          setExperiences([...mockExperiences, ...mockEducation])
        }
      } catch (error) {
        console.error('Error fetching experience:', error)
        // Fallback to mock data
        setExperiences([...mockExperiences, ...mockEducation])
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
    
    // Set up periodic refresh to catch real-time changes from admin
    const refreshInterval = setInterval(() => {
      fetchExperience()
    }, 5000) // Refresh every 5 seconds for real-time updates
    
    return () => clearInterval(refreshInterval)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    }
  }

  const TimelineItem = ({ experience, index }) => {
    const isWork = experience.type === 'work'
    const Icon = isWork ? Briefcase : GraduationCap

    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
      >
        {/* Content */}
        <div className="flex-1 text-left">
          <div className="card p-6 max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <Icon size={20} className="text-primary-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {experience.title}
                </h3>
                <p className="text-primary-600 dark:text-emerald-400 font-medium">
                  {experience.company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>
                  {formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{experience.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
              {calculateDuration(experience.start_date, experience.end_date)}
            </p>

            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
              {experience.description}
            </p>

            {experience.achievements && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Achievements:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {experience.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-600 dark:text-emerald-400 mt-1">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-xs text-gray-600 dark:text-gray-400 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Line */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-primary-600 dark:bg-emerald-400 border-4 border-white dark:border-dark-bg shadow-lg" />
          {index < experiences.length - 1 && (
            <div className="w-0.5 h-24 bg-gray-300 dark:bg-gray-600 mt-4" />
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </motion.div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Experience - Portfolio</title>
        <meta name="description" content="My professional experience, education, and certifications in web development." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding py-20 hero-bg">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                My <span className="text-gradient dark:text-gradient-dark">Journey</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Professional experience, education, and continuous learning in technology
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient dark:text-gradient-dark">Experience & Education</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A timeline of my professional journey and educational background
              </p>
            </motion.div>

            {loading ? (
              <div className="space-y-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center gap-8">
                    <div className="flex-1">
                      <div className="card p-6 max-w-lg ml-auto animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-dark-surface rounded mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-dark-surface rounded mb-4" />
                        <div className="h-20 bg-gray-200 dark:bg-dark-surface rounded" />
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-dark-surface" />
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                {experiences.map((experience, index) => (
                  <TimelineItem
                    key={experience.id}
                    experience={experience}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="section-padding py-20 bg-gray-50 dark:bg-dark-surface">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient dark:text-gradient-dark">Certifications & Awards</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Professional certifications and recognitions that validate my expertise
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockCertifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="text-primary-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {cert.title}
                      </h3>
                      <p className="text-primary-600 dark:text-emerald-400 font-medium mb-2">
                        {cert.issuer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Issued: {formatDate(cert.date)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        ID: {cert.credential_id}
                      </p>
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 dark:text-emerald-400 hover:underline"
                      >
                          
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Download Section */}
        <section className="section-padding py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-gradient dark:text-gradient-dark">Want to Know More?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Download my complete resume for detailed information about my experience, 
                skills, and accomplishments.
              </p>
              <a
                href="/resume.pdf"
                download
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                <Download size={24} />
                Download Resume
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Experience
