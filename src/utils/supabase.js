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
