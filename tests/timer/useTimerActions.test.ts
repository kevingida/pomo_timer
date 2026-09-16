import { renderHook, act } from '@testing-library/react'
import useTimerActions from '@/features/timer/hooks/useTimerActions'
import { Mode } from '@/features/timer/type'

describe('useTimerActions', () => {
  let mockChangeMode: jest.Mock
  let mockStart: jest.Mock
  let mockPause: jest.Mock
  let mockReset: jest.Mock
  let mockOpenDialog: jest.Mock

  beforeEach(() => {
    mockChangeMode = jest.fn()
    mockStart = jest.fn()
    mockPause = jest.fn()
    mockReset = jest.fn()
    mockOpenDialog = jest.fn()
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      expect(result.current.showReset).toBe(false)
    })
  })

  describe('handleReset', () => {
    it('should reset timer when idle without dialog', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleReset()
      })

      expect(mockReset).toHaveBeenCalled()
      expect(mockOpenDialog).not.toHaveBeenCalled()
    })

    it('should open dialog when timer is running', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleReset()
      })

      expect(mockOpenDialog).toHaveBeenCalled()
      expect(mockReset).not.toHaveBeenCalled()
    })

    it('should open dialog when timer is paused', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'paused',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleReset()
      })

      expect(mockOpenDialog).toHaveBeenCalled()
      expect(mockReset).not.toHaveBeenCalled()
    })

    it('should execute reset when dialog is confirmed', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      let confirmCallback: (() => void) | undefined

      mockOpenDialog.mockImplementation(
        (title: string, description: string, confirm: () => void) => {
          confirmCallback = confirm
        }
      )

      act(() => {
        result.current.handleReset()
      })

      expect(confirmCallback).toBeDefined()

      act(() => {
        confirmCallback!()
      })

      expect(mockReset).toHaveBeenCalled()
    })
  })

  describe('handlePlayPause', () => {
    it('should start timer when idle', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handlePlayPause()
      })

      expect(mockStart).toHaveBeenCalled()
      expect(mockOpenDialog).not.toHaveBeenCalled()
      expect(result.current.showReset).toBe(true)
    })

    it('should open dialog to confirm pause when running', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handlePlayPause()
      })

      expect(mockOpenDialog).toHaveBeenCalled()
      expect(mockPause).not.toHaveBeenCalled()
      expect(result.current.showReset).toBe(true)
    })

    it('should execute pause when dialog is confirmed', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      let confirmCallback: (() => void) | undefined

      mockOpenDialog.mockImplementation(
        (title: string, description: string, confirm: () => void) => {
          confirmCallback = confirm
        }
      )

      act(() => {
        result.current.handlePlayPause()
      })

      expect(confirmCallback).toBeDefined()

      act(() => {
        confirmCallback!()
      })

      expect(mockPause).toHaveBeenCalled()
    })

    it('should start timer when paused', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'paused',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handlePlayPause()
      })

      expect(mockStart).toHaveBeenCalled()
    })
  })

  describe('handleModeChange', () => {
    it('should change mode directly when idle', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleModeChange('shortBreak')
      })

      expect(mockChangeMode).toHaveBeenCalledWith('shortBreak')
      expect(mockOpenDialog).not.toHaveBeenCalled()
    })

    it('should change mode directly when idle without resetting', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleModeChange('longBreak')
      })

      expect(mockReset).not.toHaveBeenCalled()
      expect(mockChangeMode).toHaveBeenCalledWith('longBreak')
    })

    it('should open dialog when changing mode while running', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleModeChange('shortBreak')
      })

      expect(mockOpenDialog).toHaveBeenCalled()
      expect(mockChangeMode).not.toHaveBeenCalled()
    })

    it('should execute mode change when dialog is confirmed', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      let confirmCallback: (() => void) | undefined

      mockOpenDialog.mockImplementation(
        (title: string, description: string, confirm: () => void) => {
          confirmCallback = confirm
        }
      )

      act(() => {
        result.current.handleModeChange('focus')
      })

      expect(confirmCallback).toBeDefined()

      act(() => {
        confirmCallback!()
      })

      expect(mockReset).toHaveBeenCalled()
      expect(mockChangeMode).toHaveBeenCalledWith('focus')
    })

    it('should open dialog when changing mode while paused', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'paused',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleModeChange('longBreak')
      })

      expect(mockOpenDialog).toHaveBeenCalled()
      expect(mockChangeMode).not.toHaveBeenCalled()
    })

    it('should handle multiple mode changes sequentially', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      act(() => {
        result.current.handleModeChange('shortBreak')
      })

      expect(mockChangeMode).toHaveBeenCalledWith('shortBreak')

      act(() => {
        result.current.handleModeChange('focus')
      })

      expect(mockChangeMode).toHaveBeenCalledWith('focus')
      expect(mockChangeMode).toHaveBeenCalledTimes(2)
    })
  })

  describe('showReset flag', () => {
    it('should set showReset to true on handlePlayPause', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'idle',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      expect(result.current.showReset).toBe(false)

      act(() => {
        result.current.handlePlayPause()
      })

      expect(result.current.showReset).toBe(true)
    })

    it('should set showReset to false after reset', () => {
      const { result } = renderHook(() =>
        useTimerActions({
          changeMode: mockChangeMode,
          status: 'running',
          start: mockStart,
          pause: mockPause,
          reset: mockReset,
          openDialog: mockOpenDialog,
        })
      )

      let confirmCallback: (() => void) | undefined

      mockOpenDialog.mockImplementation(
        (title: string, description: string, confirm: () => void) => {
          confirmCallback = confirm
        }
      )

      act(() => {
        result.current.handleReset()
      })

      expect(result.current.showReset).toBe(false)

      act(() => {
        confirmCallback!()
      })

      expect(result.current.showReset).toBe(false)
    })
  })
})
