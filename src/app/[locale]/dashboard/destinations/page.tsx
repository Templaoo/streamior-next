'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Twitch,
  Plus,
  X,
  CheckCircle,
  Settings,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConnectedDestination {
  provider: string
  channelId: string
  channelTitle: string
  thumbnail?: { url: string } | null
  connectedAt: number
}

export default function DestinationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectedDestinations, setConnectedDestinations] = useState<ConnectedDestination[]>([]);
  const { user } = useAuth();

  // Load connected destinations
  const loadConnectedDestinations = async () => {
    if (!user?.uid) return;

    try {
      const destinations: ConnectedDestination[] = [];
      
      // Check YouTube connection
      const youtubeDoc = await getDoc(doc(db, `users/${user.uid}/destinations/youtube`));
      if (youtubeDoc.exists()) {
        const data = youtubeDoc.data();
        destinations.push({
          provider: 'youtube',
          channelId: data.channelId,
          channelTitle: data.channelTitle,
          thumbnail: data.thumbnail,
          connectedAt: data.connectedAt
        });
      }

      setConnectedDestinations(destinations);
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  // Handle YouTube connection
  const handleYouTubeConnect = () => {
    if (!user?.uid) {
      alert('Please sign in first');
      return;
    }
    
    // Navigate to OAuth flow with user ID
    window.location.href = `/api/integrations/youtube/auth?uid=${user.uid}&r=/dashboard/destinations`;
  };

  // Load destinations when user changes
  useEffect(() => {
    loadConnectedDestinations();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle success/error messages from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const channel = urlParams.get('channel');

    if (success === 'youtube_connected' && channel) {
      // Reload destinations after successful connection
      loadConnectedDestinations();
      // Remove URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (error) {
      console.error('Connection error:', error);
      // Remove URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-8">
      {/* Page title (top-left) */}
      <h1 className="text-2xl font-semibold">Destinations</h1>

      {/* Connected Destinations */}
      {connectedDestinations.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Connected Destinations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedDestinations.map((dest) => (
              <Card key={`${dest.provider}-${dest.channelId}`} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {dest.provider === 'youtube' && (
                        <Youtube className="h-8 w-8 text-red-500" />
                      )}
                      <CheckCircle className="h-4 w-4 text-green-500 absolute -top-1 -right-1 bg-background rounded-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{dest.channelTitle}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{dest.provider}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        Connected {new Date(dest.connectedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state centered */}
      <div className={`flex items-center justify-center ${connectedDestinations.length > 0 ? 'min-h-[40vh]' : 'min-h-[60vh]'}`}>
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
          <h2 className="text-xl font-semibold mb-2">
            {connectedDestinations.length > 0 ? 'Add more destinations' : 'No destination added'}
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect a StreamYard account. Once connected, you can stream to it as often as you like.
          </p>

          {/* Call to action */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Add a destination
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a destination</DialogTitle>
              </DialogHeader>
              
              {/* Tabs */}
              <div className="space-y-4">
                <div className="flex space-x-1 border-b">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                    Live streaming
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Reuse
                  </button>
                </div>

                {/* Platform Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* YouTube */}
                  <button 
                    onClick={handleYouTubeConnect}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <Youtube className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-sm font-medium">YouTube</span>
                  </button>

                  {/* Facebook */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>

                  {/* LinkedIn */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-blue-700" />
                    </div>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>

                  {/* X (Twitter) */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <X className="w-6 h-6 text-black dark:text-white" />
                    </div>
                    <span className="text-sm font-medium">X (Twitter)</span>
                  </button>

                  {/* Twitch */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <Twitch className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Twitch</span>
                  </button>

                  {/* Instagram Live */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium">Instagram Live</span>
                  </button>

                  {/* Kick */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors relative">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center bg-green-500 text-white rounded">
                      <span className="text-sm font-bold">K</span>
                    </div>
                    <span className="text-sm font-medium">Kick</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  </button>

                  {/* Brightcove */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
                        <span className="text-white dark:text-black text-xs font-bold">B</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Brightcove</span>
                  </button>

                  {/* Hopin */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors relative">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">Hopin</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  </button>

                  {/* Other platforms */}
                  <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors relative">
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">RTMP</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Other platforms</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
