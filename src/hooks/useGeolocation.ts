 import { useState, useCallback } from 'react';
 import type { GeoPosition } from '@/types/attendance';
 
 interface UseGeolocationReturn {
   position: GeoPosition | null;
   error: string | null;
   isLoading: boolean;
   getCurrentPosition: () => Promise<GeoPosition | null>;
 }
 
 export function useGeolocation(): UseGeolocationReturn {
   const [position, setPosition] = useState<GeoPosition | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
 
   const getCurrentPosition = useCallback(async (): Promise<GeoPosition | null> => {
     if (!('geolocation' in navigator)) {
       setError('Geolocation is not supported by this browser');
       return null;
     }
 
     setIsLoading(true);
     setError(null);
 
     return new Promise((resolve) => {
       navigator.geolocation.getCurrentPosition(
         (pos) => {
           const geoPos: GeoPosition = {
             latitude: pos.coords.latitude,
             longitude: pos.coords.longitude,
             accuracy: pos.coords.accuracy,
           };
           setPosition(geoPos);
           setIsLoading(false);
           resolve(geoPos);
         },
         (err) => {
           const message = getGeolocationErrorMessage(err.code);
           setError(message);
           setIsLoading(false);
           resolve(null);
         },
         {
           enableHighAccuracy: true,
           timeout: 10000,
           maximumAge: 0,
         }
       );
     });
   }, []);
 
   return {
     position,
     error,
     isLoading,
     getCurrentPosition,
   };
 }
 
 function getGeolocationErrorMessage(code: number): string {
   switch (code) {
     case 1:
       return 'Location permission denied';
     case 2:
       return 'Location unavailable';
     case 3:
       return 'Location request timed out';
     default:
       return 'Unknown geolocation error';
   }
 }