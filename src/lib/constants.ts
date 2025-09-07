import { BoardColumn } from './types';

export const TASK_STATUSES = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'review', label: 'In Review', color: 'bg-yellow-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-400' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
] as const;

export const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-500' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-500' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-500' },
] as const;

export const USER_ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'member', label: 'Member', description: 'Can create and manage projects' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
] as const;

export const PROJECT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#6B7280', // gray
] as const;

export const DEFAULT_BOARD_COLUMNS: BoardColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    tasks: [],
    color: '#6B7280',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    tasks: [],
    color: '#3B82F6',
    limit: 5,
  },
  {
    id: 'review',
    title: 'In Review',
    status: 'review',
    tasks: [],
    color: '#F59E0B',
    limit: 3,
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    tasks: [],
    color: '#10B981',
  },
];

export const ACTIVITY_TYPES = {
  task_created: { label: 'Task Created', color: 'bg-blue-100 text-blue-800' },
  task_updated: { label: 'Task Updated', color: 'bg-yellow-100 text-yellow-800' },
  task_completed: { label: 'Task Completed', color: 'bg-green-100 text-green-800' },
  comment_added: { label: 'Comment Added', color: 'bg-purple-100 text-purple-800' },
  project_created: { label: 'Project Created', color: 'bg-indigo-100 text-indigo-800' },
  user_joined: { label: 'User Joined', color: 'bg-gray-100 text-gray-800' },
} as const;

export const PROJECT_TEMPLATES = [
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Launch a comprehensive marketing campaign',
    category: 'Marketing',
  },
  {
    id: 'development',
    name: 'Software Development',
    description: 'Build and deploy a software application',
    category: 'Development',
  },
  {
    id: 'design',
    name: 'Design Project',
    description: 'Create design assets and brand materials',
    category: 'Design',
  },
  {
    id: 'event',
    name: 'Event Planning',
    description: 'Organize and execute an event',
    category: 'Events',
  },
] as const;

export const TIME_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
] as const;

export const CHART_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
] as const;

export const APP_CONFIG = {
  name: 'ProjectHub',
  description: 'Modern project management platform',
  version: '1.0.0',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: [
    'image/*',
    'application/pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.csv',
  ],
} as const;