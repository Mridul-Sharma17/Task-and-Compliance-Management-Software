import { supabase } from '../lib/supabase'

export interface Task {
  id: string
  title: string
  description: string | null
  company_id: string | null
  assignee_id: string | null
  created_by: string | null
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  due_date: string | null
  progress: number
  tags: string[]
  parent_task_id: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  company?: { name: string }
  assignee?: { full_name: string; avatar_url: string | null }
}

export const taskService = {
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        company:companies(name),
        assignee:profiles!assignee_id(full_name, avatar_url)
      `)
      .order('due_date', { ascending: true, nullsFirst: false })

    if (error) throw error
    return data as Task[]
  },

  async getTask(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        company:companies(name),
        assignee:profiles!assignee_id(full_name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Task
  },

  async createTask(task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        created_by: user?.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    // Set completed_at when marking task as complete
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
    // Clear completed_at when unmarking completion
    else if (updates.status && updates.status !== 'completed') {
      updateData.completed_at = null
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getTaskComments(taskId: string) {
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        user:profiles!user_id(full_name, avatar_url)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async addComment(taskId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: user?.id,
        content
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getAssignableUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('role', ['partner', 'manager', 'staff'])
      .order('full_name', { ascending: true })

    if (error) throw error
    return data
  }
}
