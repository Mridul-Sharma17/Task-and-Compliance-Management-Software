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
    let channel: ReturnType<typeof supabase.channel> | null = null
    let mounted = true

    const setupRealtimeSubscription = async () => {
      try {
        // Wait for session to be ready
        if (!session) {
          console.log('⏳ Waiting for session to be ready...')
          setLoading(false)
          return
        }

        // Explicitly set auth token for realtime
        console.log('🔑 Setting realtime auth token for session')
        supabase.realtime.setAuth(session.access_token)

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
              console.log('✅ Successfully subscribed to realtime updates')
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
        console.log('🧹 Cleaning up realtime subscription')
        supabase.removeChannel(channel)
      }
    }
  }, [session])

  return { tasks, loading, error, setTasks }
}
