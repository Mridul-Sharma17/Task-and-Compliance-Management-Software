export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Completed';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  description: string;
  assignee: string;
  progress: number; // 0 to 100
  tags: string[];
}

export interface UserStats {
  completedTasks: number;
  totalTasks: number;
  upcomingDeadlines: number;
  efficiencyScore: number;
}