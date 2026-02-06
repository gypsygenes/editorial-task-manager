import { useState, useCallback, useMemo } from 'react'
import { Task, TaskStatus } from '../types'
import { initialTasks } from '../data/mockData'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setTasks(prev => [newTask, ...prev])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }, [])

  const getTasksByStatus = useCallback(
    (status: TaskStatus, projectId?: string, searchQuery?: string) => {
      return tasks.filter(task => {
        if (task.status !== status) return false
        if (projectId && task.projectId !== projectId) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return (
            task.title.toLowerCase().includes(q) ||
            task.description.toLowerCase().includes(q) ||
            task.assignee.toLowerCase().includes(q) ||
            task.tags.some(tag => tag.toLowerCase().includes(q))
          )
        }
        return true
      })
    },
    [tasks]
  )

  const taskCounts = useMemo(() => {
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    }
  }, [tasks])

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    taskCounts,
  }
}
