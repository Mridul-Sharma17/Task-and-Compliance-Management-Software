import { Task } from './types';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Annual General Meeting (AGM) Prep',
    client: 'Stark Industries Ltd',
    dueDate: '2024-05-15',
    status: 'In Progress',
    priority: 'High',
    description: 'Draft notice, agenda, and director\'s report for the upcoming AGM. Coordinate with the finance team for audited financials.',
    assignee: 'Sarah J.',
    progress: 45,
    tags: ['AGM', 'Drafting']
  },
  {
    id: '2',
    title: 'Form MGT-7 Filing',
    client: 'Wayne Enterprises',
    dueDate: '2024-05-20',
    status: 'Pending',
    priority: 'Medium',
    description: 'Prepare and file the Annual Return (MGT-7) for the financial year ending 31st March. Verify list of shareholders.',
    assignee: 'Mike R.',
    progress: 0,
    tags: ['Compliance', 'ROC']
  },
  {
    id: '3',
    title: 'Board Resolution: Additional Director',
    client: 'Cyberdyne Systems',
    dueDate: '2024-05-12',
    status: 'Review',
    priority: 'High',
    description: 'Draft circular resolution for appointment of Additional Director. Prepare Form DIR-12 for filing.',
    assignee: 'Sarah J.',
    progress: 90,
    tags: ['Board Meeting', 'Drafting']
  },
  {
    id: '4',
    title: 'Update Statutory Registers',
    client: 'Umbrella Corp',
    dueDate: '2024-06-01',
    status: 'Completed',
    priority: 'Low',
    description: 'Update Register of Members and Register of Directors following recent share transfer.',
    assignee: 'John D.',
    progress: 100,
    tags: ['Registers', 'Routine']
  },
  {
    id: '5',
    title: 'Due Diligence Report',
    client: 'Acme Corp',
    dueDate: '2024-05-25',
    status: 'In Progress',
    priority: 'High',
    description: 'Conduct secretarial audit and prepare Due Diligence Report for potential investors.',
    assignee: 'Sarah J.',
    progress: 30,
    tags: ['Audit', 'Due Diligence']
  },
];

export const STATUS_COLORS: Record<string, string> = {
  'Pending': 'text-slate-500 bg-slate-100/50',
  'In Progress': 'text-blue-600 bg-blue-100/50',
  'Review': 'text-amber-600 bg-amber-100/50',
  'Completed': 'text-emerald-600 bg-emerald-100/50',
};