import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Task, taskService } from '../services/taskService'
import { useAuth } from '../contexts/AuthContext'

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    // Only run once when session first becomes available
    // After that, auth token updates are handled globally in AuthContext
    // Don't recreate subscription on token refresh
    if (!session) {
      console.log('⏳ Waiting for initial session...')
      return
    }

    let channel: ReturnType<typeof supabase.channel> | null = null
    let mounted = true

    const setupRealtimeSubscription = async () => {
      try {
        console.log('🚀 Setting up tasks realtime subscription (one-time, session ready)')

        // Fetch initial tasks
        try {
          const data = await taskService.getTasks()
          if (mounted) {
            setTasks(data)
            console.log('Initial tasks loaded:', data.length)
          }
        } catch (err: any) {
          if (mounted) {
            setError(err.message)
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }

        // Subscribe to realtime changes AFTER auth is ready
        channel = supabase
          .channel('tasks-realtime-channel')
          .on('system', {}, (payload) => {
            // CRITICAL: This fires when postgres_changes is ACTUALLY ready
            // Without this, SUBSCRIBED doesn't mean postgres_changes is connected
            if (payload.extension === 'postgres_changes') {
              console.log('✅ postgres_changes extension READY - now truly connected!')
            }
          })
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks' },
            async (payload) => {
              console.log('🔥 Realtime event received:', payload.eventType, payload)

              if (!mounted) return

              if (payload.eventType === 'INSERT') {
                // Fetch complete task with joined data
                const newTask = await taskService.getTask(payload.new.id)
                if (newTask && mounted) {
                  console.log('➕ Adding new task:', newTask.title)
                  setTasks(prev => {
                    // Check if task already exists to avoid duplicates
                    const exists = prev.some(t => t.id === newTask.id)
                    if (exists) {
                      console.log('Task already exists, skipping')
                      return prev
                    }
                    return [newTask, ...prev]
                  })
                }
              } else if (payload.eventType === 'UPDATE') {
                // Fetch complete task with joined data
                const updatedTask = await taskService.getTask(payload.new.id)
                if (updatedTask && mounted) {
                  console.log('✏️ Updating task:', updatedTask.title)
                  setTasks(prev =>
                    prev.map(t => t.id === updatedTask.id ? updatedTask : t)
                  )
                }
              } else if (payload.eventType === 'DELETE') {
                if (mounted) {
                  console.log('🗑️ Deleting task:', payload.old.id)
                  setTasks(prev => prev.filter(t => t.id !== payload.old.id))
                }
              }
            }
          )
          .subscribe((status, err) => {
            console.log('📡 Realtime subscription status:', status)
            if (status === 'SUBSCRIBED') {
              console.log('📡 Channel SUBSCRIBED (waiting for postgres_changes to be ready...)')
            }
            if (status === 'CHANNEL_ERROR') {
              console.error('❌ Channel error:', err)
            }
            if (status === 'CLOSED') {
              console.warn('🔴 Channel CLOSED unexpectedly')
            }
            if (err) {
              console.error('❌ Realtime subscription error:', err)
              if (mounted) {
                setError(`Realtime subscription failed: ${err.message}`)
              }
            }
          })

        console.log('Channel created:', channel)
      } catch (err: any) {
        console.error('Failed to setup realtime:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    setupRealtimeSubscription()

    return () => {
      mounted = false
      if (channel) {
        console.log('🧹 Cleaning up realtime subscription (component unmount)')
        supabase.removeChannel(channel)
      }
    }
  }, [session ? session.user.id : null]) // Only run once when we first get a session

  return { tasks, loading, error, setTasks }
}
