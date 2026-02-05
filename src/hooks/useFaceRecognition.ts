 import { useState, useCallback, useRef, useEffect } from 'react';
 import * as faceapi from 'face-api.js';
 import type { FaceDetectionResult, ScannerStatus } from '@/types/attendance';
 
 const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
 
 interface UseFaceRecognitionReturn {
   isModelLoaded: boolean;
   status: ScannerStatus;
   lastDetection: FaceDetectionResult | null;
   loadModels: () => Promise<void>;
   detectFace: (video: HTMLVideoElement) => Promise<FaceDetectionResult>;
   matchFace: (descriptor1: Float32Array, descriptor2: Float32Array) => number;
   startContinuousDetection: (
     video: HTMLVideoElement,
     onDetection: (result: FaceDetectionResult) => void,
     intervalMs?: number
   ) => void;
   stopContinuousDetection: () => void;
 }
 
 export function useFaceRecognition(): UseFaceRecognitionReturn {
   const [isModelLoaded, setIsModelLoaded] = useState(false);
   const [status, setStatus] = useState<ScannerStatus>('idle');
   const [lastDetection, setLastDetection] = useState<FaceDetectionResult | null>(null);
   const detectionIntervalRef = useRef<number | null>(null);
 
   const loadModels = useCallback(async () => {
     if (isModelLoaded) return;
     
     setStatus('initializing');
     try {
       await Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
         faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
       ]);
       setIsModelLoaded(true);
       setStatus('ready');
       console.log('Face API models loaded successfully');
     } catch (error) {
       console.error('Error loading face-api models:', error);
       setStatus('error');
       throw error;
     }
   }, [isModelLoaded]);
 
   const detectFace = useCallback(async (
     video: HTMLVideoElement
   ): Promise<FaceDetectionResult> => {
     if (!isModelLoaded) {
       return { detected: false, confidence: 0, descriptor: null };
     }
 
     try {
       const detection = await faceapi
         .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
         .withFaceLandmarks()
         .withFaceDescriptor();
 
       if (detection) {
         const result: FaceDetectionResult = {
           detected: true,
           confidence: detection.detection.score,
           descriptor: detection.descriptor,
           boundingBox: {
             x: detection.detection.box.x,
             y: detection.detection.box.y,
             width: detection.detection.box.width,
             height: detection.detection.box.height,
           },
         };
         setLastDetection(result);
         return result;
       }
 
       return { detected: false, confidence: 0, descriptor: null };
     } catch (error) {
       console.error('Face detection error:', error);
       return { detected: false, confidence: 0, descriptor: null };
     }
   }, [isModelLoaded]);
 
   const matchFace = useCallback((
     descriptor1: Float32Array,
     descriptor2: Float32Array
   ): number => {
     const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
     // Convert distance to similarity (0-1, where 1 is perfect match)
     // Typical threshold is 0.6 distance = good match
     const similarity = Math.max(0, 1 - distance);
     return similarity;
   }, []);
 
   const startContinuousDetection = useCallback((
     video: HTMLVideoElement,
     onDetection: (result: FaceDetectionResult) => void,
     intervalMs: number = 500
   ) => {
     if (detectionIntervalRef.current) {
       clearInterval(detectionIntervalRef.current);
     }
 
     setStatus('scanning');
 
     detectionIntervalRef.current = window.setInterval(async () => {
       const result = await detectFace(video);
       onDetection(result);
       
       if (result.detected) {
         setStatus('detected');
       } else {
         setStatus('scanning');
       }
     }, intervalMs);
   }, [detectFace]);
 
   const stopContinuousDetection = useCallback(() => {
     if (detectionIntervalRef.current) {
       clearInterval(detectionIntervalRef.current);
       detectionIntervalRef.current = null;
     }
     setStatus('ready');
   }, []);
 
   // Cleanup on unmount
   useEffect(() => {
     return () => {
       if (detectionIntervalRef.current) {
         clearInterval(detectionIntervalRef.current);
       }
     };
   }, []);
 
   return {
     isModelLoaded,
     status,
     lastDetection,
     loadModels,
     detectFace,
     matchFace,
     startContinuousDetection,
     stopContinuousDetection,
   };
 }