 import { useState, useCallback, useEffect } from 'react';
 import type { User, AttendanceRecord, Course } from '@/types/attendance';
 
 const STORAGE_KEY = 'biometric_attendance_data';
 
 interface AttendanceData {
   users: User[];
   attendance: AttendanceRecord[];
   courses: Course[];
   currentUserId: string | null;
 }
 
 const defaultData: AttendanceData = {
   users: [],
   attendance: [],
   courses: [
     { id: '1', name: 'Computer Science 101', code: 'CS101', instructor: 'Dr. Smith' },
     { id: '2', name: 'Mathematics', code: 'MATH201', instructor: 'Prof. Johnson' },
     { id: '3', name: 'Physics', code: 'PHY101', instructor: 'Dr. Williams' },
   ],
   currentUserId: null,
 };
 
 export function useAttendanceStore() {
   const [data, setData] = useState<AttendanceData>(() => {
     try {
       const stored = localStorage.getItem(STORAGE_KEY);
       if (stored) {
         const parsed = JSON.parse(stored);
         // Convert faceDescriptor arrays back to Float32Array
         parsed.users = parsed.users.map((user: User & { faceDescriptor: number[] | null }) => ({
           ...user,
           faceDescriptor: user.faceDescriptor 
             ? new Float32Array(user.faceDescriptor)
             : null,
         }));
         return parsed;
       }
     } catch (e) {
       console.error('Error loading attendance data:', e);
     }
     return defaultData;
   });
 
   // Save to localStorage whenever data changes
   useEffect(() => {
     try {
       // Convert Float32Array to regular array for JSON serialization
       const toSave = {
         ...data,
         users: data.users.map(user => ({
           ...user,
           faceDescriptor: user.faceDescriptor 
             ? Array.from(user.faceDescriptor)
             : null,
         })),
       };
       localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
     } catch (e) {
       console.error('Error saving attendance data:', e);
     }
   }, [data]);
 
   const currentUser = data.users.find(u => u.id === data.currentUserId) || null;
 
   const registerUser = useCallback((user: Omit<User, 'id' | 'registeredAt'>) => {
     const newUser: User = {
       ...user,
       id: crypto.randomUUID(),
       registeredAt: new Date().toISOString(),
     };
 
     setData(prev => ({
       ...prev,
       users: [...prev.users, newUser],
       currentUserId: newUser.id,
     }));
 
     return newUser;
   }, []);
 
   const updateUserFaceDescriptor = useCallback((userId: string, descriptor: Float32Array) => {
     setData(prev => ({
       ...prev,
       users: prev.users.map(user =>
         user.id === userId
           ? { ...user, faceDescriptor: descriptor }
           : user
       ),
     }));
   }, []);
 
   const setCurrentUser = useCallback((userId: string | null) => {
     setData(prev => ({
       ...prev,
       currentUserId: userId,
     }));
   }, []);
 
   const findUserByFace = useCallback((
     descriptor: Float32Array,
     matchFn: (d1: Float32Array, d2: Float32Array) => number,
     threshold: number = 0.4
   ): User | null => {
     let bestMatch: User | null = null;
     let bestScore = 0;
 
     for (const user of data.users) {
       if (user.faceDescriptor) {
         const score = matchFn(descriptor, user.faceDescriptor);
         if (score > threshold && score > bestScore) {
           bestScore = score;
           bestMatch = user;
         }
       }
     }
 
     return bestMatch;
   }, [data.users]);
 
   const addAttendanceRecord = useCallback((
     record: Omit<AttendanceRecord, 'id'>
   ): AttendanceRecord => {
     const newRecord: AttendanceRecord = {
       ...record,
       id: crypto.randomUUID(),
     };
 
     setData(prev => ({
       ...prev,
       attendance: [...prev.attendance, newRecord],
     }));
 
     return newRecord;
   }, []);
 
   const getUserAttendance = useCallback((userId: string): AttendanceRecord[] => {
     return data.attendance
       .filter(a => a.userId === userId)
       .sort((a, b) => {
         const dateA = new Date(`${a.date}T${a.time}`);
         const dateB = new Date(`${b.date}T${b.time}`);
         return dateB.getTime() - dateA.getTime();
       });
   }, [data.attendance]);
 
   const hasMarkedToday = useCallback((userId: string): boolean => {
     const today = new Date().toISOString().split('T')[0];
     return data.attendance.some(
       a => a.userId === userId && a.date === today && a.status === 'Present'
     );
   }, [data.attendance]);
 
   const getCourse = useCallback((courseId: string): Course | undefined => {
     return data.courses.find(c => c.id === courseId);
   }, [data.courses]);
 
   const exportToCSV = useCallback((userId: string): string => {
     const records = getUserAttendance(userId);
     
     let csv = 'Date,Time,Course,Latitude,Longitude,Method,Confidence,Status\n';
     
     records.forEach(record => {
       const course = getCourse(record.courseId || '');
       const courseName = course ? course.name : 'General';
       
       csv += `"${record.date}","${record.time}","${courseName}",`;
       csv += `${record.lat || ''},${record.lng || ''},"${record.method}",`;
       csv += `${Math.round(record.confidence * 100)}%,"${record.status}"\n`;
     });
     
     return csv;
   }, [getUserAttendance, getCourse]);
 
   return {
     users: data.users,
     courses: data.courses,
     currentUser,
     registerUser,
     updateUserFaceDescriptor,
     setCurrentUser,
     findUserByFace,
     addAttendanceRecord,
     getUserAttendance,
     hasMarkedToday,
     getCourse,
     exportToCSV,
   };
 }