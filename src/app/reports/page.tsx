'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dashboardApi } from '@/lib/api';
import { mockProjects, mockTasks, mockUsers } from '@/lib/data';
import { TASK_PRIORITIES, PROJECT_STATUSES } from '@/lib/constants';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [projectStats, setProjectStats] = useState<any>(null);
  const [taskStats, setTaskStats] = useState<any>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [projectData, taskData] = await Promise.all([
          dashboardApi.getProjectStats(),
          dashboardApi.getTaskStats()
        ]);
        setProjectStats(projectData);
        setTaskStats(taskData);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'done').length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Track progress and analyze team performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects} completed projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Above average performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Tasks delivered on time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {PROJECT_STATUSES.map(status => {
              const count = mockProjects.filter(p => p.status === status.value).length;
              const percentage = Math.round((count / mockProjects.length) * 100);
              
              return (
                <div key={status.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {count} projects ({percentage}%)
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Task Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Breakdown</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TASK_PRIORITIES.map(priority => {
              const count = mockTasks.filter(t => t.priority === priority.value).length;
              const percentage = Math.round((count / mockTasks.length) * 100);
              
              return (
                <div key={priority.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={priority.color}>
                        {priority.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {count} tasks ({percentage}%)
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual team member contributions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUsers.map(user => {
              const userTasks = mockTasks.filter(t => t.assignee?.id === user.id);
              const completedUserTasks = userTasks.filter(t => t.status === 'done');
              const userCompletionRate = userTasks.length > 0 
                ? Math.round((completedUserTasks.length / userTasks.length) * 100)
                : 0;

              return (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {completedUserTasks.length} / {userTasks.length} tasks completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{userCompletionRate}%</div>
                    <div className="text-xs text-muted-foreground">completion rate</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
            <CardDescription>Latest project achievements and completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Project Setup Complete</div>
                  <div className="text-sm text-muted-foreground">
                    Mobile App Development infrastructure is ready
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Design Phase Complete</div>
                  <div className="text-sm text-muted-foreground">
                    Website Redesign wireframes approved
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">5 days ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Brand Guidelines Delivered</div>
                  <div className="text-sm text-muted-foreground">
                    Brand Identity project completed successfully
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">1 week ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}