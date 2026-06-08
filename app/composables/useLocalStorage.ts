import type { Ref } from 'vue'

type UseLocalStorageReturn<T> = {
  value: Ref<T>
  isReady: Ref<boolean>
  setValue: (newValue: T) => void
  reset: () => void
  remove: () => void
}

const STORAGE_PREFIX = 'hinatafes-2026:'

const cloneValue = <T>(value: T): T => {
  if (value === null || typeof value !== 'object') {
    return value
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): UseLocalStorageReturn<T> => {
  const storageKey = `${STORAGE_PREFIX}${key}`

  const value = useState<T>(
    `local-storage:${storageKey}`,
    () => cloneValue(defaultValue),
  )

  const isReady = ref(false)
  const skipNextWrite = ref(false)

  const readValue = (): T => {
    if (!import.meta.client) {
      return cloneValue(defaultValue)
    }

    try {
      const storedValue = localStorage.getItem(storageKey)

      if (storedValue === null) {
        return cloneValue(defaultValue)
      }

      return JSON.parse(storedValue) as T
    } catch (error) {
      console.warn(`[useLocalStorage] 読み込みに失敗しました: ${storageKey}`, error)

      localStorage.removeItem(storageKey)

      return cloneValue(defaultValue)
    }
  }

  const writeValue = (newValue: T) => {
    if (!import.meta.client) {
      return
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(newValue))
    } catch (error) {
      console.warn(`[useLocalStorage] 保存に失敗しました: ${storageKey}`, error)
    }
  }

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  const reset = () => {
    value.value = cloneValue(defaultValue)
    writeValue(value.value)
  }

  const remove = () => {
    skipNextWrite.value = true
    value.value = cloneValue(defaultValue)

    if (import.meta.client) {
      localStorage.removeItem(storageKey)
    }
  }

  onMounted(() => {
    value.value = readValue()
    isReady.value = true
  })

  watch(
    value,
    (newValue) => {
      if (!import.meta.client || !isReady.value) {
        return
      }

      if (skipNextWrite.value) {
        skipNextWrite.value = false
        return
      }

      writeValue(newValue)
    },
    {
      deep: true,
    },
  )

  return {
    value,
    isReady,
    setValue,
    reset,
    remove,
  }
}