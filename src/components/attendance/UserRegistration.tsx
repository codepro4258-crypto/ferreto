 import { useState } from 'react';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import type { Course, User } from '@/types/attendance';
 import { UserPlus, Camera, CheckCircle } from 'lucide-react';
 
 interface UserRegistrationProps {
   courses: Course[];
   onRegister: (user: Omit<User, 'id' | 'registeredAt'>) => User;
   onStartFaceCapture: () => void;
   faceDescriptor: Float32Array | null;
   isCapturing: boolean;
 }
 
 export function UserRegistration({
   courses,
   onRegister,
   onStartFaceCapture,
   faceDescriptor,
   isCapturing,
 }: UserRegistrationProps) {
   const [formData, setFormData] = useState({
     username: '',
     fullName: '',
     email: '',
     courseId: '',
   });
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const validate = (): boolean => {
     const newErrors: Record<string, string> = {};
     
     if (!formData.username.trim()) {
       newErrors.username = 'Username is required';
     }
     if (!formData.fullName.trim()) {
       newErrors.fullName = 'Full name is required';
     }
     if (!formData.email.trim()) {
       newErrors.email = 'Email is required';
     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
       newErrors.email = 'Invalid email format';
     }
     if (!faceDescriptor) {
       newErrors.face = 'Face registration is required';
     }
     
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!validate()) return;
 
     onRegister({
       username: formData.username.trim(),
       fullName: formData.fullName.trim(),
       email: formData.email.trim(),
       courseId: formData.courseId || undefined,
       faceDescriptor,
     });
   };
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <UserPlus className="w-5 h-5" />
           Register for Attendance
         </CardTitle>
         <CardDescription>
           Create your profile and register your face for biometric attendance
         </CardDescription>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid gap-4 sm:grid-cols-2">
             <div className="space-y-2">
               <Label htmlFor="username">Username</Label>
               <Input
                 id="username"
                 placeholder="johndoe"
                 value={formData.username}
                 onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
               />
               {errors.username && (
                 <p className="text-sm text-destructive">{errors.username}</p>
               )}
             </div>
             
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name</Label>
               <Input
                 id="fullName"
                 placeholder="John Doe"
                 value={formData.fullName}
                 onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
               />
               {errors.fullName && (
                 <p className="text-sm text-destructive">{errors.fullName}</p>
               )}
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               type="email"
               placeholder="john@example.com"
               value={formData.email}
               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
             />
             {errors.email && (
               <p className="text-sm text-destructive">{errors.email}</p>
             )}
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="course">Course (Optional)</Label>
             <Select
               value={formData.courseId}
               onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select a course" />
               </SelectTrigger>
               <SelectContent>
                 {courses.map((course) => (
                   <SelectItem key={course.id} value={course.id}>
                     {course.code} - {course.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <Label>Face Registration</Label>
             <div className="flex items-center gap-4">
               <Button
                 type="button"
                 variant={faceDescriptor ? 'secondary' : 'outline'}
                 onClick={onStartFaceCapture}
                 disabled={isCapturing}
               >
                 {faceDescriptor ? (
                   <>
                     <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                     Face Registered
                   </>
                 ) : (
                   <>
                     <Camera className="w-4 h-4 mr-2" />
                     {isCapturing ? 'Capturing...' : 'Capture Face'}
                   </>
                 )}
               </Button>
               {errors.face && (
                 <p className="text-sm text-destructive">{errors.face}</p>
               )}
             </div>
           </div>
 
           <Button type="submit" className="w-full">
             <UserPlus className="w-4 h-4 mr-2" />
             Complete Registration
           </Button>
         </form>
       </CardContent>
     </Card>
   );
 }