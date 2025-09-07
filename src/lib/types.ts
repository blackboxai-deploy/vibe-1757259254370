export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  isOnline: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'archived' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: Date;
  endDate: Date;
  owner: User;
  team: User[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
  template?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  reporter: User;
  projectId: string;
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
  tags: string[];
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
  dependencies: string[];
  customFields: Record<string, any>;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  mentions: User[];
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added' | 'project_created' | 'user_joined';
  title: string;
  description: string;
  user: User;
  timestamp: Date;
  projectId?: string;
  taskId?: string;
}

export interface Dashboard {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  teamMembers: number;
  recentActivity: ActivityItem[];
  upcomingDeadlines: Task[];
  projectProgress: { project: Project; progress: number }[];
}

export interface BoardColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
  limit?: number;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
}

export interface Notification {
  id: string;
  type: 'mention' | 'assignment' | 'deadline' | 'comment' | 'project_update';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  user: User;
}

export interface Filter {
  assignee?: string[];
  status?: string[];
  priority?: string[];
  project?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  search?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: Omit<Task, 'id' | 'projectId' | 'assignee' | 'reporter' | 'createdAt' | 'updatedAt'>[];
  defaultColumns: BoardColumn[];
}