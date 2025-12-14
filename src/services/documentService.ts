import { supabase } from '../lib/supabase'

export interface Document {
  id: string
  task_id: string | null
  company_id: string | null
  uploaded_by: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  created_at: string
}

export const documentService = {
  async uploadDocument(file: File, taskId?: string, companyId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert({
        task_id: taskId || null,
        company_id: companyId || null,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single()

    if (error) throw error
    return data as Document
  },

  async getDocuments(taskId?: string, companyId?: string) {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }

    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Document[]
  },

  async getDownloadUrl(filePath: string) {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) throw error
    return data.signedUrl
  },

  async deleteDocument(id: string, filePath: string) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath])

    if (storageError) throw storageError

    // Delete from database
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
