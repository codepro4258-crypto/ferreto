 import type { ScannerStatus, FaceDetectionResult } from '@/types/attendance';
 import { cn } from '@/lib/utils';
 
 interface ScannerOverlayProps {
   status: ScannerStatus;
   detection: FaceDetectionResult | null;
   isModelLoading?: boolean;
 }
 
 const statusConfig: Record<ScannerStatus, { color: string; label: string; pulse: boolean }> = {
   idle: { color: 'border-muted-foreground', label: 'Ready', pulse: false },
   initializing: { color: 'border-primary', label: 'Loading Models...', pulse: true },
   ready: { color: 'border-primary', label: 'Position Face', pulse: false },
   scanning: { color: 'border-primary', label: 'Scanning...', pulse: true },
   detected: { color: 'border-green-500', label: 'Face Detected', pulse: true },
   verified: { color: 'border-green-500', label: 'Verified!', pulse: false },
   failed: { color: 'border-destructive', label: 'Not Recognized', pulse: false },
   error: { color: 'border-destructive', label: 'Error', pulse: false },
 };
 
 export function ScannerOverlay({ status, detection, isModelLoading }: ScannerOverlayProps) {
   const config = statusConfig[isModelLoading ? 'initializing' : status];
   
   return (
     <div className="absolute inset-0 pointer-events-none">
       {/* Face guide frame */}
       <div className="absolute inset-0 flex items-center justify-center">
         <div
           className={cn(
             'w-48 h-60 rounded-full border-4 transition-all duration-300',
             config.color,
             config.pulse && 'animate-pulse'
           )}
         />
       </div>
 
       {/* Corner brackets */}
       <div className="absolute inset-0 flex items-center justify-center">
         <div className="relative w-56 h-72">
           {/* Top-left */}
           <div className={cn('absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg', config.color)} />
           {/* Top-right */}
           <div className={cn('absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg', config.color)} />
           {/* Bottom-left */}
           <div className={cn('absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg', config.color)} />
           {/* Bottom-right */}
           <div className={cn('absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg', config.color)} />
         </div>
       </div>
 
       {/* Status HUD */}
       <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
         <div className={cn(
           'px-4 py-2 rounded-full font-mono text-sm backdrop-blur-sm',
           'bg-background/80 border',
           config.color.replace('border-', 'text-')
         )}>
           STATUS: {config.label.toUpperCase()}
         </div>
         
         {detection?.detected && detection.confidence > 0 && (
           <div className="px-3 py-1 rounded-full bg-background/80 border text-xs font-mono">
             Confidence: {Math.round(detection.confidence * 100)}%
           </div>
         )}
       </div>
 
       {/* Scanning animation lines */}
       {(status === 'scanning' || status === 'detected') && (
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
         </div>
       )}
     </div>
   );
 }