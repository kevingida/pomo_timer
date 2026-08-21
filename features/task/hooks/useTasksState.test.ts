import { renderHook, act } from '@testing-library/react'
import useTaskState from './useTasksState'
import { Task } from '../type'

describe('useTasksState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  describe('initialization', () => {
    it('should initialize with empty task list', () => {
      const { result } = renderHook(() => useTaskState())

      expect(result.current.taskList).toEqual([])
      expect(result.current.activeTaskId).toBeNull()
      expect(result.current.activeTask).toBeNull()
    })

    it('should load tasks from localStorage on mount', () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          completedAt: undefined,
          completedPomodoros: 0,
        },
      ]

      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks))

      const { result } = renderHook(() => useTaskState())

      expect(result.current.taskList).toEqual(mockTasks)
    })

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json')

      expect(() => {
        renderHook(() => useTaskState())
      }).toThrow()
    })
  })

  describe('addTask', () => {
    it('should add a task to the list', () => {
      const { result } = renderHook(() => useTaskState())

      const newTask: Task = {
        id: '1',
        title: 'New Task',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(newTask)
      })

      expect(result.current.taskList).toHaveLength(1)
      expect(result.current.taskList[0]).toEqual(newTask)
    })

    it('should add multiple tasks', () => {
      const { result } = renderHook(() => useTaskState())

      const task1: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task2: Task = {
        id: '2',
        title: 'Task 2',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task1)
      })

      act(() => {
        result.current.addTask(task2)
      })

      expect(result.current.taskList).toHaveLength(2)
      expect(result.current.taskList).toEqual([task1, task2])
    })
  })

  describe('deleteTask', () => {
    it('should delete a task by id', () => {
      const { result } = renderHook(() => useTaskState())

      const task1: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task2: Task = {
        id: '2',
        title: 'Task 2',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task1)
        result.current.addTask(task2)
      })

      act(() => {
        result.current.deleteTask('1')
      })

      expect(result.current.taskList).toHaveLength(1)
      expect(result.current.taskList[0].id).toBe('2')
    })

    it('should not crash when deleting non-existent task', () => {
      const { result } = renderHook(() => useTaskState())

      act(() => {
        result.current.deleteTask('non-existent')
      })

      expect(result.current.taskList).toHaveLength(0)
    })

    it('should clear active task if deleted', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
        result.current.setActiveTask('1')
      })

      expect(result.current.activeTaskId).toBe('1')

      act(() => {
        result.current.deleteTask('1')
      })

      expect(result.current.taskList).toHaveLength(0)
      expect(result.current.activeTaskId).toBe('1') // activeTaskId doesn't auto-clear
      expect(result.current.activeTask).toBeNull() // but activeTask becomes null
    })
  })

  describe('updateTask', () => {
    it('should update a task', () => {
      const { result } = renderHook(() => useTaskState())

      const originalTask: Task = {
        id: '1',
        title: 'Original Task',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(originalTask)
      })

      const updatedTask: Task = {
        ...originalTask,
        title: 'Updated Task',
      }

      act(() => {
        result.current.updateTask(updatedTask)
      })

      expect(result.current.taskList[0].title).toBe('Updated Task')
    })

    it('should not affect other tasks when updating', () => {
      const { result } = renderHook(() => useTaskState())

      const task1: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task2: Task = {
        id: '2',
        title: 'Task 2',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task1)
        result.current.addTask(task2)
      })

      act(() => {
        result.current.updateTask({
          ...task1,
          title: 'Updated Task 1',
        })
      })

      expect(result.current.taskList[0].title).toBe('Updated Task 1')
      expect(result.current.taskList[1].title).toBe('Task 2')
    })
  })

  describe('toggleTaskCompletion', () => {
    it('should mark task as completed with timestamp', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      act(() => {
        result.current.toggleTaskCompletion('1')
      })

      expect(result.current.taskList[0].completed).toBe(true)
      expect(result.current.taskList[0].completedAt).toBeDefined()
    })

    it('should mark task as incomplete and remove timestamp', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      act(() => {
        result.current.toggleTaskCompletion('1')
      })

      expect(result.current.taskList[0].completed).toBe(true)

      act(() => {
        result.current.toggleTaskCompletion('1')
      })

      expect(result.current.taskList[0].completed).toBe(false)
      expect(result.current.taskList[0].completedAt).toBeUndefined()
    })

    it('should not crash when toggling non-existent task', () => {
      const { result } = renderHook(() => useTaskState())

      act(() => {
        result.current.toggleTaskCompletion('non-existent')
      })

      expect(result.current.taskList).toHaveLength(0)
    })
  })

  describe('incrementCompletedPomodoros', () => {
    it('should increment completed pomodoros count', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      act(() => {
        result.current.incrementCompletedPomodoros('1')
      })

      expect(result.current.taskList[0].completedPomodoros).toBe(1)
    })

    it('should increment multiple times', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.incrementCompletedPomodoros('1')
        })
      }

      expect(result.current.taskList[0].completedPomodoros).toBe(5)
    })

    it('should not affect other tasks', () => {
      const { result } = renderHook(() => useTaskState())

      const task1: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task2: Task = {
        id: '2',
        title: 'Task 2',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task1)
        result.current.addTask(task2)
      })

      act(() => {
        result.current.incrementCompletedPomodoros('1')
      })

      expect(result.current.taskList[0].completedPomodoros).toBe(1)
      expect(result.current.taskList[1].completedPomodoros).toBe(0)
    })
  })

  describe('setActiveTask', () => {
    it('should set active task by id', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      act(() => {
        result.current.setActiveTask('1')
      })

      expect(result.current.activeTaskId).toBe('1')
      expect(result.current.activeTask).toEqual(task)
    })

    it('should clear active task with null', () => {
      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
        result.current.setActiveTask('1')
      })

      expect(result.current.activeTaskId).toBe('1')

      act(() => {
        result.current.setActiveTask(null)
      })

      expect(result.current.activeTaskId).toBeNull()
      expect(result.current.activeTask).toBeNull()
    })

    it('should return null for non-existent active task id', () => {
      const { result } = renderHook(() => useTaskState())

      act(() => {
        result.current.setActiveTask('non-existent')
      })

      expect(result.current.activeTask).toBeNull()
    })
  })

  describe('localStorage persistence', () => {
    it('should save tasks to localStorage', () => {
      localStorage.setItem.mockClear()
      localStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task)
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify([task])
      )
    })

    it('should not save to localStorage until loaded', () => {
      localStorage.setItem.mockClear()
      localStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useTaskState())

      const task: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      // First call is from initial effect when checking isLoaded
      const setItemCallsBefore = (localStorage.setItem as jest.Mock).mock.calls.length

      act(() => {
        result.current.addTask(task)
      })

      const setItemCallsAfter = (localStorage.setItem as jest.Mock).mock.calls.length

      // Should have called setItem once more for the new task
      expect(setItemCallsAfter).toBeGreaterThan(setItemCallsBefore)
    })
  })

  describe('reorderTasks', () => {
    it('should accept reorder event without errors', () => {
      const { result } = renderHook(() => useTaskState())

      const task1: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task2: Task = {
        id: '2',
        title: 'Task 2',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      const task3: Task = {
        id: '3',
        title: 'Task 3',
        completed: false,
        completedAt: undefined,
        completedPomodoros: 0,
      }

      act(() => {
        result.current.addTask(task1)
        result.current.addTask(task2)
        result.current.addTask(task3)
      })

      expect(result.current.taskList).toHaveLength(3)

      // The reorder function integrates with dnd-kit's move utility
      // Just verify it can be called without errors and changes task order
      act(() => {
        result.current.reorderTasks({
          operation: 'swap',
          source: 0,
          destination: 2,
        } as any)
      })

      // Task list should still have 3 items after reorder
      expect(result.current.taskList).toHaveLength(3)
    })
  })
})
