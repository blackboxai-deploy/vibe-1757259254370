'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { projectsApi, tasksApi } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { PROJECT_STATUSES, TASK_STATUSES, TASK_PRIORITIES, DEFAULT_BOARD_COLUMNS } from '@/lib/constants';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          projectsApi.getById(projectId),
          tasksApi.getByProject(projectId)
        ]);
        
        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project not found</h2>
        <p className="text-gray-500 dark:text-gray-400">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUSES.find(s => s.value === project.status);
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const boardColumns = DEFAULT_BOARD_COLUMNS.map(column => ({
    ...column,
    tasks: tasks.filter(task => task.status === column.status)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <Badge variant="outline" className={statusConfig?.color}>
              {statusConfig?.label}
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{project.description}</p>
          
          {/* Project Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Owner: {project.owner.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{project.team.length} team members</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>{completedTasks} of {tasks.length} tasks completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 21v-2a2 2 0 012-2h4a2 2 0 012 2v2M8 21V11a2 2 0 012-2h4a2 2 0 012 2v10M8 21H6a2 2 0 01-2-2v-6a2 2 0 012-2h2m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h4" />
              </svg>
              <span>Due {project.endDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293l-3.414-3.414A1 1 0 004.586 5H2a2 2 0 00-2 2v6a2 2 0 002 2h2m3 4h8a2 2 0 002-2v-4a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293l-3.414-3.414A1 1 0 004.586 9H2a2 2 0 00-2 2v6a2 2 0 002 2h2" />
                </svg>
                Archive Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-500">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {project.team.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{member.role}</div>
                </div>
                {member.isOnline && (
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                )}
              </div>
            ))}
            <Button variant="outline" className="h-auto p-3">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardColumns.map((column) => (
              <Card key={column.id} className="min-h-96">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: column.color }}
                      />
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {column.tasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {column.tasks.map((task) => {
                    const priorityConfig = TASK_PRIORITIES.find(p => p.value === task.priority);
                    return (
                      <Card key={task.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                            <Badge variant="outline" className={`text-xs ${priorityConfig?.color}`}>
                              {priorityConfig?.label}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            {task.assignee && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            {task.dueDate && (
                              <span className="text-xs text-gray-500">
                                {task.dueDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {task.subtasks.length > 0 && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <span>
                                {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-500 hover:text-gray-700 border-2 border-dashed border-gray-200 hover:border-gray-300"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {tasks.map((task) => {
                  const statusConfig = TASK_STATUSES.find(s => s.value === task.status);
                  const priorityConfig = TASK_PRIORITIES.find(p => p.value === task.priority);
                  
                  return (
                    <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-medium truncate">{task.title}</h4>
                            <Badge variant="outline" className={statusConfig?.color}>
                              {statusConfig?.label}
                            </Badge>
                            <Badge variant="outline" className={priorityConfig?.color}>
                              {priorityConfig?.label}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-500 line-clamp-1 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {task.assignee && (
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={task.assignee.avatar} />
                                  <AvatarFallback>
                                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.assignee.name}</span>
                              </div>
                            )}
                            {task.dueDate && (
                              <span>Due: {task.dueDate.toLocaleDateString()}</span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span>
                                Subtasks: {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 21v-2a2 2 0 012-2h4a2 2 0 012 2v2M8 21V11a2 2 0 012-2h4a2 2 0 012 2v10M8 21H6a2 2 0 01-2-2v-6a2 2 0 012-2h2m0 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Timeline View</h3>
                <p className="text-gray-500 dark:text-gray-400">Timeline and Gantt chart view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Files</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Upload and manage project files</p>
                <Button>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}