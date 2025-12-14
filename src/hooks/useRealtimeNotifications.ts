import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Notification {
  id: string
  message: string
  type: 'task_created' | 'task_updated' | 'task_completed' | 'task_assigned'
  timestamp: Date
  taskId: string
  taskTitle: string
  read: boolean
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user, profile } = useAuth()

  useEffect(() => {
    const setupNotificationSubscription = async () => {
      // Wait for session to be ready
      const { data: { session } } = await supabase.auth.getSession()

      if (!session || !user || !profile) {
        console.warn('No active session for notification subscription')
        return
      }

      // Explicitly set auth token for realtime
      supabase.realtime.setAuth(session.access_token)

      // Subscribe to task changes
      const channel = supabase
        .channel('task-notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          async (payload) => {
            console.log('Notification event received:', payload.eventType, payload)

            // Filter based on role
            const isAdmin = profile.role === 'admin' || profile.role === 'partner' || profile.role === 'manager'
            const isAssignedToMe = payload.new?.assignee_id === user.id
            const isCreatedByMe = payload.new?.created_by === user.id

            // Admin sees all updates, staff/partner only see their tasks
            if (!isAdmin && !isAssignedToMe && !isCreatedByMe) {
              return
            }

            let message = ''
            let type: Notification['type'] = 'task_updated'

            if (payload.eventType === 'INSERT') {
              message = `New task created: ${payload.new.title}`
              type = 'task_created'
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.status === 'completed' && payload.old.status !== 'completed') {
                message = `Task completed: ${payload.new.title}`
                type = 'task_completed'
              } else if (payload.new.assignee_id !== payload.old.assignee_id && payload.new.assignee_id === user.id) {
                message = `Task assigned to you: ${payload.new.title}`
                type = 'task_assigned'
              } else {
                message = `Task updated: ${payload.new.title}`
                type = 'task_updated'
              }
            }

            const notification: Notification = {
              id: `${payload.new.id}-${Date.now()}`,
              message,
              type,
              timestamp: new Date(),
              taskId: payload.new.id,
              taskTitle: payload.new.title,
              read: false,
            }

            setNotifications(prev => [notification, ...prev])
          }
        )
        .subscribe((status, err) => {
          console.log('Notification subscription status:', status)
          if (err) {
            console.error('Notification subscription error:', err)
          }
        })

      return channel
    }

    let channel: ReturnType<typeof supabase.channel> | null = null

    setupNotificationSubscription().then((ch) => {
      if (ch) channel = ch
    })

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, profile])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }
}
