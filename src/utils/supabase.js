import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Create Supabase client with fallback for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're using placeholder values
const isUsingPlaceholders = supabaseUrl === 'https://placeholder.supabase.co'

if (isUsingPlaceholders && import.meta.env.DEV) {
  console.warn('⚠️ Using placeholder Supabase credentials. Please set up your .env file with real Supabase credentials for full functionality.')
}

// Database helper functions
export const projectsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    return data || []
  },

  async getByCategory(category) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const blogsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching blogs:', error)
      return []
    }
    return data || []
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  async create(blog) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const experienceAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching experience:', error)
      return []
    }
    return data || []
  },

  async create(experience) {
    const { data, error } = await supabase
      .from('experience')
      .insert([experience])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('experience')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const messagesAPI = {
  async create(message) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getAll() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }
    return data || []
  }
}

export const skillsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) {
      console.error('Error fetching skills:', error)
      return []
    }
    return data || []
  },

  async getByCategory() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) {
      console.error('Error fetching skills:', error)
      return []
    }
    
    // Group skills by category
    const grouped = {}
    data?.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill.name)
    })
    
    return Object.entries(grouped).map(([category, technologies]) => ({
      category,
      technologies,
      color: category === 'Frontend' ? 'from-blue-500 to-purple-600' :
             category === 'Backend' ? 'from-green-500 to-teal-600' :
             'from-orange-500 to-red-600'
    }))
  }
}

export const achievementsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
    return data || []
  }
}

// Storage helper functions
export const storageAPI = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
}

