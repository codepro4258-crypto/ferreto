 import { useEffect, forwardRef } from 'react';
 import { useCamera } from '@/hooks/useCamera';
 import { Card } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Camera, CameraOff, AlertCircle } from 'lucide-react';
 
 interface CameraViewProps {
   onCameraReady?: () => void;
   onCameraError?: (error: string) => void;
   isActive: boolean;
   onToggle: () => void;
   className?: string;
 }
 
 export const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
   ({ onCameraReady, onCameraError, isActive, onToggle, className = '' }, ref) => {
     const { videoRef, isActive: cameraActive, error, startCamera, stopCamera } = useCamera({
       facingMode: 'user',
       width: 640,
       height: 480,
     });
 
     useEffect(() => {
       if (isActive && !cameraActive) {
         startCamera().then(() => {
           onCameraReady?.();
         });
       } else if (!isActive && cameraActive) {
         stopCamera();
       }
     }, [isActive, cameraActive, startCamera, stopCamera, onCameraReady]);
 
     useEffect(() => {
       if (error) {
         onCameraError?.(error);
       }
     }, [error, onCameraError]);
 
     // Forward the internal ref to the parent
     useEffect(() => {
       if (ref && typeof ref === 'object' && videoRef.current) {
         (ref as React.MutableRefObject<HTMLVideoElement | null>).current = videoRef.current;
       }
     }, [ref, videoRef, cameraActive]);
 
     return (
       <Card className={`relative overflow-hidden bg-muted ${className}`}>
         {error ? (
           <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center">
             <AlertCircle className="w-12 h-12 text-destructive mb-4" />
             <p className="text-destructive font-medium mb-2">Camera Error</p>
             <p className="text-sm text-muted-foreground mb-4">{error}</p>
             <Button onClick={() => startCamera()} variant="outline" size="sm">
               <Camera className="w-4 h-4 mr-2" />
               Retry
             </Button>
           </div>
         ) : !isActive ? (
           <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
             <CameraOff className="w-16 h-16 text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">Camera is off</p>
             <Button onClick={onToggle}>
               <Camera className="w-4 h-4 mr-2" />
               Start Camera
             </Button>
           </div>
         ) : (
           <video
             ref={videoRef}
             autoPlay
             playsInline
             muted
             className="w-full h-auto transform scale-x-[-1]"
           />
         )}
       </Card>
     );
   }
 );
 
 CameraView.displayName = 'CameraView';