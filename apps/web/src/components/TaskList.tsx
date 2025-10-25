'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import type { Task } from '@repo/types';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await apiClient.tasks.list();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setCreating(true);
    try {
      const task = await apiClient.tasks.create({ title: newTaskTitle });
      setTasks([task, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setCreating(false);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const updated = await apiClient.tasks.update(task.id, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.tasks.delete(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        <form onSubmit={createTask} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
            <button
              type="submit"
              disabled={creating || !newTaskTitle.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No tasks yet. Create one to get started!
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span
                  className={`flex-1 ${
                    task.completed
                      ? 'line-through text-gray-500'
                      : ''
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
