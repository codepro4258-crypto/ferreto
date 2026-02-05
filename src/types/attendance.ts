 // Types for the biometric attendance system
 
 export interface User {
   id: string;
   username: string;
   fullName: string;
   email: string;
   courseId?: string;
   faceDescriptor: Float32Array | null;
   registeredAt?: string;
   avatarUrl?: string;
 }
 
 export interface AttendanceRecord {
   id: string;
   userId: string;
   courseId?: string;
   date: string;
   time: string;
   lat?: number;
   lng?: number;
   locationAccuracy?: number;
   confidence: number;
   status: 'Present' | 'Absent' | 'Late' | 'Excused';
   method: string;
   notes?: string;
   verified: boolean;
   device?: string;
 }
 
 export interface Course {
   id: string;
   name: string;
   code: string;
   instructor?: string;
   schedule?: string;
 }
 
 export interface GeoPosition {
   latitude: number;
   longitude: number;
   accuracy: number;
 }
 
 export type ScannerStatus = 
   | 'idle' 
   | 'initializing' 
   | 'ready' 
   | 'scanning' 
   | 'detected' 
   | 'verified' 
   | 'failed' 
   | 'error';
 
 export interface FaceDetectionResult {
   detected: boolean;
   confidence: number;
   descriptor: Float32Array | null;
   boundingBox?: {
     x: number;
     y: number;
     width: number;
     height: number;
   };
 }