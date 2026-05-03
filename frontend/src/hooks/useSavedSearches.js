import { useState, useCallback } from 'react'

const STORAGE_KEY = 'parkingo_saved_searches'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState(load)

  const addSearch = useCallback((search) => {
    setSavedSearches((prev) => {
      const next = [{ ...search, savedAt: new Date().toISOString() }, ...prev].slice(0, 20)
      save(next)
      return next
    })
  }, [])

  const removeSearch = useCallback((index) => {
    setSavedSearches((prev) => {
      const next = prev.filter((_, i) => i !== index)
      save(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setSavedSearches([])
    save([])
  }, [])

  return { savedSearches, addSearch, removeSearch, clearAll }
}
