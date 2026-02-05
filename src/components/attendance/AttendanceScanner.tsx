 import { useRef, useState, useCallback, useEffect } from 'react';
 import { CameraView } from './CameraView';
 import { ScannerOverlay } from './ScannerOverlay';
 import { useFaceRecognition } from '@/hooks/useFaceRecognition';
 import { useGeolocation } from '@/hooks/useGeolocation';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { toast } from '@/hooks/use-toast';
 import type { User, AttendanceRecord, FaceDetectionResult } from '@/types/attendance';
 import { 
   Camera, 
   CameraOff, 
   MapPin, 
   UserCheck,
   ShieldCheck,
   Loader2 
 } from 'lucide-react';
 
 interface AttendanceScannerProps {
   currentUser: User | null;
   users: User[];
   onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
   onUserRecognized?: (user: User) => void;
   hasMarkedToday: boolean;
 }
 
 export function AttendanceScanner({
   currentUser,
   users,
   onMarkAttendance,
   onUserRecognized,
   hasMarkedToday,
 }: AttendanceScannerProps) {
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isCameraActive, setIsCameraActive] = useState(false);
   const [isScanning, setIsScanning] = useState(false);
   const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
   
   const {
     isModelLoaded,
     status,
     lastDetection,
     loadModels,
     detectFace,
     matchFace,
     startContinuousDetection,
     stopContinuousDetection,
   } = useFaceRecognition();
   
   const { position, getCurrentPosition, isLoading: geoLoading } = useGeolocation();
 
   // Load models on mount
   useEffect(() => {
     loadModels();
   }, [loadModels]);
 
   const findMatchingUser = useCallback((descriptor: Float32Array): User | null => {
     let bestMatch: User | null = null;
     let bestScore = 0;
     const threshold = 0.4; // Minimum similarity threshold
 
     for (const user of users) {
       if (user.faceDescriptor) {
         const score = matchFace(descriptor, user.faceDescriptor);
         if (score > threshold && score > bestScore) {
           bestScore = score;
           bestMatch = user;
         }
       }
     }
 
     return bestMatch;
   }, [users, matchFace]);
 
   const handleDetection = useCallback((result: FaceDetectionResult) => {
     if (result.detected && result.descriptor) {
       const matched = findMatchingUser(result.descriptor);
       if (matched) {
         setRecognizedUser(matched);
         onUserRecognized?.(matched);
       }
     }
   }, [findMatchingUser, onUserRecognized]);
 
   const startScanning = useCallback(async () => {
     if (!isModelLoaded) {
       toast({
         title: 'Models loading',
         description: 'Please wait for face recognition models to load',
         variant: 'destructive',
       });
       return;
     }
 
     if (!videoRef.current) return;
 
     // Get location
     getCurrentPosition();
 
     setIsScanning(true);
     setRecognizedUser(null);
     startContinuousDetection(videoRef.current, handleDetection, 300);
   }, [isModelLoaded, getCurrentPosition, startContinuousDetection, handleDetection]);
 
   const stopScanning = useCallback(() => {
     stopContinuousDetection();
     setIsScanning(false);
   }, [stopContinuousDetection]);
 
   const handleMarkAttendance = useCallback(async () => {
     const userToMark = recognizedUser || currentUser;
     
     if (!userToMark) {
       toast({
         title: 'No user identified',
         description: 'Please ensure a face is recognized before marking attendance',
         variant: 'destructive',
       });
       return;
     }
 
     if (!lastDetection?.detected) {
       toast({
         title: 'Face not detected',
         description: 'Please position your face in the frame',
         variant: 'destructive',
       });
       return;
     }
 
     const now = new Date();
     
     const record: Omit<AttendanceRecord, 'id'> = {
       userId: userToMark.id,
       courseId: userToMark.courseId,
       date: now.toISOString().split('T')[0],
       time: now.toTimeString().split(' ')[0],
       lat: position?.latitude,
       lng: position?.longitude,
       locationAccuracy: position?.accuracy,
       confidence: lastDetection.confidence,
       status: 'Present',
       method: 'Biometric Face Recognition',
       notes: 'Automated face verification',
       verified: true,
       device: navigator.userAgent,
     };
 
     onMarkAttendance(record);
     stopScanning();
     setIsCameraActive(false);
 
     toast({
       title: '✅ Attendance Marked',
       description: `Successfully marked for ${userToMark.fullName} at ${record.time}`,
     });
   }, [recognizedUser, currentUser, lastDetection, position, onMarkAttendance, stopScanning]);
 
   const toggleCamera = () => {
     if (isCameraActive) {
       stopScanning();
       setIsCameraActive(false);
     } else {
       setIsCameraActive(true);
     }
   };
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center justify-between">
           <span className="flex items-center gap-2">
             <ShieldCheck className="w-5 h-5" />
             Biometric Attendance
           </span>
           <div className="flex items-center gap-2">
             {!isModelLoaded && (
               <Badge variant="outline" className="animate-pulse">
                 <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                 Loading Models
               </Badge>
             )}
             {position && (
               <Badge variant="secondary">
                 <MapPin className="w-3 h-3 mr-1" />
                 {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
               </Badge>
             )}
           </div>
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {/* Camera view with overlay */}
         <div className="relative aspect-video overflow-hidden rounded-lg">
           <CameraView
             ref={videoRef}
             isActive={isCameraActive}
             onToggle={toggleCamera}
             className="w-full h-full"
           />
           {isCameraActive && (
             <ScannerOverlay
               status={status}
               detection={lastDetection}
               isModelLoading={!isModelLoaded}
             />
           )}
         </div>
 
         {/* User recognition status */}
         {recognizedUser && (
           <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
             <UserCheck className="w-8 h-8 text-green-500" />
             <div>
               <p className="font-medium text-green-500">User Recognized</p>
               <p className="text-sm text-muted-foreground">{recognizedUser.fullName}</p>
             </div>
           </div>
         )}
 
         {/* Already marked warning */}
         {hasMarkedToday && (
           <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-600">
             ⚠️ You have already marked attendance today
           </div>
         )}
 
         {/* Control buttons */}
         <div className="flex gap-3">
           {!isCameraActive ? (
             <Button 
               onClick={toggleCamera} 
               className="flex-1"
               disabled={!isModelLoaded}
             >
               <Camera className="w-4 h-4 mr-2" />
               Start Camera
             </Button>
           ) : !isScanning ? (
             <>
               <Button 
                 onClick={startScanning} 
                 className="flex-1"
                 disabled={!isModelLoaded}
               >
                 <ShieldCheck className="w-4 h-4 mr-2" />
                 Start Scanning
               </Button>
               <Button 
                 onClick={toggleCamera} 
                 variant="outline"
               >
                 <CameraOff className="w-4 h-4" />
               </Button>
             </>
           ) : (
             <>
               <Button
                 onClick={handleMarkAttendance}
                 className="flex-1"
                 disabled={!lastDetection?.detected}
                 variant={lastDetection?.detected ? 'default' : 'secondary'}
               >
                 <UserCheck className="w-4 h-4 mr-2" />
                 Mark Attendance
               </Button>
               <Button 
                 onClick={stopScanning} 
                 variant="outline"
               >
                 <CameraOff className="w-4 h-4" />
               </Button>
             </>
           )}
         </div>
       </CardContent>
     </Card>
   );
 }