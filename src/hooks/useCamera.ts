 import { useState, useRef, useCallback, useEffect } from 'react';
 
 interface UseCameraOptions {
   facingMode?: 'user' | 'environment';
   width?: number;
   height?: number;
 }
 
 interface UseCameraReturn {
   videoRef: React.RefObject<HTMLVideoElement>;
   isActive: boolean;
   error: string | null;
   startCamera: () => Promise<void>;
   stopCamera: () => void;
   captureFrame: () => ImageData | null;
 }
 
 export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
   const { facingMode = 'user', width = 640, height = 480 } = options;
   
   const videoRef = useRef<HTMLVideoElement>(null);
   const streamRef = useRef<MediaStream | null>(null);
   const [isActive, setIsActive] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const startCamera = useCallback(async () => {
     try {
       setError(null);
       
       const constraints: MediaStreamConstraints = {
         video: {
           facingMode,
           width: { ideal: width },
           height: { ideal: height },
         },
         audio: false,
       };
 
       const stream = await navigator.mediaDevices.getUserMedia(constraints);
       streamRef.current = stream;
 
       if (videoRef.current) {
         videoRef.current.srcObject = stream;
         await videoRef.current.play();
         setIsActive(true);
       }
     } catch (err) {
       const message = err instanceof Error ? err.message : 'Failed to access camera';
       setError(message);
       console.error('Camera error:', err);
     }
   }, [facingMode, width, height]);
 
   const stopCamera = useCallback(() => {
     if (streamRef.current) {
       streamRef.current.getTracks().forEach(track => track.stop());
       streamRef.current = null;
     }
     if (videoRef.current) {
       videoRef.current.srcObject = null;
     }
     setIsActive(false);
   }, []);
 
   const captureFrame = useCallback((): ImageData | null => {
     if (!videoRef.current || !isActive) return null;
 
     const video = videoRef.current;
     const canvas = document.createElement('canvas');
     canvas.width = video.videoWidth;
     canvas.height = video.videoHeight;
     
     const ctx = canvas.getContext('2d');
     if (!ctx) return null;
 
     ctx.drawImage(video, 0, 0);
     return ctx.getImageData(0, 0, canvas.width, canvas.height);
   }, [isActive]);
 
   // Cleanup on unmount
   useEffect(() => {
     return () => {
       if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
       }
     };
   }, []);
 
   return {
     videoRef,
     isActive,
     error,
     startCamera,
     stopCamera,
     captureFrame,
   };
 }