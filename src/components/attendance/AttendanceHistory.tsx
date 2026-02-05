 import { useState } from 'react';
 import type { AttendanceRecord, Course } from '@/types/attendance';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { Download, Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
 
 interface AttendanceHistoryProps {
   records: AttendanceRecord[];
   getCourse: (courseId: string) => Course | undefined;
   onExport: () => void;
 }
 
 const statusIcons = {
   Present: <CheckCircle2 className="w-4 h-4" />,
   Absent: <XCircle className="w-4 h-4" />,
   Late: <AlertCircle className="w-4 h-4" />,
   Excused: <Clock className="w-4 h-4" />,
 };
 
 const statusColors = {
   Present: 'bg-green-500/10 text-green-500 border-green-500/20',
   Absent: 'bg-destructive/10 text-destructive border-destructive/20',
   Late: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
   Excused: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
 };
 
 export function AttendanceHistory({ records, getCourse, onExport }: AttendanceHistoryProps) {
   const [showAll, setShowAll] = useState(false);
   
   const displayRecords = showAll ? records : records.slice(0, 5);
   
   if (records.length === 0) {
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Calendar className="w-5 h-5" />
             Attendance History
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col items-center justify-center py-12 text-center">
             <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-2">No attendance records yet</p>
             <p className="text-sm text-muted-foreground">
               Start the scanner above to mark your first attendance
             </p>
           </div>
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <CardTitle className="flex items-center gap-2">
           <Calendar className="w-5 h-5" />
           Attendance History
         </CardTitle>
         <Button variant="outline" size="sm" onClick={onExport}>
           <Download className="w-4 h-4 mr-2" />
           Export CSV
         </Button>
       </CardHeader>
       <CardContent>
         <div className="overflow-x-auto">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Date & Time</TableHead>
                 <TableHead>Course</TableHead>
                 <TableHead>Location</TableHead>
                 <TableHead>Method</TableHead>
                 <TableHead>Confidence</TableHead>
                 <TableHead>Status</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {displayRecords.map((record) => {
                 const course = getCourse(record.courseId || '');
                 
                 return (
                   <TableRow key={record.id}>
                     <TableCell>
                       <div className="font-medium">{record.date}</div>
                       <div className="text-xs text-muted-foreground">{record.time}</div>
                     </TableCell>
                     <TableCell>
                       {course ? course.name : 'General'}
                     </TableCell>
                     <TableCell>
                       {record.lat && record.lng ? (
                         <div className="flex items-center gap-1 text-sm">
                           <MapPin className="w-3 h-3" />
                           {record.lat.toFixed(4)}, {record.lng.toFixed(4)}
                         </div>
                       ) : (
                         <span className="text-muted-foreground">N/A</span>
                       )}
                     </TableCell>
                     <TableCell>
                       <Badge variant="secondary" className="text-xs">
                         {record.method}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <span className={`font-bold ${
                         record.confidence > 0.9 ? 'text-green-500' :
                         record.confidence > 0.7 ? 'text-yellow-500' :
                         'text-destructive'
                       }`}>
                         {Math.round(record.confidence * 100)}%
                       </span>
                     </TableCell>
                     <TableCell>
                       <Badge className={statusColors[record.status]}>
                         {statusIcons[record.status]}
                         <span className="ml-1">{record.status}</span>
                       </Badge>
                     </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
         </div>
         
         {records.length > 5 && (
           <div className="mt-4 text-center">
             <Button
               variant="ghost"
               onClick={() => setShowAll(!showAll)}
             >
               {showAll ? 'Show Less' : `Show All (${records.length} records)`}
             </Button>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }