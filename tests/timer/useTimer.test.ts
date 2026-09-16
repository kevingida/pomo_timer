import { renderHook, act } from '@testing-library/react'
import useTimer from '@/features/timer/hooks/useTimer'

describe('useTimer', () => {
  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      expect(result.current.status).toBe('idle')
      expect(result.current.remaining).toBe(1500) // 25 * 60
      expect(result.current.isComplete).toBe(false)
    })

    it('should calculate remaining time correctly for different durations', () => {
      const { result: result5 } = renderHook(() => useTimer({ duration: 5 }))
      const { result: result10 } = renderHook(() => useTimer({ duration: 10 }))

      expect(result5.current.remaining).toBe(300)
      expect(result10.current.remaining).toBe(600)
    })
  })

  describe('timer controls', () => {
    it('should start the timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      act(() => {
        result.current.start()
      })

      expect(result.current.status).toBe('running')
    })

    it('should pause the timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      act(() => {
        result.current.start()
      })

      expect(result.current.status).toBe('running')

      act(() => {
        result.current.pause()
      })

      expect(result.current.status).toBe('paused')
    })

    it('should reset the timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      act(() => {
        result.current.start()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.status).toBe('idle')
      expect(result.current.remaining).toBe(1500)
    })
  })

  describe('elapsed time tracking', () => {
    it('should increment elapsed time when running', async () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      act(() => {
        result.current.start()
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.remaining).toBe(1499)

      act(() => {
        jest.advanceTimersByTime(5000)
      })

      expect(result.current.remaining).toBe(1494)

      jest.useRealTimers()
    })

    it('should not increment elapsed time when paused', async () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useTimer({ duration: 25 }))

      act(() => {
        result.current.start()
      })

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      const elapsedAtPause = result.current.remaining

      act(() => {
        result.current.pause()
      })

      act(() => {
        jest.advanceTimersByTime(5000)
      })

      expect(result.current.remaining).toBe(elapsedAtPause)

      jest.useRealTimers()
    })
  })

  describe('completion detection', () => {
    it('should mark as complete when remaining time reaches 0', async () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useTimer({ duration: 1 }))

      act(() => {
        result.current.start()
      })

      act(() => {
        jest.advanceTimersByTime(60000)
      })

      expect(result.current.isComplete).toBe(true)
      expect(result.current.remaining).toBe(0)
      expect(result.current.status).toBe('idle')

      jest.useRealTimers()
    })

    it('should not go below 0 when timer completes', async () => {
      jest.useFakeTimers()
      const { result } = renderHook(() => useTimer({ duration: 1 }))

      act(() => {
        result.current.start()
      })

      act(() => {
        jest.advanceTimersByTime(120000)
      })

      expect(result.current.remaining).toBe(0)

      jest.useRealTimers()
    })
  })

  describe('duration changes', () => {
    it('should reset timer when duration changes', () => {
      const { result, rerender } = renderHook(
        ({ duration }) => useTimer({ duration }),
        { initialProps: { duration: 25 } }
      )

      act(() => {
        result.current.start()
      })

      expect(result.current.status).toBe('running')

      rerender({ duration: 5 })

      expect(result.current.remaining).toBe(300)
      expect(result.current.status).toBe('idle')
    })
  })
})
