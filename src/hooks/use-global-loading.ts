"use client"

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LoadingState {
  // Global loading states
  isPageLoading: boolean
  isNavigationLoading: boolean
  loadingComponents: Record<string, boolean>
  
  // Actions
  setPageLoading: (loading: boolean) => void
  setNavigationLoading: (loading: boolean) => void
  setComponentLoading: (componentId: string, loading: boolean) => void
  resetAllLoading: () => void
}

export const useGlobalLoading = create<LoadingState>()(
  devtools(
    (set, _get) => ({
      // Initial state
      isPageLoading: false,
      isNavigationLoading: false,
      loadingComponents: {},
      
      // Actions
      setPageLoading: (loading) => 
        set(() => ({ isPageLoading: loading }), false, 'setPageLoading'),
        
      setNavigationLoading: (loading) => 
        set(() => ({ isNavigationLoading: loading }), false, 'setNavigationLoading'),
        
      setComponentLoading: (componentId, loading) => 
        set((state) => ({
          loadingComponents: {
            ...state.loadingComponents,
            [componentId]: loading
          }
        }), false, 'setComponentLoading'),
        
      resetAllLoading: () => 
        set(() => ({
          isPageLoading: false,
          isNavigationLoading: false,
          loadingComponents: {}
        }), false, 'resetAllLoading'),
    }),
    { name: 'global-loading-store' }
  )
)

// Helper hooks for specific loading states
export const usePageLoading = () => {
  const isPageLoading = useGlobalLoading((state) => state.isPageLoading)
  const setPageLoading = useGlobalLoading((state) => state.setPageLoading)
  return { isPageLoading, setPageLoading }
}

export const useNavigationLoading = () => {
  const isNavigationLoading = useGlobalLoading((state) => state.isNavigationLoading)
  const setNavigationLoading = useGlobalLoading((state) => state.setNavigationLoading)
  return { isNavigationLoading, setNavigationLoading }
}

export const useComponentLoading = (componentId: string) => {
  const loading = useGlobalLoading((state) => state.loadingComponents[componentId] || false)
  const setLoading = useGlobalLoading((state) => state.setComponentLoading)
  
  return {
    loading,
    setLoading: (isLoading: boolean) => setLoading(componentId, isLoading)
  }
}