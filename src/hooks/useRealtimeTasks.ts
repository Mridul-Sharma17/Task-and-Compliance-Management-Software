import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Task, taskService } from '../services/taskService'

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      // Wait for session to be ready
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        console.warn('No active session for realtime subscription')
        return
      }

      // Explicitly set auth token for realtime
      supabase.realtime.setAuth(session.access_token)

      // Fetch initial tasks
      try {
        const data = await taskService.getTasks()
        setTasks(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }

      // Subscribe to realtime changes AFTER auth is ready
      const channel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          async (payload) => {
            console.log('Realtime event received:', payload.eventType, payload)

            if (payload.eventType === 'INSERT') {
              const newTask = await taskService.getTask(payload.new.id)
              setTasks(prev => [...prev, newTask])
            } else if (payload.eventType === 'UPDATE') {
              const updatedTask = await taskService.getTask(payload.new.id)
              setTasks(prev =>
                prev.map(t => t.id === payload.new.id ? updatedTask : t)
              )
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => prev.filter(t => t.id !== payload.old.id))
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Realtime subscription status:', status)
          if (err) {
            console.error('Realtime subscription error:', err)
            setError(`Realtime subscription failed: ${err.message}`)
          }
        })

      return channel
    }

    let channel: ReturnType<typeof supabase.channel> | null = null

    setupRealtimeSubscription().then((ch) => {
      if (ch) channel = ch
    })

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return { tasks, loading, error, setTasks }
}
