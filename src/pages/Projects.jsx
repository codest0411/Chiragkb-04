import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ExternalLink, Github, Filter, X } from 'lucide-react'
import { projectsAPI } from '../utils/supabase'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [availableCategories, setAvailableCategories] = useState(['All'])

  // Custom Image Component for handling uploaded images
  const ProjectImage = ({ src, alt, className }) => {
    const [imageSrc, setImageSrc] = useState(src)
    
    useEffect(() => {
      if (src && src.startsWith('/images/')) {
        const fileName = src.replace('/images/', '')
        const storedImage = localStorage.getItem(`project_image_${fileName}`)
        if (storedImage) {
          setImageSrc(storedImage)
        } else {
          setImageSrc(src)
        }
      } else {
        setImageSrc(src)
      }
    }, [src])
    
    return <img src={imageSrc} alt={alt} className={className} />
  }

  // Mock data for development (replace with actual Supabase data)
  const mockProjects = [
    {
      id: 1,
      title: 'CognEdge Teams – Remote Work Collaboration Suite',
      description: 'Developed a full-stack web app unifying real-time document editing, video conferencing, collaborative whiteboarding, task boards, and team chat',
      long_description: 'Developed a full-stack web app unifying real-time document editing, video conferencing, collaborative whiteboarding, task boards, and team chat. Implemented React.js, Node.js, WebRTC, Socket.io, PostgreSQL, and Tailwind CSS to ensure scalable architecture and responsive UI/UX. Enabled real-time collaboration for distributed teams, increasing productivity by 40%.',
      category: 'Full Stack',
      technologies: ['React.js', 'Node.js', 'WebRTC', 'Socket.io', 'PostgreSQL', 'Tailwind CSS'],
      image_url: '/images/cognedge-teams.png',
      github_url: 'https://github.com/codest0411/cognedge-teams',
      demo_url: 'https://cognedge-teams.vercel.app',
      featured: true,
      created_at: '2024-06-15'
    },
    {
      id: 2,
      title: 'VroomVroom – Uber Clone Web App',
      description: 'Built a full-stack ride-hailing app allowing users to book rides, track drivers, and process secure payments via Stripe',
      long_description: 'Built a full-stack ride-hailing app allowing users to book rides, track drivers, and process secure payments via Stripe. Leveraged Next.js, React.js, Node.js, Tailwind CSS, Supabase, MongoDB, WebSockets, and Google Maps API to implement authentication, ride history, driver dashboard, and payment receipts. Optimized real-time tracking system, reducing driver response latency by 35%.',
      category: 'Full Stack',
      technologies: ['Next.js', 'React.js', 'Node.js', 'Tailwind CSS', 'Supabase', 'MongoDB', 'WebSockets', 'Google Maps API', 'Stripe'],
      image_url: '/images/vroomvroom.png',
      github_url: 'https://github.com/codest0411/vroomvroom',
      demo_url: 'https://vroomvroom-app.vercel.app',
      featured: true,
      created_at: '2024-04-20'
    },
    {
      id: 3,
      title: 'Transcripto – AI Speech-to-Text Web App',
      description: 'Developed a full-stack app for audio recording, uploading, and transcription using the Speech-to Text API',
      long_description: 'Developed a full-stack app for audio recording, uploading, and transcription using the Speech-to Text API, integrated Supabase for real-time storage with 99% data consistency, and implemented a responsive UI with Tailwind CSS to enhance accessibility and user experience. Tech Stack: React.js, Node.js, Express.js, MongoDB/Supabase, Tailwind CSS',
      category: 'Full Stack',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Supabase', 'Tailwind CSS', 'Speech-to-Text API'],
      image_url: '/images/transcripto.png',
      github_url: 'https://github.com/codest0411/Client',
      demo_url: 'https://client-six-cyan.vercel.app/',
      featured: true,
      created_at: '2024-03-10'
    },
    {
      id: 4,
      title: 'Study Material Portal',
      description: 'Created a centralized platform for students to upload, manage, and access academic materials',
      long_description: 'Created a centralized platform for students to upload, manage, and access academic materials. Built with HTML, CSS, JavaScript, PHP, and WIX, improving content accessibility for over 500+ students.',
      category: 'Frontend',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'WIX'],
      image_url: '/images/study-portal.png',
      // github_url: 'https://github.com/codest0411/study-portal',
      demo_url: 'https://gurubhandarkar099.wixsite.com/study-material-bca-7',
      featured: true,
      created_at: '2024-01-15'
    }
  ]

  // Function to process category data from database
  const processCategory = (category) => {
    // If it's already an array, return as is
    if (Array.isArray(category)) {
      return category
    }
    
    // If it's a string that looks like JSON array, parse it
    if (typeof category === 'string') {
      // Check if it's a JSON array string like '["Full Stack","Backend"]'
      if (category.startsWith('[') && category.endsWith(']')) {
        try {
          const parsed = JSON.parse(category)
          return Array.isArray(parsed) ? parsed : [category]
        } catch (e) {
          // If parsing fails, treat as single category
          return [category]
        }
      }
      // If it's a regular string, return as single-item array
      return [category]
    }
    
    // Default fallback
    return []
  }

  // Function to generate categories from projects
  const generateCategories = (projectsData) => {
    const categorySet = new Set(['All'])
    
    projectsData.forEach(project => {
      if (Array.isArray(project.category)) {
        // Add each individual category from the array
        project.category.forEach(cat => {
          if (cat && typeof cat === 'string') {
            categorySet.add(cat)
          }
        })
      } else if (project.category && typeof project.category === 'string') {
        categorySet.add(project.category)
      }
    })
    
    const categories = Array.from(categorySet)
    // Sort with 'All' first, then alphabetically
    return categories.sort((a, b) => {
      if (a === 'All') return -1
      if (b === 'All') return 1
      return a.localeCompare(b)
    })
  }

  // Function to get project count for a category
  const getProjectCountForCategory = (category) => {
    if (category === 'All') return projects.length
    
    return projects.filter(project => {
      if (Array.isArray(project.category)) {
        return project.category.includes(category)
      } else if (typeof project.category === 'string') {
        return project.category === category
      }
      return false
    }).length
  }

  useEffect(() => {
    fetchProjects()
    
    // Set up periodic refresh to catch real-time featured/unfeatured changes
    const refreshInterval = setInterval(() => {
      fetchProjects()
    }, 5000) // Refresh every 5 seconds for real-time updates
    
    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => {
        // Handle both array and string categories for backward compatibility
        if (Array.isArray(project.category)) {
          return project.category.includes(selectedCategory)
        } else if (typeof project.category === 'string') {
          return project.category === selectedCategory
        }
        return false
      }))
    }
  }, [selectedCategory, projects])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      // Try to fetch from Supabase first
      const data = await projectsAPI.getAll()
      if (data && data.length > 0) {
        // Process projects to handle category data properly
        const processedProjects = data.map(project => ({
          ...project,
          category: processCategory(project.category)
        }))
        
        // Only show featured projects
        const featuredProjects = processedProjects.filter(project => project.featured === true)
        setProjects(featuredProjects)
        setFilteredProjects(featuredProjects)
        const categories = generateCategories(featuredProjects)
        console.log('Generated categories:', categories)
        setAvailableCategories(categories)
      } else {
        // Fallback to mock data if no projects in database (only featured ones)
        const processedMockProjects = mockProjects.map(project => ({
          ...project,
          category: processCategory(project.category)
        }))
        const featuredMockProjects = processedMockProjects.filter(project => project.featured === true)
        setProjects(featuredMockProjects)
        setFilteredProjects(featuredMockProjects)
        setAvailableCategories(generateCategories(featuredMockProjects))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Fallback to mock data on error (only featured ones)
      const processedMockProjects = mockProjects.map(project => ({
        ...project,
        category: processCategory(project.category)
      }))
      const featuredMockProjects = processedMockProjects.filter(project => project.featured === true)
      setProjects(featuredMockProjects)
      setFilteredProjects(featuredMockProjects)
      setAvailableCategories(generateCategories(featuredMockProjects))
    } finally {
      setLoading(false)
    }
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const ProjectModal = ({ project, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <ProjectImage
              src={project.image_url}
              alt={project.title}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-dark-bg/90 rounded-full hover:bg-white dark:hover:bg-dark-bg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {project.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.category) ? 
                  project.category.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-primary-100 dark:bg-emerald-900/20 text-primary-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  )) : 
                  <span className="px-3 py-1 bg-primary-100 dark:bg-emerald-900/20 text-primary-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                }
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {project.long_description}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-surface text-sm rounded-full text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <Github size={20} />
                  View Code
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return (
    <>
      <Helmet>
        <title>Projects - Portfolio</title>
        <meta name="description" content="Explore my portfolio of web development projects and applications." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding py-12 sm:py-16 md:py-20 hero-bg">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-responsive-3xl font-bold mb-4 sm:mb-6">
                My <span className="text-gradient dark:text-gradient-dark">Projects</span>
              </h1>
              <p className="text-responsive-base text-gray-600 dark:text-gray-400 leading-relaxed">
                A showcase of my work in web development, from full-stack applications to innovative solutions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="section-padding py-8 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4"
            >
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full font-medium transition-all duration-200 text-sm sm:text-base touch-target ${
                    selectedCategory === category
                      ? 'bg-primary-600/10 dark:bg-emerald-600/10 text-primary-700 dark:text-emerald-400 border border-primary-200 dark:border-emerald-600/20'
                      : 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/30'
                  }`}
                >
                  {category} ({getProjectCountForCategory(category)})
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="section-padding py-12 sm:py-16 md:py-20">
          <div className="container-custom">
            {loading ? (
              <div className="grid grid-responsive-3 gap-4 sm:gap-6 md:gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card p-4 sm:p-6 animate-pulse">
                    <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-dark-surface rounded-lg mb-3 sm:mb-4" />
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-dark-surface rounded mb-2" />
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-dark-surface rounded mb-3 sm:mb-4" />
                    <div className="flex gap-2">
                      <div className="h-5 sm:h-6 w-14 sm:w-16 bg-gray-200 dark:bg-dark-surface rounded" />
                      <div className="h-5 sm:h-6 w-14 sm:w-16 bg-gray-200 dark:bg-dark-surface rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-responsive-3 gap-4 sm:gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      layout
                      className="card group cursor-pointer overflow-hidden"
                      onClick={() => setSelectedProject(project)}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative overflow-hidden">
                        <ProjectImage
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {project.featured && (
                          <div className="absolute top-4 left-4 px-2 py-1 bg-primary-600 dark:bg-emerald-600 text-white text-xs font-medium rounded">
                            Featured
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-emerald-400 transition-colors flex-1 pr-2">
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {Array.isArray(project.category) ? 
                              project.category.slice(0, 2).map((cat) => (
                                <span key={cat} className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-xs text-gray-600 dark:text-gray-400 rounded">
                                  {cat}
                                </span>
                              )) : 
                              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-xs text-gray-600 dark:text-gray-400 rounded">
                                {project.category}
                              </span>
                            }
                            {Array.isArray(project.category) && project.category.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-xs text-gray-600 dark:text-gray-400 rounded">
                                +{project.category.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-primary-100 dark:bg-emerald-900/20 text-primary-600 dark:text-emerald-400 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400 text-xs rounded">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          {project.github_url && (
                            <Github size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
                          )}
                          {project.demo_url && (
                            <ExternalLink size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Filter size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try selecting a different category or check back later for new projects.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </>
  )
}

export default Projects
