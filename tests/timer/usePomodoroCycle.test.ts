import { renderHook, act } from '@testing-library/react'
import usePomodoroCycle from '@/features/timer/hooks/usePomodoroCycle'

describe('usePomodoroCycle', () => {
  describe('initialization', () => {
    it('should initialize with focus mode', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      expect(result.current.mode).toBe('focus')
      expect(result.current.completedFocus).toBe(0)
    })
  })

  describe('mode transitions', () => {
    it('should transition from focus to short break', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.nextMode()
      })

      expect(result.current.mode).toBe('shortBreak')
      expect(result.current.completedFocus).toBe(1)
    })

    it('should transition from short break to focus', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.nextMode() // focus -> shortBreak
      })

      act(() => {
        result.current.nextMode() // shortBreak -> focus
      })

      expect(result.current.mode).toBe('focus')
      expect(result.current.completedFocus).toBe(1)
    })

    it('should transition from focus to long break after interval', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.nextMode() // focus -> shortBreak
        })
        act(() => {
          result.current.nextMode() // shortBreak -> focus
        })
      }

      // After 3 complete cycles, we're at focus with completedFocus=3
      // Next call should increment to 4 and trigger long break
      act(() => {
        result.current.nextMode()
      })

      expect(result.current.mode).toBe('longBreak')
      expect(result.current.completedFocus).toBe(4)
    })

    it('should handle long break interval of 2', () => {
      const { result } = renderHook(() => usePomodoroCycle(2))

      act(() => {
        result.current.nextMode() // focus -> shortBreak, completedFocus = 1
      })
      act(() => {
        result.current.nextMode() // shortBreak -> focus
      })
      act(() => {
        result.current.nextMode() // focus -> longBreak (1 % 2 !== 0 but 2 % 2 === 0), completedFocus = 2
      })

      expect(result.current.mode).toBe('longBreak')
      expect(result.current.completedFocus).toBe(2)
    })

    it('should handle long break interval of 3', () => {
      const { result } = renderHook(() => usePomodoroCycle(3))

      for (let i = 0; i < 2; i++) {
        act(() => {
          result.current.nextMode() // focus -> shortBreak
        })
        act(() => {
          result.current.nextMode() // shortBreak -> focus
        })
      }

      act(() => {
        result.current.nextMode() // focus -> longBreak, completedFocus = 3
      })

      expect(result.current.mode).toBe('longBreak')
      expect(result.current.completedFocus).toBe(3)
    })
  })

  describe('reset cycle', () => {
    it('should reset to focus mode with 0 completed focus', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.nextMode()
      })

      expect(result.current.completedFocus).toBe(1)

      act(() => {
        result.current.resetCycle()
      })

      expect(result.current.mode).toBe('focus')
      expect(result.current.completedFocus).toBe(0)
    })

    it('should reset after multiple cycles', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      for (let i = 0; i < 8; i++) {
        act(() => {
          result.current.nextMode()
        })
      }

      act(() => {
        result.current.resetCycle()
      })

      expect(result.current.mode).toBe('focus')
      expect(result.current.completedFocus).toBe(0)
    })
  })

  describe('change mode', () => {
    it('should change to any mode directly', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.changeMode('longBreak')
      })

      expect(result.current.mode).toBe('longBreak')

      act(() => {
        result.current.changeMode('focus')
      })

      expect(result.current.mode).toBe('focus')

      act(() => {
        result.current.changeMode('shortBreak')
      })

      expect(result.current.mode).toBe('shortBreak')
    })

    it('should not affect completedFocus when changing mode', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.nextMode()
      })

      const completedBefore = result.current.completedFocus

      act(() => {
        result.current.changeMode('focus')
      })

      expect(result.current.completedFocus).toBe(completedBefore)
    })
  })

  describe('edge cases', () => {
    it('should handle long break interval of 1', () => {
      const { result } = renderHook(() => usePomodoroCycle(1))

      act(() => {
        result.current.nextMode() // focus -> longBreak, completedFocus = 1
      })

      expect(result.current.mode).toBe('longBreak')
      expect(result.current.completedFocus).toBe(1)
    })

    it('should maintain state across multiple operations', () => {
      const { result } = renderHook(() => usePomodoroCycle(4))

      act(() => {
        result.current.nextMode() // shortBreak
      })

      expect(result.current.completedFocus).toBe(1)

      act(() => {
        result.current.nextMode() // focus
      })

      expect(result.current.completedFocus).toBe(1)

      act(() => {
        result.current.changeMode('longBreak')
      })

      expect(result.current.completedFocus).toBe(1)
    })
  })
})
