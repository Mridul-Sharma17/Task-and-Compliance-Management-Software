# GlassDesk CS - Task & Compliance Management System

<div align="center">

![GlassDesk CS](https://img.shields.io/badge/GlassDesk-CS-14b8a6?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**A modern, real-time task and compliance management system built for professional services firms**

[Features](#features) • [Installation](#installation) • [Configuration](#configuration) • [Usage](#usage)

</div>

---

## 📋 Overview

GlassDesk CS is a comprehensive task and compliance management platform designed specifically for corporate services, legal firms, and professional service providers. It provides a beautiful, glassmorphic UI with real-time collaboration capabilities, role-based access control, and powerful task management features.

## ✨ Features

### 🚀 Core Features

- **Real-time Task Management**
  - Create, update, and track tasks in real-time
  - Automatic UI updates using Supabase realtime subscriptions
  - Task status workflow (Pending → In Progress → Review → Completed)
  - Priority levels (Low, Medium, High)
  - Due date tracking and overdue alerts

- **Real-time Notifications**
  - Live notification bell with unread count
  - Role-based notification filtering
  - Notification types: Task Created, Updated, Completed, Assigned
  - Relative timestamps (Just now, 5m ago, 2h ago)
  - Mark as read/unread functionality
  - Bulk actions (Mark all as read, Clear all)

- **Document Management**
  - Upload documents to tasks (PDF, DOC, DOCX, XLS, XLSX)
  - File size validation (10MB limit)
  - View, download, and delete attachments
  - Secure cloud storage via Supabase Storage

- **Company Management**
  - Create and manage company profiles
  - Track registration numbers and contact details
  - Company-specific task filtering
  - Admin-only company creation

### 👥 Role-Based Access Control

**Four User Roles:**

1. **Admin**
   - Full system access
   - Manage users, companies, and all tasks
   - See all notifications system-wide
   - Create/delete companies

2. **Partner**
   - Manage assigned tasks and team tasks
   - View partner-level analytics
   - See notifications for managed tasks

3. **Manager**
   - Manage team tasks
   - Assign tasks to staff
   - View team analytics

4. **Staff**
   - View and complete assigned tasks
   - See only personal task notifications
   - Upload documents to assigned tasks

### 📊 Analytics & Dashboards

**Admin Dashboard:**
- Total tasks completed (with completion rate)
- Pending actions count
- Overdue tasks tracker
- Weekly throughput chart
- Staff workload distribution
- Completion status pie chart
- Recent tasks list (sorted by creation date)

**Staff/Partner Dashboard:**
- Personal task completion stats
- My pending tasks
- My overdue tasks
- Personal weekly progress chart
- Upcoming deadlines
- Personal completion rate

### 🎨 UI/UX Features

- **Glassmorphic Design** - Modern frosted glass aesthetic
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Coming soon
- **Smooth Animations** - Polished transitions and interactions
- **Search Functionality** - Real-time task and company search
- **Visual Charts** - Recharts integration for data visualization

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe development
- **Vite 6.2** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon set
- **Recharts** - Composable charting library

### Backend & Services
- **Supabase** - Complete backend solution
  - PostgreSQL Database
  - Real-time subscriptions
  - Authentication & Authorization
  - Row Level Security (RLS)
  - Cloud Storage
  - Edge Functions

### Authentication
- Email/Password authentication
- Secure session management
- Role-based permissions
- Protected routes

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (free tier available)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-and-Compliance-Management-Software
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

## ⚙️ Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Database Tables**

   Required tables:
   - `profiles` - User profiles with roles
   - `tasks` - Task management
   - `companies` - Company information
   - `task_documents` - Document attachments
   - `task_comments` - Task comments

3. **Enable Realtime**
   - Go to Database → Replication
   - Add `tasks` table to `supabase_realtime` publication
   - Enable "Realtime" toggle for the tasks table

4. **Storage Bucket**
   - Create a bucket named `task-documents`
   - Set appropriate access policies

5. **Row Level Security (RLS)**

   Ensure RLS policies are configured for:
   - User-based task access
   - Role-based permissions
   - Document access control

## 🚀 Usage

### Default Admin Account

```
Email: test@glassdesk.com
Password: [Set during initial setup]
Role: Admin
```

### Creating Users

1. Navigate to **Users** tab (Admin only)
2. Click **Add User**
3. Fill in user details
4. Assign appropriate role
5. User receives email invitation

### Creating Tasks

1. Click **Create Task** button
2. Fill in task details:
   - Title (required)
   - Description
   - Company (required)
   - Assignee (required)
   - Due Date (required)
   - Priority
   - Tags
3. Click **Create Task**
4. Task appears in real-time for all users

### Managing Documents

1. Open any task
2. Scroll to **Documents** section
3. Click upload area or drag-and-drop files
4. Documents upload instantly
5. View, download, or delete as needed

### Viewing Notifications

1. Click bell icon in header
2. See all recent task updates
3. Click notification to mark as read
4. Use "Mark all as read" or "Clear all" actions

## 📁 Project Structure

```
Task-and-Compliance-Management-Software/
├── components/           # React components
│   ├── AdminDashboard.tsx
│   ├── PartnerDashboard.tsx
│   ├── TaskList.tsx
│   ├── TaskModal.tsx
│   ├── CompanyList.tsx
│   ├── UserList.tsx
│   ├── NotificationBell.tsx
│   ├── DocumentUpload.tsx
│   ├── DocumentList.tsx
│   └── ...
├── src/
│   ├── components/       # Auth components
│   │   └── Login.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useRealtimeTasks.ts
│   │   ├── useRealtimeNotifications.ts
│   │   └── useDebounce.ts
│   ├── services/        # API service layers
│   │   ├── taskService.ts
│   │   └── documentService.ts
│   └── lib/            # Utility libraries
│       └── supabase.ts
├── public/             # Static assets
├── .env.local         # Environment variables
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── vite.config.ts     # Vite config
└── README.md          # This file
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Role-based permissions** - Four-tier authorization
- **Secure authentication** - Supabase Auth
- **Protected routes** - Frontend route guards
- **File validation** - Type and size checks
- **SQL injection prevention** - Parameterized queries
- **XSS protection** - React automatic escaping

## 🐛 Known Issues

- Dark mode not yet implemented
- Mobile view needs optimization for charts
- File upload progress indicator missing

## 🗺️ Roadmap

- [ ] Dark mode support
- [ ] Email notifications
- [ ] Calendar view for tasks
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Advanced reporting
- [ ] Export to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Integration with external calendars
- [ ] Automated compliance reminders

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👨‍💻 Author

**Papa's Work Team**

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Backend by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI inspired by glassmorphism design trends

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Supabase**

[Report Bug](../../issues) • [Request Feature](../../issues)

</div>
