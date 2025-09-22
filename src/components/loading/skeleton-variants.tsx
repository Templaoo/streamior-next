import { Skeleton } from "@/components/ui/advanced-skeleton"
import { cn } from "@/lib/utils"

interface SkeletonVariantProps {
  className?: string
  loading?: boolean
  children?: React.ReactNode
}

export function TextSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  return (
    <Skeleton
      className={cn("h-4 w-full", className)}
      loading={loading}
    >
      {children}
    </Skeleton>
  )
}

export function TitleSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  return (
    <Skeleton
      className={cn("h-8 w-3/4", className)}
      loading={loading}
    >
      {children}
    </Skeleton>
  )
}

export function AvatarSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  return (
    <Skeleton
      className={cn("h-12 w-12 rounded-full", className)}
      loading={loading}
    >
      {children}
    </Skeleton>
  )
}

export function ImageSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  return (
    <Skeleton
      className={cn("aspect-video w-full rounded-lg", className)}
      loading={loading}
    >
      {children}
    </Skeleton>
  )
}

export function CardSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  if (!loading && children) return <>{children}</>
  
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <ImageSkeleton />
      <div className="space-y-2">
        <TitleSkeleton />
        <TextSkeleton />
        <TextSkeleton className="w-2/3" />
      </div>
    </div>
  )
}

export function ListItemSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  if (!loading && children) return <>{children}</>
  
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <AvatarSkeleton />
      <div className="space-y-2 flex-1">
        <TitleSkeleton className="h-4 w-1/4" />
        <TextSkeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ 
  columns = 4, 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps & { columns?: number }) {
  if (!loading && children) return <>{children}</>
  
  return (
    <div className={cn("flex space-x-4", className)}>
      {Array.from({ length: columns }, (_, i) => (
        <TextSkeleton key={i} className="flex-1" />
      ))}
    </div>
  )
}

export function NavigationSkeleton({ 
  className, 
  loading = true, 
  children 
}: SkeletonVariantProps) {
  if (!loading && children) return <>{children}</>
  
  return (
    <div className={cn("flex space-x-6", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <TextSkeleton key={i} className="h-4 w-20" />
      ))}
    </div>
  )
}