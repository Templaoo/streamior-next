'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/advanced-skeleton';
import { 
  Youtube, 
  Facebook, 
  Twitter, 
  Twitch,
  Plus,
  Settings,
  Eye,
  EyeOff,
  MoreHorizontal,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  platform: 'youtube' | 'facebook' | 'twitter' | 'twitch' | 'custom';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  isEnabled: boolean;
  streamKey?: string;
  lastUsed?: string;
  followers?: string;
  description?: string;
}

export default function DestinationsPage() {
  const { loading } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: '1',
      name: 'My YouTube Channel',
      platform: 'youtube',
      status: 'connected',
      isEnabled: true,
      followers: '1.2K subscribers',
      lastUsed: '2 days ago',
      description: 'Main streaming channel'
    },
    {
      id: '2',
      name: 'Facebook Page',
      platform: 'facebook',
      status: 'connected',
      isEnabled: false,
      followers: '856 followers',
      lastUsed: '1 week ago',
      description: 'Business page streaming'
    },
    {
      id: '3',
      name: 'Gaming Twitch',
      platform: 'twitch',
      status: 'disconnected',
      isEnabled: false,
      followers: '342 followers',
      lastUsed: 'Never',
      description: 'Gaming content'
    },
    {
      id: '4',
      name: 'Custom RTMP',
      platform: 'custom',
      status: 'pending',
      isEnabled: true,
      description: 'Custom streaming server'
    }
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="h-5 w-5 text-red-500" />;
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'twitch': return <Twitch className="h-5 w-5 text-purple-500" />;
      default: return <Share2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" />Disconnected</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const toggleDestination = (id: string) => {
    setDestinations(prev => 
      prev.map(dest => 
        dest.id === id ? { ...dest, isEnabled: !dest.isEnabled } : dest
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
        <p className="text-muted-foreground">
          Manage your streaming destinations and broadcast to multiple platforms simultaneously.
        </p>
      </div>

      {/* Quick Add Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Popular Platforms</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Custom RTMP
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* YouTube Card */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-red-200">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-red-50 dark:bg-red-950/50 p-3 rounded-full mb-3">
                <Youtube className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-semibold mb-1">YouTube</h3>
              <p className="text-sm text-muted-foreground mb-3">Live stream to YouTube</p>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            </CardContent>
          </Card>

          {/* Facebook Card */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-200">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-full mb-3">
                <Facebook className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Facebook</h3>
              <p className="text-sm text-muted-foreground mb-3">Stream to Facebook Live</p>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            </CardContent>
          </Card>

          {/* Twitch Card */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-purple-200">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-full mb-3">
                <Twitch className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-1">Twitch</h3>
              <p className="text-sm text-muted-foreground mb-3">Stream to Twitch</p>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            </CardContent>
          </Card>

          {/* Twitter Card */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-200">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-full mb-3">
                <Twitter className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Twitter</h3>
              <p className="text-sm text-muted-foreground mb-3">Stream to Twitter Live</p>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connected Destinations Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Destinations</h2>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(destination.platform)}
                        <div>
                          <div className="font-medium">{destination.name}</div>
                          {destination.description && (
                            <div className="text-sm text-muted-foreground">
                              {destination.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(destination.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {destination.followers || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {destination.lastUsed}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDestination(destination.id)}
                        className="p-1"
                      >
                        {destination.isEnabled ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 active, 2 inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Ready to stream
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4K</div>
            <p className="text-xs text-muted-foreground">
              Combined followers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Streams broadcasted
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
