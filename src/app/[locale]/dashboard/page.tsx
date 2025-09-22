'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/advanced-skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Video, 
  Radio, 
  Calendar,
  Play,
  MoreHorizontal,
  X,
  Gift,
  Star
} from 'lucide-react';

export default function DashboardPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Mock stream data
  const streams = [
    {
      id: 1,
      title: "testnet",
      date: "Sept 19, 22:06",
      status: "scheduled",
      avatar: "/avatars/user1.jpg"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Special Offer Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-600">
                <Gift className="h-3 w-3 mr-1" />
                NEW
              </Badge>
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Special Offer</span>
            </div>
            <span className="text-muted-foreground">
              Upgrade to Advanced subscription for $1 only!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Create</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Live Stream */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Stream</h3>
              <p className="text-muted-foreground text-sm">
                Start streaming live to your audience
              </p>
            </CardContent>
          </Card>

          {/* Recording */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-green-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-4">
                <Radio className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Recording</h3>
              <p className="text-muted-foreground text-sm">
                Record content for later use
              </p>
            </CardContent>
          </Card>

          {/* On-Air Webinar */}
          <Card className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-purple-200">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">On-Air Webinar</h3>
              <p className="text-muted-foreground text-sm">
                Host interactive webinars
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Streams and Recordings Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Streams and Recordings</h2>
        
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="upcoming" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-4 px-6"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="previous" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none py-4 px-6"
                  >
                    Previous
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming" className="p-6 m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Creation</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {streams.map((stream) => (
                      <TableRow key={stream.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-500 text-white">
                                <Play className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{stream.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {stream.date}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          —
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Access Studio
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {streams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No upcoming streams
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="previous" className="p-6 m-0">
                <div className="text-center py-8 text-muted-foreground">
                  No previous streams yet
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
