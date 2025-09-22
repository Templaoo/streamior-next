import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation variant for the skeleton
   */
  variant?: "pulse" | "wave" | "shimmer"
  /**
   * Speed of animation (in seconds)
   */
  speed?: number
  /**
   * Show skeleton for a specific duration (in ms), then render children
   */
  delay?: number
  /**
   * If true, shows skeleton. If false, shows children
   */
  loading?: boolean
  /**
   * Content to show when not loading
   */
  children?: React.ReactNode
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = "pulse", 
    speed = 2, 
    delay,
    loading = true,
    children,
    style,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(loading)
    
    React.useEffect(() => {
      if (delay && loading) {
        const timer = setTimeout(() => setIsLoading(false), delay)
        return () => clearTimeout(timer)
      }
      setIsLoading(loading)
    }, [delay, loading])

    if (!isLoading && children) {
      return <>{children}</>
    }

    const animationClass = {
      pulse: "animate-pulse",
      wave: "animate-skeleton-wave",
      shimmer: "animate-shimmer"
    }[variant]

    const animationStyle = {
      animationDuration: `${speed}s`
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md bg-skeleton",
          animationClass,
          className
        )}
        style={{ ...animationStyle, ...style }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton, type SkeletonProps }