'use client';

import { Button } from '@/components/ui/button';
import { 
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Twitch,
  Plus
} from 'lucide-react';

export default function DestinationsPage() {
  return (
    <div className="space-y-8">
      {/* Page title (top-left) */}
      <h1 className="text-2xl font-semibold">Destinations</h1>

      {/* Empty state centered */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-xl">
          {/* Icons row */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex -space-x-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-1 ring-border">
                <Youtube className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 ring-1 ring-border">
                <Facebook className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 ring-1 ring-border">
                <Instagram className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 ring-1 ring-border">
                <Twitter className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 ring-1 ring-border">
                <Linkedin className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 ring-1 ring-border">
                <Twitch className="h-5 w-5" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground/80 ring-1 ring-border">
                <Plus className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Texts */}
          <h2 className="text-xl font-semibold mb-2">No destination added</h2>
          <p className="text-muted-foreground mb-6">
            Connect a StreamYard account. Once connected, you can stream to it as often as you like.
          </p>

          {/* Call to action */}
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add a destination
          </Button>
        </div>
      </div>
    </div>
  );
}
