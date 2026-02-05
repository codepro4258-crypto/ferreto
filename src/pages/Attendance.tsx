 import { useState, useRef, useCallback, useEffect } from 'react';
 import { AttendanceScanner } from '@/components/attendance/AttendanceScanner';
 import { AttendanceHistory } from '@/components/attendance/AttendanceHistory';
 import { UserRegistration } from '@/components/attendance/UserRegistration';
 import { CameraView } from '@/components/attendance/CameraView';
 import { ScannerOverlay } from '@/components/attendance/ScannerOverlay';
 import { useAttendanceStore } from '@/hooks/useAttendanceStore';
 import { useFaceRecognition } from '@/hooks/useFaceRecognition';
 import { toast } from '@/hooks/use-toast';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { 
   UserCheck, 
   Users, 
   Calendar, 
   Shield, 
   LogOut,
   Camera 
 } from 'lucide-react';
 
 export default function AttendancePage() {
   const [activeTab, setActiveTab] = useState('scanner');
   const [showFaceCapture, setShowFaceCapture] = useState(false);
   const [capturedDescriptor, setCapturedDescriptor] = useState<Float32Array | null>(null);
   const [isCameraActive, setIsCameraActive] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
 
   const {
     users,
     courses,
     currentUser,
     registerUser,
     setCurrentUser,
     addAttendanceRecord,
     getUserAttendance,
     hasMarkedToday,
     getCourse,
     exportToCSV,
   } = useAttendanceStore();
 
   const {
     isModelLoaded,
     status: faceStatus,
     lastDetection,
     loadModels,
     detectFace,
   } = useFaceRecognition();
 
   // Load face models
   useEffect(() => {
     loadModels();
   }, [loadModels]);
 
   const handleFaceCapture = useCallback(async () => {
     if (!videoRef.current || !isModelLoaded) return;
 
     const result = await detectFace(videoRef.current);
     
     if (result.detected && result.descriptor) {
       setCapturedDescriptor(result.descriptor);
       setShowFaceCapture(false);
       setIsCameraActive(false);
       toast({
         title: 'Face Captured',
         description: 'Your face has been registered successfully',
       });
     } else {
       toast({
         title: 'Face Not Detected',
         description: 'Please position your face clearly in the frame',
         variant: 'destructive',
       });
     }
   }, [isModelLoaded, detectFace]);
 
   const handleExportCSV = useCallback(() => {
     if (!currentUser) return;
     
     const csv = exportToCSV(currentUser.id);
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `attendance_${currentUser.username}_${new Date().toISOString().split('T')[0]}.csv`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
     
     toast({
       title: 'Exported',
       description: 'Attendance data has been downloaded as CSV',
     });
   }, [currentUser, exportToCSV]);
 
   const handleLogout = () => {
     setCurrentUser(null);
     setActiveTab('scanner');
     toast({
       title: 'Logged Out',
       description: 'You have been logged out successfully',
     });
   };
 
   const userAttendance = currentUser ? getUserAttendance(currentUser.id) : [];
   const todayMarked = currentUser ? hasMarkedToday(currentUser.id) : false;
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="border-b bg-card">
         <div className="container mx-auto px-4 py-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Shield className="w-8 h-8 text-primary" />
               <div>
                 <h1 className="text-xl font-bold">Biometric Attendance</h1>
                 <p className="text-sm text-muted-foreground">Face Recognition System</p>
               </div>
             </div>
             
             {currentUser && (
               <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                   <p className="font-medium">{currentUser.fullName}</p>
                   <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                 </div>
                 <Badge 
                   variant={currentUser.faceDescriptor ? 'default' : 'destructive'}
                   className="hidden sm:flex"
                 >
                   <UserCheck className="w-3 h-3 mr-1" />
                   {currentUser.faceDescriptor ? 'Face ID Active' : 'No Face ID'}
                 </Badge>
                 <Button variant="ghost" size="icon" onClick={handleLogout}>
                   <LogOut className="w-4 h-4" />
                 </Button>
               </div>
             )}
           </div>
         </div>
       </header>
 
       {/* Main Content */}
       <main className="container mx-auto px-4 py-6">
         {!currentUser ? (
           // Registration Flow
           <div className="max-w-2xl mx-auto space-y-6">
             <div className="text-center mb-8">
               <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
               <h2 className="text-2xl font-bold mb-2">Welcome to Biometric Attendance</h2>
               <p className="text-muted-foreground">
                 Register your face to start marking attendance automatically
               </p>
             </div>
 
             {/* Existing Users Quick Login */}
             {users.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Users className="w-5 h-5" />
                     Existing Users
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid gap-2 sm:grid-cols-2">
                     {users.map((user) => (
                       <Button
                         key={user.id}
                         variant="outline"
                         className="justify-start h-auto py-3"
                         onClick={() => setCurrentUser(user.id)}
                       >
                         <UserCheck className="w-4 h-4 mr-2" />
                         <div className="text-left">
                           <div className="font-medium">{user.fullName}</div>
                           <div className="text-xs text-muted-foreground">{user.email}</div>
                         </div>
                       </Button>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}
 
             {/* Registration Form */}
             <UserRegistration
               courses={courses}
               onRegister={registerUser}
               onStartFaceCapture={() => {
                 setShowFaceCapture(true);
                 setIsCameraActive(true);
               }}
               faceDescriptor={capturedDescriptor}
               isCapturing={showFaceCapture}
             />
           </div>
         ) : (
           // Main Dashboard
           <Tabs value={activeTab} onValueChange={setActiveTab}>
             <TabsList className="grid w-full grid-cols-2 mb-6">
               <TabsTrigger value="scanner" className="gap-2">
                 <Camera className="w-4 h-4" />
                 Scanner
               </TabsTrigger>
               <TabsTrigger value="history" className="gap-2">
                 <Calendar className="w-4 h-4" />
                 History
               </TabsTrigger>
             </TabsList>
 
             <TabsContent value="scanner" className="space-y-6">
               <AttendanceScanner
                 currentUser={currentUser}
                 users={users}
                 onMarkAttendance={addAttendanceRecord}
                 hasMarkedToday={todayMarked}
               />
 
               {/* Quick Stats */}
               <div className="grid gap-4 sm:grid-cols-3">
                 <Card>
                   <CardContent className="pt-6">
                     <div className="text-center">
                       <div className="text-3xl font-bold text-primary">
                         {userAttendance.filter(a => a.status === 'Present').length}
                       </div>
                       <p className="text-sm text-muted-foreground">Days Present</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card>
                   <CardContent className="pt-6">
                     <div className="text-center">
                       <div className="text-3xl font-bold text-green-500">
                         {userAttendance.length > 0
                           ? Math.round(
                               (userAttendance.filter(a => a.status === 'Present').length /
                                 userAttendance.length) *
                                 100
                             )
                           : 0}%
                       </div>
                       <p className="text-sm text-muted-foreground">Attendance Rate</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card>
                   <CardContent className="pt-6">
                     <div className="text-center">
                       <div className="text-3xl font-bold">
                         {userAttendance.length}
                       </div>
                       <p className="text-sm text-muted-foreground">Total Records</p>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
 
             <TabsContent value="history">
               <AttendanceHistory
                 records={userAttendance}
                 getCourse={getCourse}
                 onExport={handleExportCSV}
               />
             </TabsContent>
           </Tabs>
         )}
       </main>
 
       {/* Face Capture Dialog */}
       <Dialog open={showFaceCapture} onOpenChange={setShowFaceCapture}>
         <DialogContent className="max-w-lg">
           <DialogHeader>
             <DialogTitle>Capture Your Face</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div className="relative aspect-video overflow-hidden rounded-lg">
               <CameraView
                 ref={videoRef}
                 isActive={isCameraActive}
                 onToggle={() => setIsCameraActive(!isCameraActive)}
                 className="w-full h-full"
               />
               {isCameraActive && (
                 <ScannerOverlay
                   status={faceStatus}
                   detection={lastDetection}
                   isModelLoading={!isModelLoaded}
                 />
               )}
             </div>
             <p className="text-sm text-muted-foreground text-center">
               Position your face within the frame and click capture
             </p>
             <div className="flex gap-3">
               <Button
                 onClick={handleFaceCapture}
                 className="flex-1"
                 disabled={!isCameraActive || !isModelLoaded}
               >
                 <Camera className="w-4 h-4 mr-2" />
                 Capture Face
               </Button>
               <Button
                 variant="outline"
                 onClick={() => {
                   setShowFaceCapture(false);
                   setIsCameraActive(false);
                 }}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   );
 }