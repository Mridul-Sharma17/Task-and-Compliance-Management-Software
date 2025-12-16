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
  const { user, profile, session } = useAuth()

  useEffect(() => {
    if (!user || !profile) {
      console.log('⏳ Waiting for user/profile to be ready...')
      return
    }

    if (!session) {
      console.log('⏳ Waiting for session to be ready for notifications...')
      return
    }

    let channel: ReturnType<typeof supabase.channel> | null = null
    let mounted = true

    const setupNotificationSubscription = async () => {
      try {
        // Explicitly set auth token for realtime
        console.log('🔑 Setting notification realtime auth token for session')
        supabase.realtime.setAuth(session.access_token)

        // Subscribe to task changes
        channel = supabase
          .channel('notifications-realtime-channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks' },
            async (payload) => {
              console.log('🔔 Notification event received:', payload.eventType, payload)

              if (!mounted) return

              // Filter based on role
              const isAdmin = profile.role === 'admin' || profile.role === 'partner' || profile.role === 'manager'
              const isAssignedToMe = payload.new?.assignee_id === user.id
              const isCreatedByMe = payload.new?.created_by === user.id

              // Admin sees all updates, staff/partner only see their tasks
              if (!isAdmin && !isAssignedToMe && !isCreatedByMe) {
                console.log('Notification filtered out (not relevant to user)')
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

              console.log('➕ Adding notification:', message)
              setNotifications(prev => [notification, ...prev])
            }
          )
          .subscribe((status, err) => {
            console.log('🔔 Notification subscription status:', status)
            if (status === 'SUBSCRIBED') {
              console.log('✅ Successfully subscribed to notification updates')
            }
            if (err) {
              console.error('❌ Notification subscription error:', err)
            }
          })

        console.log('Notification channel created:', channel)
      } catch (err: any) {
        console.error('Failed to setup notifications:', err)
      }
    }

    setupNotificationSubscription()

    return () => {
      mounted = false
      if (channel) {
        console.log('🧹 Cleaning up notification subscription')
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, profile?.role, session])

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
