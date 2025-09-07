import { Project, Task, User, ActivityItem, Dashboard, Filter } from './types';
import { 
  mockProjects, 
  mockTasks, 
  mockUsers, 
  mockActivity, 
  mockDashboard 
} from './data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Projects API
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    await delay(500);
    return mockProjects;
  },

  async getById(id: string): Promise<Project | null> {
    await delay(300);
    return mockProjects.find(p => p.id === id) || null;
  },

  async create(projectData: Partial<Project>): Promise<Project> {
    await delay(800);
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      color: projectData.color || '#3B82F6',
      status: 'active',
      priority: projectData.priority || 'medium',
      progress: 0,
      startDate: projectData.startDate || new Date(),
      endDate: projectData.endDate || new Date(),
      owner: projectData.owner || mockUsers[0],
      team: projectData.team || [mockUsers[0]],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      template: projectData.template,
    };
    mockProjects.push(newProject);
    return newProject;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    await delay(500);
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProjects[index] = { 
      ...mockProjects[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return mockProjects[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(400);
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProjects.splice(index, 1);
    return true;
  },
};

// Tasks API
export const tasksApi = {
  async getAll(filter?: Filter): Promise<Task[]> {
    await delay(400);
    let tasks = [...mockTasks];

    if (filter) {
      if (filter.assignee?.length) {
        tasks = tasks.filter(t => 
          filter.assignee?.includes(t.assignee?.id || '')
        );
      }
      if (filter.status?.length) {
        tasks = tasks.filter(t => filter.status?.includes(t.status));
      }
      if (filter.priority?.length) {
        tasks = tasks.filter(t => filter.priority?.includes(t.priority));
      }
      if (filter.project?.length) {
        tasks = tasks.filter(t => filter.project?.includes(t.projectId));
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        tasks = tasks.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
      if (filter.tags?.length) {
        tasks = tasks.filter(t => 
          filter.tags?.some(tag => t.tags.includes(tag))
        );
      }
    }

    return tasks;
  },

  async getById(id: string): Promise<Task | null> {
    await delay(300);
    return mockTasks.find(t => t.id === id) || null;
  },

  async getByProject(projectId: string): Promise<Task[]> {
    await delay(300);
    return mockTasks.filter(t => t.projectId === projectId);
  },

  async create(taskData: Partial<Task>): Promise<Task> {
    await delay(600);
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee,
      reporter: taskData.reporter || mockUsers[0],
      projectId: taskData.projectId || '',
      subtasks: [],
      comments: [],
      attachments: [],
      tags: taskData.tags || [],
      dueDate: taskData.dueDate,
      estimatedHours: taskData.estimatedHours,
      actualHours: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      dependencies: [],
      customFields: {},
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    await delay(400);
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    mockTasks[index] = { 
      ...mockTasks[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return mockTasks[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(400);
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    mockTasks.splice(index, 1);
    return true;
  },
};

// Users API
export const usersApi = {
  async getAll(): Promise<User[]> {
    await delay(300);
    return mockUsers;
  },

  async getById(id: string): Promise<User | null> {
    await delay(200);
    return mockUsers.find(u => u.id === id) || null;
  },

  async getCurrentUser(): Promise<User> {
    await delay(200);
    return mockUsers[0]; // Return first user as current user
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User | null> {
    await delay(400);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  },
};

// Activity API
export const activityApi = {
  async getRecent(limit: number = 10): Promise<ActivityItem[]> {
    await delay(300);
    return mockActivity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  },

  async getByProject(projectId: string, limit: number = 20): Promise<ActivityItem[]> {
    await delay(300);
    return mockActivity
      .filter(a => a.projectId === projectId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  },
};

// Dashboard API
export const dashboardApi = {
  async getData(): Promise<Dashboard> {
    await delay(600);
    return {
      ...mockDashboard,
      // Recalculate dynamic data
      completedTasks: mockTasks.filter(t => t.status === 'done').length,
      pendingTasks: mockTasks.filter(t => t.status !== 'done').length,
      activeProjects: mockProjects.filter(p => p.status === 'active').length,
    };
  },

  async getProjectStats() {
    await delay(400);
    return {
      byStatus: mockProjects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      byPriority: mockProjects.reduce((acc, project) => {
        acc[project.priority] = (acc[project.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },

  async getTaskStats() {
    await delay(400);
    return {
      byStatus: mockTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      
      byPriority: mockTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};

// Search API
export const searchApi = {
  async globalSearch(query: string): Promise<{
    projects: Project[];
    tasks: Task[];
    users: User[];
  }> {
    await delay(500);
    const searchLower = query.toLowerCase();

    return {
      projects: mockProjects.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      ),
      tasks: mockTasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      ),
      users: mockUsers.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      ),
    };
  },
};

// Utility functions
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  } else {
    return formatDate(date);
  }
};