// Auth helper functions
export const visitorAPI = {
  async trackVisitor(visitorData) {
    const { data, error } = await supabase
      .from('visitor_stats')
      .insert([visitorData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getVisitorCount() {
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('visitor_id')
    
    if (error) {
      console.error('Error fetching visitor count:', error)
      return 0
    }
    
    // Count unique visitors
    const uniqueVisitors = new Set(data?.map(visit => visit.visitor_id) || [])
    return uniqueVisitors.size
  },

  async getTodayVisitors() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('visitor_id')
      .gte('visited_at', `${today}T00:00:00.000Z`)
      .lt('visited_at', `${today}T23:59:59.999Z`)
    
    if (error) {
      console.error('Error fetching today visitors:', error)
      return 0
    }
    
    const uniqueVisitors = new Set(data?.map(visit => visit.visitor_id) || [])
    return uniqueVisitors.size
  },

  async getVisitorByIdToday(visitorId) {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('visitor_id', visitorId)
      .gte('visited_at', `${today}T00:00:00.000Z`)
      .lt('visited_at', `${today}T23:59:59.999Z`)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateVisitorVisit(id, updates) {
    const { data, error } = await supabase
      .from('visitor_stats')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Auth helper functions
// Statistics API for Home page stats
export const statisticsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) {
      console.error('Error fetching statistics:', error)
      throw error
    }
    
    return data || []
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('statistics')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating statistic:', error)
      throw error
    }
    
    return data[0]
  },

  async create(statistic) {
    const { data, error } = await supabase
      .from('statistics')
      .insert([{
        ...statistic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      console.error('Error creating statistic:', error)
      throw error
    }
    
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('statistics')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting statistic:', error)
      throw error
    }
  }
}

// Resume API for managing resume file
export const resumeAPI = {
  async getResumeUrl() {
    try {
      const { data, error } = await supabase
        .from('resume_settings')
        .select('resume_url, filename, description')
        .single()
      
      if (error) {
        console.warn('Resume settings table not found, using default resume')
        return { resume_url: '/resume.pdf', filename: 'resume.pdf', description: null }
      }
      
      if (!data) {
        return { resume_url: '/resume.pdf', filename: 'resume.pdf', description: null }
      }
      
      return data
    } catch (error) {
      console.warn('Error fetching resume URL, using default:', error)
      return { resume_url: '/resume.pdf', filename: 'resume.pdf', description: null }
    }
  },

  async uploadResume(file) {
    try {
      // First, delete any existing custom resume
      await this.deleteOldResume()

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `resume_${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        // Fallback to base64 storage for development
        console.warn('Supabase storage upload failed, using base64 fallback')
        const base64Data = await this.fileToBase64(file)
        localStorage.setItem('resume_file', base64Data)
        localStorage.setItem('resume_filename', file.name)
        
        const resumeUrl = `data:application/pdf;base64,${base64Data.split(',')[1]}`
        
        // Try to save to database
        try {
          await this.saveResumeSettings(resumeUrl, file.name)
        } catch (dbError) {
          console.warn('Database save failed, using localStorage only')
        }
        
        return { resume_url: resumeUrl, filename: file.name }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      const resumeUrl = urlData.publicUrl

      // Save resume settings to database
      try {
        await this.saveResumeSettings(resumeUrl, file.name)
      } catch (dbError) {
        console.warn('Database save failed, but file uploaded successfully:', dbError)
        // Continue anyway - file is uploaded to storage
      }

      return { resume_url: resumeUrl, filename: file.name }
    } catch (error) {
      console.error('Error uploading resume:', error)
      throw error
    }
  },

  async deleteOldResume() {
    try {
      // Get current resume info
      const currentResume = await this.getResumeUrl()
      
      // Only delete if it's a custom resume (not the default)
      if (currentResume.resume_url !== '/resume.pdf' && currentResume.resume_url.startsWith('http')) {
        // Extract file path from URL for Supabase storage
        const urlParts = currentResume.resume_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `resumes/${fileName}`

        // Delete from storage (don't throw error if it fails)
        try {
          await supabase.storage
            .from('documents')
            .remove([filePath])
        } catch (storageError) {
          console.warn('Failed to delete old resume from storage:', storageError)
        }
      }

      // Clear localStorage fallback
      localStorage.removeItem('resume_file')
      localStorage.removeItem('resume_filename')
    } catch (error) {
      console.warn('Failed to delete old resume:', error)
      // Don't throw error, just continue with upload
    }
  },

  async saveResumeSettings(resumeUrl, filename, description = null) {
    const updateData = {
      id: 1,
      resume_url: resumeUrl,
      filename: filename,
      updated_at: new Date().toISOString()
    }
    
    if (description !== null) {
      updateData.description = description
    }

    const { data, error } = await supabase
      .from('resume_settings')
      .upsert(updateData)
      .select()

    if (error) {
      console.warn('Resume settings table not found. Please create the table using the SQL in SUPABASE_SETUP.md')
      throw new Error('Resume settings table not found. Please set up your database.')
    }
    return data[0]
  },

  async updateResumeMetadata(metadata) {
    const { data, error } = await supabase
      .from('resume_settings')
      .update({
        filename: metadata.filename,
        description: metadata.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()

    if (error) throw error
    return data[0]
  },

  async deleteResume() {
    try {
      // Get current resume info
      const currentResume = await this.getResumeUrl()
      
      if (currentResume.resume_url.startsWith('http')) {
        // Extract file path from URL for Supabase storage
        const urlParts = currentResume.resume_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `resumes/${fileName}`

        // Delete from storage
        await supabase.storage
          .from('documents')
          .remove([filePath])
      }

      // Reset to default in database
      await this.saveResumeSettings('/resume.pdf', 'resume.pdf')
      
      // Clear localStorage fallback
      localStorage.removeItem('resume_file')
      localStorage.removeItem('resume_filename')

      return { resume_url: '/resume.pdf', filename: 'resume.pdf' }
    } catch (error) {
      console.error('Error deleting resume:', error)
      throw error
    }
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  },

  // Utility function to force download
  forceDownload(url, filename) {
    try {
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      // For cross-origin URLs, try to fetch and create blob URL
      if (url.startsWith('http') && !url.includes(window.location.hostname)) {
        this.downloadCrossOrigin(url, filename)
        return
      }
      
      // Add to DOM temporarily
      document.body.appendChild(link)
      
      // Trigger download
      link.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      console.warn('Force download failed, falling back to window.open:', error)
      // Fallback: open in new tab
      window.open(url, '_blank')
    }
  },

  // Handle cross-origin downloads
  async downloadCrossOrigin(url, filename) {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }, 100)
    } catch (error) {
      console.warn('Cross-origin download failed:', error)
      // Final fallback
      window.open(url, '_blank')
    }
  }
}

export const authAPI = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
