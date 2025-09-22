"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useGlobalLoading } from "@/hooks/use-global-loading"
import { CardSkeleton } from "@/components/loading/skeleton-variants"

interface PageWrapperProps {
  children: React.ReactNode
  loading?: boolean
  skeletonCount?: number
}

export function PageWrapper({ 
  children, 
  loading = false, 
  skeletonCount = 3 
}: PageWrapperProps) {
  const pathname = usePathname()
  const { isPageLoading, setPageLoading } = useGlobalLoading()
  
  useEffect(() => {
    // Auto-manage page loading state on route changes
    setPageLoading(true)
    const timer = setTimeout(() => setPageLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname, setPageLoading])
  
  const showLoading = loading || isPageLoading
  
  if (showLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {Array.from({ length: skeletonCount }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}