import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

const readRaw = (key: string): unknown => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return undefined;
  }
};

const emit = (key: string) => {
  listeners.get(key)?.forEach((listener) => listener());
};

// Reads the saved value only on the client (server snapshot is always `defaults`), so
// there is no hydration mismatch and no setState-in-effect. `defaults` and `normalize`
// must be stable references (module-level constants).
export function useLocalStorageState<T>(
  key: string,
  defaults: T,
  normalize: (saved: unknown, defaults: T) => T,
): [T, (update: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (listener: Listener) => {
      const set = listeners.get(key) ?? new Set<Listener>();
      listeners.set(key, set);
      set.add(listener);

      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === key) {
          cache.delete(key);
          listener();
        }
      };
      window.addEventListener("storage", onStorage);

      return () => {
        set.delete(listener);
        window.removeEventListener("storage", onStorage);
        if (set.size === 0) {
          listeners.delete(key);
          cache.delete(key);
        }
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    if (!cache.has(key)) {
      cache.set(key, normalize(readRaw(key), defaults));
    }
    return cache.get(key) as T;
  }, [key, defaults, normalize]);

  const getServerSnapshot = useCallback(() => defaults, [defaults]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const next =
        typeof update === "function"
          ? (update as (prev: T) => T)(prev)
          : update;
      cache.set(key, next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode, quota); keep the in-memory value
      }
      emit(key);
    },
    [key, getSnapshot],
  );

  return [value, setValue];
}
