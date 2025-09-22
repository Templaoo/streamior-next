"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { 
  CardSkeleton, 
  ListItemSkeleton, 
  TableRowSkeleton,
  TextSkeleton,
  TitleSkeleton,
  AvatarSkeleton,
  ImageSkeleton 
} from '@/components/loading/skeleton-variants'

export default function DemoPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleLoading = () => setLoading(!loading)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">🎨 Skeleton Components Demo</h1>
            <p className="text-muted-foreground mb-6">
              Testez les différents composants de skeleton avec le mode sombre/clair
            </p>
            <Button onClick={toggleLoading} variant="outline">
              {loading ? '⏱️ Stop Loading' : '🔄 Start Loading'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Text & Title Skeletons */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Text & Titles</h2>
              <div className="border rounded-lg p-4 space-y-3">
                <TitleSkeleton loading={loading}>
                  <h3 className="text-lg font-medium">This is a real title</h3>
                </TitleSkeleton>
                <TextSkeleton loading={loading}>
                  <p>This is real text content that replaces the skeleton.</p>
                </TextSkeleton>
                <TextSkeleton loading={loading} className="w-3/4">
                  <p className="w-3/4">Shorter text content here.</p>
                </TextSkeleton>
              </div>
            </div>

            {/* Avatar & Image Skeletons */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Avatar & Images</h2>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <AvatarSkeleton loading={loading}>
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">U</span>
                    </div>
                  </AvatarSkeleton>
                  <TextSkeleton loading={loading}>
                    <span>User Name</span>
                  </TextSkeleton>
                </div>
                <ImageSkeleton loading={loading}>
                  <div className="aspect-video w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">Real Image</span>
                  </div>
                </ImageSkeleton>
              </div>
            </div>
          </div>

          {/* Card Skeleton */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Card Skeleton</h2>
            <div className="border rounded-lg">
              <CardSkeleton loading={loading}>
                <div className="p-4 space-y-4">
                  <div className="aspect-video w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">Real Card Content</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Real Card Title</h3>
                    <p className="text-muted-foreground">This is the actual card description that appears when loading is complete.</p>
                    <p className="text-muted-foreground">Additional content line here.</p>
                  </div>
                </div>
              </CardSkeleton>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">List Items</h2>
            <div className="border rounded-lg p-4 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <ListItemSkeleton key={i} loading={loading}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{i + 1}</span>
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">Real List Item #{i + 1}</h4>
                      <p className="text-sm text-muted-foreground">Real description for item {i + 1}</p>
                    </div>
                  </div>
                </ListItemSkeleton>
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Table Rows</h2>
            <div className="border rounded-lg p-4 space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <TableRowSkeleton key={i} loading={loading} columns={4}>
                  <div className="flex space-x-4">
                    <div className="flex-1">Column 1 Data</div>
                    <div className="flex-1">Column 2 Data</div>
                    <div className="flex-1">Column 3 Data</div>
                    <div className="flex-1">Column 4 Data</div>
                  </div>
                </TableRowSkeleton>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}