import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, Plus, Edit, Trash2, Save, X,
  BarChart3, Users, FileText, Briefcase, Mail, Sun, Moon, Upload, Download, File 
} from 'lucide-react'
import { projectsAPI, experienceAPI, authAPI, statisticsAPI, resumeAPI, supabase } from '../utils/supabase'
import { useTheme } from '../contexts/ThemeContext'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

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

  // Edit states
  const [editingProject, setEditingProject] = useState(null)
  const [editingExperience, setEditingExperience] = useState(null)
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showEditExperienceModal, setShowEditExperienceModal] = useState(false)
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', category: [], technologies: [], github_url: '', demo_url: '', image_url: '', featured: false
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [experienceForm, setExperienceForm] = useState({
    title: '', company: '', location: '', type: 'work', description: '', achievements: [], technologies: [], 
    start_date: '', end_date: '', current: false
  })

  // Data states
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [statistics, setStatistics] = useState([])
  const [currentResume, setCurrentResume] = useState({ resume_url: '/resume.pdf', filename: 'resume.pdf' })
  
  // Statistics editing states
  const [editingStatistic, setEditingStatistic] = useState(null)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [statisticForm, setStatisticForm] = useState({
    number: '', label: '', order: 1
  })
  
  // Resume states
  const [uploadingResume, setUploadingResume] = useState(false)
  const [selectedResumeFile, setSelectedResumeFile] = useState(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is already authenticated
      const currentUser = await authAPI.getCurrentUser()
      
      if (currentUser && currentUser.email === 'Admin@gmail.com') {
        setUser(currentUser)
        setIsAuthenticated(true)
        await loadDashboardData()
      } else {
        // Auto-login the admin user
        try {
          const { user: adminUser } = await authAPI.signIn('Admin@gmail.com', 'Chirag@00')
          setUser(adminUser)
          setIsAuthenticated(true)
          await loadDashboardData()
        } catch (authError) {
          console.error('Admin authentication failed:', authError)
          // Fallback to localStorage check for development
          const isAdminAuth = localStorage.getItem('isAdminAuthenticated')
          if (isAdminAuth) {
            setIsAuthenticated(true)
            await loadDashboardData()
          } else {
            navigate('/admin/login')
          }
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      // Fallback for development
      const isAdminAuth = localStorage.getItem('isAdminAuthenticated')
      if (isAdminAuth) {
        setIsAuthenticated(true)
        await loadDashboardData()
      } else {
        navigate('/admin/login')
      }
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load real data from Supabase
      const [projectsData, experiencesData, statisticsData, resumeData] = await Promise.all([
        projectsAPI.getAll(),
        experienceAPI.getAll(),
        statisticsAPI.getAll(),
        resumeAPI.getResumeUrl()
      ])
      
      setProjects(projectsData || [])
      setExperiences(experiencesData || [])
      setStatistics(statisticsData || [])
      setCurrentResume(resumeData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Fallback to your real data if Supabase fails
      setProjects([
        { id: 1, title: 'Transcripto – AI Speech-to-Text Web App', category: 'Full Stack', featured: true, created_at: '2024-01-15' },
        { id: 2, title: 'Study Material Portal', category: 'Frontend', featured: false, created_at: '2024-02-20' }
      ])
      setExperiences([
        { id: 1, title: 'Web Development Intern', company: 'Labmentix', type: 'work', current: true },
        { id: 2, title: 'Bachelor of Computer Applications', company: 'KLE\'s B.K. BCA College', type: 'education', current: false }
      ])
      setStatistics([
        { id: 1, number: '5+', label: 'Projects Completed', order: 1 },
        { id: 2, number: '1+', label: 'Years Experience', order: 2 },
        { id: 3, number: '8+', label: 'Students Helped', order: 3 },
        { id: 4, number: '10+', label: 'Technologies', order: 4 }
      ])
    } finally {
      setLoading(false)
    }
  }


  const handleLogout = async () => {
    try {
      await authAPI.signOut()
      localStorage.removeItem('isAdminAuthenticated')
      localStorage.removeItem('rememberAdmin')
      setUser(null)
      setIsAuthenticated(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if Supabase fails
      localStorage.removeItem('isAdminAuthenticated')
      localStorage.removeItem('rememberAdmin')
      setUser(null)
      setIsAuthenticated(false)
      navigate('/')
    }
  }

  // Edit modal functions
  const openEditProjectModal = (project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      category: Array.isArray(project.category) ? project.category : (project.category ? [project.category] : []),
      technologies: project.technologies || [],
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      image_url: project.image_url || '',
      featured: project.featured || false
    })
    setShowEditProjectModal(true)
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    try {
      const updatedProject = {
        ...editingProject,
        ...projectForm,
        updated_at: new Date().toISOString()
      }

      await projectsAPI.update(editingProject.id, updatedProject)
      
      // Update local state for immediate visibility
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id ? updatedProject : p
      ))
      
      setShowEditProjectModal(false)
      setEditingProject(null)
      setProjectForm({ title: '', description: '', category: [], technologies: [], github_url: '', demo_url: '', image_url: '', featured: false })
      alert('Project updated successfully!')
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project: ' + error.message)
    }
  }

  // Edit modal functions for Experience
  const openEditExperienceModal = (experience) => {
    setEditingExperience(experience)
    setExperienceForm({
      title: experience.title || '',
      company: experience.company || '',
      location: experience.location || '',
      type: experience.type || 'work',
      description: experience.description || '',
      achievements: experience.achievements || [],
      technologies: experience.technologies || [],
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      current: experience.current || false
    })
    setShowEditExperienceModal(true)
  }

  const handleUpdateExperience = async (e) => {
    e.preventDefault()
    try {
      const updatedExperience = {
        ...editingExperience,
        ...experienceForm,
        start_date: experienceForm.start_date || null,
        end_date: experienceForm.end_date || null,
        updated_at: new Date().toISOString()
      }

      await experienceAPI.update(editingExperience.id, updatedExperience)
      
      // Update local state for immediate visibility
      setExperiences(prev => prev.map(e => 
        e.id === editingExperience.id ? updatedExperience : e
      ))
      
      setShowEditExperienceModal(false)
      setEditingExperience(null)
      setExperienceForm({ title: '', company: '', location: '', type: 'work', description: '', achievements: [], technologies: [], start_date: '', end_date: '', current: false })
      alert('Experience updated successfully!')
    } catch (error) {
      console.error('Failed to update experience:', error)
      alert('Failed to update experience: ' + error.message)
    }
  }

  // Real-time edit functions (keeping for compatibility)
  const handleEditProject = async (project) => {
    try {
      await projectsAPI.update(project.id, project)
      setProjects(prev => prev.map(p => p.id === project.id ? project : p))
      setEditingProject(null)
      alert('Project updated successfully!')
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project: ' + error.message)
    }
  }

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Try Supabase first, fallback to local state update
        try {
          await projectsAPI.delete(id)
        } catch (supabaseError) {
          console.warn('Supabase delete failed, using local fallback:', supabaseError)
          // Remove from local state as fallback
          setProjects(prev => prev.filter(p => p.id !== id))
        }
        // Don't reload data to preserve the delete changes
        alert('Project deleted successfully!')
      } catch (error) {
        console.error('Failed to delete project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }


  const handleEditExperience = async (experience) => {
    try {
      // Try Supabase first, fallback to local state update
      try {
        await experienceAPI.update(experience.id, experience)
      } catch (supabaseError) {
        console.warn('Supabase update failed, using local fallback:', supabaseError)
        // Update local state as fallback
        setExperiences(prev => prev.map(e => e.id === experience.id ? experience : e))
      }
      // Don't reload data to preserve the edit changes
      setEditingExperience(null)
      alert('Experience updated successfully!')
    } catch (error) {
      console.error('Failed to update experience:', error)
      alert('Failed to update experience. Please try again.')
    }
  }

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        // Try Supabase first, fallback to local state update
        try {
          await experienceAPI.delete(id)
        } catch (supabaseError) {
          console.warn('Supabase delete failed, using local fallback:', supabaseError)
          // Remove from local state as fallback
          setExperiences(prev => prev.filter(e => e.id !== id))
        }
        // Don't reload data to preserve the delete changes
        alert('Experience deleted successfully!')
      } catch (error) {
        console.error('Failed to delete experience:', error)
        alert('Failed to delete experience. Please try again.')
      }
    }
  }


  // Image handling functions
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Generate image URL based on project title
      const fileName = projectForm.title ? 
        projectForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.png' :
        'project-' + Date.now() + '.png'
      setProjectForm({...projectForm, image_url: `/images/${fileName}`})
    }
  }

  const uploadImageToPublic = async (file, fileName) => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData()
      formData.append('image', file)
      formData.append('fileName', fileName)
      
      // For client-side only approach, we'll convert to base64 and store
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Store the base64 image data
          const base64Data = reader.result
          localStorage.setItem(`project_image_${fileName}`, base64Data)
          resolve(`/images/${fileName}`)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  // Create functions
  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      let finalImageUrl = projectForm.image_url

      // Automatically handle image upload if an image was selected
      if (selectedImage) {
        const fileName = projectForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.png'
        finalImageUrl = await uploadImageToPublic(selectedImage, fileName)
      }

      // Create project with authenticated user
      const newProject = await projectsAPI.create({
        ...projectForm,
        image_url: finalImageUrl,
        created_at: new Date().toISOString()
      })
      
      // Add to local state for immediate visibility
      setProjects(prev => [newProject, ...prev])
      setShowProjectModal(false)
      setProjectForm({ title: '', description: '', category: [], technologies: [], github_url: '', demo_url: '', image_url: '', featured: false })
      setSelectedImage(null)
      setImagePreview(null)
      alert('Project created successfully with image!')
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project: ' + error.message)
    }
  }

  const handleCreateExperience = async (e) => {
    e.preventDefault()
    try {
      // Prepare experience data with proper date handling
      const experienceData = {
        ...experienceForm,
        start_date: experienceForm.start_date || null,
        end_date: experienceForm.end_date || null,
        created_at: new Date().toISOString()
      }

      // Create experience with authenticated user
      const newExperience = await experienceAPI.create(experienceData)
      
      // Add to local state for immediate visibility
      setExperiences(prev => [newExperience, ...prev])
      setShowExperienceModal(false)
      setExperienceForm({ title: '', company: '', location: '', type: 'work', description: '', achievements: [], technologies: [], start_date: '', end_date: '', current: false })
      alert('Experience created successfully!')
    } catch (error) {
      console.error('Failed to create experience:', error)
      alert('Failed to create experience: ' + error.message)
    }
  }

  // Toggle featured status
  const toggleProjectFeatured = async (project) => {
    try {
      await projectsAPI.update(project.id, { ...project, featured: !project.featured })
      // Update local state for immediate visibility
      setProjects(prev => prev.map(p => 
        p.id === project.id ? { ...p, featured: !p.featured } : p
      ))
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project: ' + error.message)
    }
  }

  // Toggle current status
  const toggleExperienceCurrent = async (experience) => {
    try {
      await experienceAPI.update(experience.id, { ...experience, current: !experience.current })
      // Update local state for immediate visibility
      setExperiences(prev => prev.map(e => 
        e.id === experience.id ? { ...e, current: !e.current } : e
      ))
    } catch (error) {
      console.error('Failed to update experience:', error)
      alert('Failed to update experience: ' + error.message)
    }
  }

  // Statistics management functions
  const handleEditStatistic = async (statistic) => {
    try {
      await statisticsAPI.update(statistic.id, statistic)
      setStatistics(prev => prev.map(s => s.id === statistic.id ? statistic : s))
      setEditingStatistic(null)
      alert('Statistic updated successfully!')
    } catch (error) {
      console.error('Failed to update statistic:', error)
      alert('Failed to update statistic: ' + error.message)
    }
  }

  const handleDeleteStatistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await statisticsAPI.delete(id)
        setStatistics(prev => prev.filter(s => s.id !== id))
        alert('Statistic deleted successfully!')
      } catch (error) {
        console.error('Failed to delete statistic:', error)
        alert('Failed to delete statistic: ' + error.message)
      }
    }
  }

  const handleCreateStatistic = async (e) => {
    e.preventDefault()
    try {
      const newStatistic = await statisticsAPI.create(statisticForm)
      
      setStatistics(prev => [...prev, newStatistic])
      setShowStatisticsModal(false)
      setStatisticForm({ number: '', label: '', order: 1 })
      alert('Statistic created successfully!')
    } catch (error) {
      console.error('Failed to create statistic:', error)
      alert('Failed to create statistic: ' + error.message)
    }
  }

  // Resume management functions
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setSelectedResumeFile(file)
    setUploadingResume(true)

    try {
      const resumeData = await resumeAPI.uploadResume(file)
      setCurrentResume(resumeData)
      setSelectedResumeFile(null)
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('resumeUpdated', { detail: resumeData }))
      
      alert('Resume uploaded successfully! The new resume is now active and available for download on the Home page.')
    } catch (error) {
      console.error('Failed to upload resume:', error)
      if (error.message.includes('resume_settings')) {
        alert('Database setup required!\n\nPlease run the SQL script in create_resume_table.sql in your Supabase dashboard to create the resume_settings table.')
      } else {
        alert('Failed to upload resume: ' + error.message)
      }
    } finally {
      setUploadingResume(false)
    }
  }

  const handleDeleteResume = async () => {
    if (window.confirm('Are you sure you want to delete the current custom resume?\n\nThis will:\n• Remove the uploaded resume file\n• Reset to the default resume\n• Update the download link on the Home page')) {
      try {
        const resumeData = await resumeAPI.deleteResume()
        setCurrentResume(resumeData)
        
        // Trigger real-time update
        window.dispatchEvent(new CustomEvent('resumeUpdated', { detail: resumeData }))
        
        alert('Custom resume deleted successfully! Reverted to default resume.')
      } catch (error) {
        console.error('Failed to delete resume:', error)
        alert('Failed to delete resume: ' + error.message)
      }
    }
  }


  const handleReplaceResume = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingResume(true)

    try {
      const resumeData = await resumeAPI.uploadResume(file)
      setCurrentResume(resumeData)
      
      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('resumeUpdated', { detail: resumeData }))
      
      alert('Resume replaced successfully! The new resume is now active and live on the Home page.')
    } catch (error) {
      console.error('Failed to replace resume:', error)
      if (error.message.includes('resume_settings')) {
        alert('Database setup required!\n\nPlease run the SQL script in create_resume_table.sql in your Supabase dashboard to create the resume_settings table.')
      } else {
        alert('Failed to replace resume: ' + error.message)
      }
    } finally {
      setUploadingResume(false)
    }
  }

  // Handle multiple category selection
  const handleCategoryChange = (category) => {
    const currentCategories = projectForm.category || []
    const isSelected = currentCategories.includes(category)
    
    if (isSelected) {
      // Remove category
      setProjectForm({
        ...projectForm,
        category: currentCategories.filter(cat => cat !== category)
      })
    } else {
      // Add category
      setProjectForm({
        ...projectForm,
        category: [...currentCategories, category]
      })
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Users },
    { id: 'statistics', label: 'Statistics', icon: FileText },
    { id: 'resume', label: 'Resume', icon: File }
  ]

  const stats = [
    { label: 'Total Projects', value: projects.length, color: 'bg-blue-500' },
    { label: 'Work Experience', value: experiences.filter(e => e.type === 'work').length, color: 'bg-purple-500' },
    { label: 'Education', value: experiences.filter(e => e.type === 'education').length, color: 'bg-green-500' }
  ]

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {!isAuthenticated ? 'Authenticating admin user...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    )
  }


  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Portfolio</title>
      </Helmet>

      <div className="h-screen w-screen bg-gray-50 dark:bg-dark-bg overflow-auto flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
            {/* Left side - Title and Welcome */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    Welcome back, Chirag. Manage your portfolio content in real-time.
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-500">Current:</span>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 touch-target"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base touch-target"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col px-2 sm:px-4 py-3 sm:py-4">

          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 flex-1">
            {/* Sidebar */}
            <div className="w-full lg:w-56 xl:w-64 lg:flex-shrink-0">
              <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border shadow-sm p-2 lg:p-3">
                <nav className="lg:space-y-1">
                  <div className="flex lg:flex-col gap-1 lg:gap-0 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-3 text-left rounded-lg transition-colors whitespace-nowrap lg:w-full text-sm lg:text-base touch-target ${
                        activeTab === tab.id
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                      }`}
                    >
                      <tab.icon size={20} />
                      {tab.label}
                    </button>
                  ))}
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 w-full bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border shadow-sm p-3 lg:p-4">
              {activeTab === 'overview' && (
                <div className="space-y-2 lg:space-y-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                      Dashboard Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border"
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg sm:text-xl">{stat.value}</span>
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Projects */}
                  <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Recent Projects
                    </h3>
                    <div className="space-y-3">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{project.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {Array.isArray(project.category) ? project.category.join(', ') : project.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.featured && (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Projects
                    </h2>
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50 dark:bg-dark-surface">
                          <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                              Category
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                              Image
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Featured
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                              Created
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                          {projects.map((project) => (
                            <tr key={project.id}>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                <div className="max-w-[150px] sm:max-w-none truncate">{project.title}</div>
                                <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {Array.isArray(project.category) ? project.category.join(', ') : project.category}
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(project.category) ? 
                                    project.category.map((cat) => (
                                      <span key={cat} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                                        {cat}
                                      </span>
                                    )) : 
                                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                                      {project.category}
                                    </span>
                                  }
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {project.image_url ? (
                                  <ProjectImage src={project.image_url} alt={project.title} className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded" />
                                ) : (
                                  <span className="text-gray-400 text-xs">No image</span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleProjectFeatured(project)}
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors touch-target ${
                                    project.featured 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  <span className="hidden sm:inline">{project.featured ? 'Featured' : 'Not Featured'}</span>
                                  <span className="sm:hidden">{project.featured ? '★' : '☆'}</span>
                                </button>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                {new Date(project.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-1 sm:gap-2">
                                  <button 
                                    onClick={() => openEditProjectModal(project)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded touch-target"
                                    title="Edit Project"
                                  >
                                    <Edit size={14} className="sm:w-4 sm:h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded touch-target"
                                    title="Delete Project"
                                  >
                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Experience & Education
                    </h2>
                    <button
                      onClick={() => setShowExperienceModal(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add Experience
                    </button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-surface">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Current
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                          {experiences.map((experience) => (
                            <tr key={experience.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {experience.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {experience.company}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  experience.type === 'work' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                }`}>
                                  {experience.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleExperienceCurrent(experience)}
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                    experience.current 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {experience.current ? 'Current' : 'Past'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => openEditExperienceModal(experience)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                    title="Edit Experience"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteExperience(experience.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'statistics' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Home Page Statistics
                    </h2>
                    <button
                      onClick={() => setShowStatisticsModal(true)}
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                      <span>Add Statistic</span>
                    </button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <table className="w-full min-w-[500px]">
                        <thead className="bg-gray-50 dark:bg-dark-surface">
                          <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Number
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Label
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                              Order
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                          {statistics.map((statistic) => (
                            <tr key={statistic.id}>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {editingStatistic?.id === statistic.id ? (
                                  <input
                                    type="text"
                                    value={editingStatistic.number}
                                    onChange={(e) => setEditingStatistic({...editingStatistic, number: e.target.value})}
                                    className="w-20 px-2 py-1 text-sm border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100"
                                    onBlur={() => handleEditStatistic(editingStatistic)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditStatistic(editingStatistic)}
                                    autoFocus
                                  />
                                ) : (
                                  <span 
                                    onClick={() => setEditingStatistic(statistic)}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                                  >
                                    {statistic.number}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 dark:text-gray-400">
                                {editingStatistic?.id === statistic.id ? (
                                  <input
                                    type="text"
                                    value={editingStatistic.label}
                                    onChange={(e) => setEditingStatistic({...editingStatistic, label: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100"
                                    onBlur={() => handleEditStatistic(editingStatistic)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditStatistic(editingStatistic)}
                                  />
                                ) : (
                                  <span 
                                    onClick={() => setEditingStatistic(statistic)}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                                  >
                                    {statistic.label}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                {editingStatistic?.id === statistic.id ? (
                                  <input
                                    type="number"
                                    value={editingStatistic.order}
                                    onChange={(e) => setEditingStatistic({...editingStatistic, order: parseInt(e.target.value)})}
                                    className="w-16 px-2 py-1 text-sm border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100"
                                    onBlur={() => handleEditStatistic(editingStatistic)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleEditStatistic(editingStatistic)}
                                  />
                                ) : (
                                  <span 
                                    onClick={() => setEditingStatistic(statistic)}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                                  >
                                    {statistic.order}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-1 sm:gap-2">
                                  <button 
                                    onClick={() => setEditingStatistic(statistic)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded touch-target"
                                    title="Edit Statistic"
                                  >
                                    <Edit size={14} className="sm:w-4 sm:h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteStatistic(statistic.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded touch-target"
                                    title="Delete Statistic"
                                  >
                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="mt-8 card">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Live Preview - How it appears on Home page
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 text-center p-4 lg:p-6 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      {statistics.map((stat, index) => (
                        <div key={stat.id} className="space-y-2">
                          <h3 className="text-3xl md:text-4xl font-bold text-gradient dark:text-gradient-dark">
                            {stat.number}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Resume Management
                    </h2>
                  </div>

                  {/* Current Resume Info */}
                  <div className="card mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Current Resume
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <File size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {currentResume.filename}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {currentResume.resume_url === '/resume.pdf' ? 'Default resume' : 'Custom uploaded resume'}
                            </p>
                            {currentResume.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {currentResume.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={currentResume.resume_url}
                          download={currentResume.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2"
                          onClick={(e) => {
                            // Force download instead of opening in browser
                            e.preventDefault()
                            resumeAPI.forceDownload(currentResume.resume_url, currentResume.filename)
                          }}
                        >
                          <Download size={16} />
                          Download
                        </a>
                        
                        <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                          <Upload size={16} />
                          {uploadingResume ? 'Replacing...' : 'Replace File'}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleReplaceResume}
                            disabled={uploadingResume}
                            className="hidden"
                          />
                        </label>

                        {currentResume.resume_url !== '/resume.pdf' && (
                          <button
                            onClick={handleDeleteResume}
                            className="btn-danger flex items-center gap-2"
                            title="Delete custom resume and revert to default"
                            disabled={uploadingResume}
                          >
                            <Trash2 size={16} />
                            Remove Custom
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload New Resume */}
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Upload New Resume
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <Upload size={32} className="text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                              Upload Resume File
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Supported formats: PDF, DOC, DOCX (Max 5MB)
                            </p>
                            <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                              <Upload size={16} />
                              {uploadingResume ? 'Uploading...' : 'Choose File'}
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                disabled={uploadingResume}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {selectedResumeFile && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <File size={20} className="text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-medium text-blue-900 dark:text-blue-100">
                                {selectedResumeFile.name}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {(selectedResumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {uploadingResume && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                            <p className="text-yellow-800 dark:text-yellow-200">
                              Uploading resume... Please wait.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      📋 Instructions
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• <strong>Edit Details:</strong> Click "Edit" to modify filename and description</li>
                      <li>• <strong>Replace File:</strong> Use "Replace File" to upload a new version</li>
                      <li>• <strong>Upload New:</strong> Drag & drop or click to upload first-time resume</li>
                      <li>• <strong>Real-time Updates:</strong> All changes reflect immediately on Home page</li>
                      <li>• <strong>Remove Custom:</strong> Delete uploaded resume to revert to default</li>
                      <li>• <strong>Supported Formats:</strong> PDF, DOC, DOCX (max 5MB)</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <textarea
                placeholder="Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories (Select multiple)
                </label>
                <div className="space-y-2">
                  {['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps'].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.category.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-emerald-600 focus:ring-primary-500 dark:focus:ring-emerald-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">{category}</span>
                    </label>
                  ))}
                </div>
                {projectForm.category.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {projectForm.category.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-emerald-900/20 text-primary-800 dark:text-emerald-200 text-xs rounded-full"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(cat)}
                          className="hover:text-primary-600 dark:hover:text-emerald-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="url"
                placeholder="GitHub URL"
                value={projectForm.github_url}
                onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="url"
                placeholder="Demo URL"
                value={projectForm.demo_url}
                onChange={(e) => setProjectForm({...projectForm, demo_url: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  📸 Project Screenshot
                </label>
                
                {/* Image Upload - Main Option */}
                <div className="mb-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full p-2 border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    📤 Upload your project screenshot - it will automatically appear on your portfolio!
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded border"
                    />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                      ✅ Perfect! This image will appear on your project automatically
                    </p>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                />
                Featured Project
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Create Project</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowProjectModal(false)
                    setProjectForm({ title: '', description: '', category: [], technologies: [], github_url: '', demo_url: '', image_url: '', featured: false })
                    setSelectedImage(null)
                    setImagePreview(null)
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Experience</h3>
            <form onSubmit={handleCreateExperience} className="space-y-4">
              <input
                type="text"
                placeholder="Job Title / Degree"
                value={experienceForm.title}
                onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Company / Institution"
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={experienceForm.location}
                onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <select
                value={experienceForm.type}
                onChange={(e) => setExperienceForm({...experienceForm, type: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="work">Work Experience</option>
                <option value="education">Education</option>
              </select>
              <textarea
                placeholder="Description"
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={experienceForm.start_date}
                  onChange={(e) => setExperienceForm({...experienceForm, start_date: e.target.value})}
                  className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={experienceForm.end_date}
                  onChange={(e) => setExperienceForm({...experienceForm, end_date: e.target.value})}
                  className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={experienceForm.current}
                />
              </div>
              <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({...experienceForm, current: e.target.checked, end_date: e.target.checked ? '' : experienceForm.end_date})}
                />
                Currently Working/Studying Here
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Create Experience</button>
                <button 
                  type="button" 
                  onClick={() => setShowExperienceModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Project</h3>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <textarea
                placeholder="Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories (Select multiple)
                </label>
                <div className="space-y-2">
                  {['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps'].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.category.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-emerald-600 focus:ring-primary-500 dark:focus:ring-emerald-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">{category}</span>
                    </label>
                  ))}
                </div>
                {projectForm.category.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {projectForm.category.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-emerald-900/20 text-primary-800 dark:text-emerald-200 text-xs rounded-full"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(cat)}
                          className="hover:text-primary-600 dark:hover:text-emerald-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="url"
                placeholder="GitHub URL"
                value={projectForm.github_url}
                onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="url"
                placeholder="Demo URL"
                value={projectForm.demo_url}
                onChange={(e) => setProjectForm({...projectForm, demo_url: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={projectForm.image_url}
                onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                />
                Featured Project
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Update Project</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditProjectModal(false)
                    setEditingProject(null)
                    setProjectForm({ title: '', description: '', category: [], technologies: [], github_url: '', demo_url: '', image_url: '', featured: false })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Experience Modal */}
      {showEditExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Experience</h3>
            <form onSubmit={handleUpdateExperience} className="space-y-4">
              <input
                type="text"
                placeholder="Job Title / Degree"
                value={experienceForm.title}
                onChange={(e) => setExperienceForm({...experienceForm, title: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Company / Institution"
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={experienceForm.location}
                onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <select
                value={experienceForm.type}
                onChange={(e) => setExperienceForm({...experienceForm, type: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="work">Work Experience</option>
                <option value="education">Education</option>
              </select>
              <textarea
                placeholder="Description"
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={experienceForm.start_date}
                onChange={(e) => setExperienceForm({...experienceForm, start_date: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="date"
                placeholder="End Date"
                value={experienceForm.end_date}
                onChange={(e) => setExperienceForm({...experienceForm, end_date: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={experienceForm.current}
              />
              <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <input
                  type="checkbox"
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({...experienceForm, current: e.target.checked, end_date: e.target.checked ? '' : experienceForm.end_date})}
                />
                Currently Active
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Update Experience</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditExperienceModal(false)
                    setEditingExperience(null)
                    setExperienceForm({ title: '', company: '', location: '', type: 'work', description: '', achievements: [], technologies: [], start_date: '', end_date: '', current: false })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatisticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Statistic</h3>
            <form onSubmit={handleCreateStatistic} className="space-y-4">
              <input
                type="text"
                placeholder="Number (e.g., 5+, 100, 2.5K)"
                value={statisticForm.number}
                onChange={(e) => setStatisticForm({...statisticForm, number: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Label (e.g., Projects Completed)"
                value={statisticForm.label}
                onChange={(e) => setStatisticForm({...statisticForm, label: e.target.value})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="number"
                placeholder="Display Order"
                value={statisticForm.order}
                onChange={(e) => setStatisticForm({...statisticForm, order: parseInt(e.target.value)})}
                className="input-responsive border rounded dark:bg-dark-card dark:border-dark-border dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Create Statistic</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowStatisticsModal(false)
                    setStatisticForm({ number: '', label: '', order: 1 })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
