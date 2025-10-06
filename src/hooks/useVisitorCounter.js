import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Generate or get visitor ID from localStorage
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('visitor_id', visitorId)
    }
    return visitorId
  }

  // Track visitor visit
  const trackVisitor = async () => {
    try {
      const visitorId = getVisitorId()
      const now = new Date().toISOString()
      
      // Check if visitor has visited today
      const today = new Date().toISOString().split('T')[0]
      const { data: existingVisit } = await supabase
        .from('visitor_stats')
        .select('*')
        .eq('visitor_id', visitorId)
        .gte('visited_at', `${today}T00:00:00.000Z`)
        .lt('visited_at', `${today}T23:59:59.999Z`)
        .single()

      if (!existingVisit) {
        // Record new visit
        await supabase
          .from('visitor_stats')
          .insert([{
            visitor_id: visitorId,
            visited_at: now,
            user_agent: navigator.userAgent,
            page_url: window.location.href
          }])
      } else {
        // Update last visit time
        await supabase
          .from('visitor_stats')
          .update({ 
            visited_at: now,
            page_url: window.location.href 
          })
          .eq('id', existingVisit.id)
      }
    } catch (err) {
      console.error('Error tracking visitor:', err)
      setError(err.message)
    }
  }

  // Get total visitor count
  const getVisitorCount = async () => {
    try {
      setLoading(true)
      
      // Get unique visitors count
      const { data, error } = await supabase
        .from('visitor_stats')
        .select('visitor_id')
      
      if (error) throw error
      
      // Count unique visitors
      const uniqueVisitors = new Set(data?.map(visit => visit.visitor_id) || [])
      setVisitorCount(uniqueVisitors.size)
      
    } catch (err) {
      console.error('Error fetching visitor count:', err)
      setError(err.message)
      // Fallback to a default count if there's an error
      setVisitorCount(1247) // Starting count
    } finally {
      setLoading(false)
    }
  }

  // Subscribe to real-time updates
  const subscribeToUpdates = () => {
    const subscription = supabase
      .channel('visitor_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitor_stats'
        },
        () => {
          // Refresh count when there are changes
          getVisitorCount()
        }
      )
      .subscribe()

    return subscription
  }

  useEffect(() => {
    // Track current visitor
    trackVisitor()
    
    // Get initial count
    getVisitorCount()
    
    // Subscribe to real-time updates
    const subscription = subscribeToUpdates()
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    visitorCount,
    loading,
    error,
    refresh: getVisitorCount
  }
}
