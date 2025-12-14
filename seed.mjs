import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnsrwwctksqsonwnbgvd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Induc3J3d2N0a3Nxc29ud25iZ3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzU3NzMsImV4cCI6MjA4MTExMTc3M30.U5FyGiyIzK8gs9tgrQHXjvL4PL57DwwBDkG_VDGZWL8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedData() {
  console.log('🌱 Starting data seeding...')

  try {
    // Insert company
    console.log('📦 Inserting company...')
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Acme Corporation Ltd.',
        registration_number: 'U12345MH2020PTC123456',
        industry: 'Technology',
        contact_email: 'contact@acmecorp.com',
        contact_phone: '+91-22-12345678'
      })
      .select()
      .single()

    if (companyError) throw companyError
    console.log('✅ Company created:', company.name)

    // Get user profile
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('⚠️  No authenticated user. Please sign in first.')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      console.log('⚠️  No profile found for user.')
      return
    }

    console.log('👤 Using profile:', profile.email)

    // Insert tasks
    const tasks = [
      {
        title: 'Annual ROC Filing - MGT-7 & AOC-4',
        description: 'Complete and file Annual Return (MGT-7) and Financial Statements (AOC-4) with the Registrar of Companies before the statutory deadline.',
        company_id: company.id,
        assignee_id: profile.id,
        created_by: profile.id,
        status: 'in_progress',
        priority: 'high',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 45,
        tags: ['ROC', 'Annual Filing', 'Compliance']
      },
      {
        title: 'DIR-3 KYC for Directors',
        description: 'File DIR-3 KYC for all active directors before September 30th deadline.',
        company_id: company.id,
        assignee_id: profile.id,
        created_by: profile.id,
        status: 'pending',
        priority: 'medium',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 0,
        tags: ['Directors', 'KYC', 'Compliance']
      },
      {
        title: 'Board Meeting Minutes - Q4',
        description: 'Prepare and circulate board meeting minutes for Q4 review and approval.',
        company_id: company.id,
        assignee_id: profile.id,
        created_by: profile.id,
        status: 'review',
        priority: 'low',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 80,
        tags: ['Board', 'Minutes', 'Documentation']
      },
      {
        title: 'GST Return Filing - GSTR-3B',
        description: 'File monthly GST return GSTR-3B for the current tax period.',
        company_id: company.id,
        assignee_id: profile.id,
        created_by: profile.id,
        status: 'pending',
        priority: 'high',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 20,
        tags: ['GST', 'Tax', 'Monthly']
      },
      {
        title: 'Update Registered Office Address',
        description: 'File INC-22 to update the registered office address change with MCA.',
        company_id: company.id,
        assignee_id: profile.id,
        created_by: profile.id,
        status: 'completed',
        priority: 'medium',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 100,
        tags: ['MCA', 'Address Change', 'INC-22']
      }
    ]

    console.log('📝 Inserting tasks...')
    for (const task of tasks) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()

      if (error) {
        console.error('❌ Error inserting task:', task.title, error)
      } else {
        console.log('✅ Task created:', data.title)
      }
    }

    console.log('🎉 Data seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seed function
seedData()
