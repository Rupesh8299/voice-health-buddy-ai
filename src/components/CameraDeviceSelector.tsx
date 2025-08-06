import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, SwitchCamera, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CameraDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

interface CameraDeviceSelectorProps {
  onDeviceSelect: (deviceId: string, facingMode?: string) => void;
  selectedDeviceId?: string;
  disabled?: boolean;
}

export const CameraDeviceSelector: React.FC<CameraDeviceSelectorProps> = ({
  onDeviceSelect,
  selectedDeviceId,
  disabled = false,
}) => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getDevices = async () => {
    try {
      setIsLoading(true);
      console.log('🎥 Starting camera device enumeration...');
      
      // Step 1: Request basic camera access first with minimal constraints
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { min: 320, ideal: 640, max: 1920 },
            height: { min: 240, ideal: 480, max: 1080 }
          } 
        });
        console.log('✅ Basic camera access granted');
        setHasPermission(true);
        
        // Clean up the test stream
        stream.getTracks().forEach(track => track.stop());
      } catch (basicError) {
        console.error('❌ Basic camera access failed:', basicError);
        
        // Fallback: Try with minimal constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('✅ Fallback camera access granted');
          setHasPermission(true);
          stream.getTracks().forEach(track => track.stop());
        } catch (fallbackError) {
          console.error('❌ Fallback camera access failed:', fallbackError);
          setHasPermission(false);
          return;
        }
      }
      
      // Step 2: Enumerate devices after successful access
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      console.log('📱 Available devices:', deviceList.length);
      
      const videoDevices = deviceList
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
          kind: device.kind,
        }));

      console.log('🎥 Video devices found:', videoDevices.length);
      setDevices(videoDevices);

      // Step 3: Auto-select a suitable camera
      if (videoDevices.length > 0 && !selectedDeviceId) {
        // Try to find back/environment camera first
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment') ||
          device.label.toLowerCase().includes('rear')
        );
        
        const preferredDevice = backCamera || videoDevices[0];
        console.log('🎯 Auto-selecting camera:', preferredDevice.label);
        onDeviceSelect(preferredDevice.deviceId, backCamera ? 'environment' : 'user');
      }
    } catch (error) {
      console.error('❌ Camera enumeration error:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDevices();
  }, []);

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find(d => d.deviceId === deviceId);
    if (device) {
      // Determine facing mode based on device label
      const facingMode = device.label.toLowerCase().includes('front') || 
                        device.label.toLowerCase().includes('user') ? 
                        'user' : 'environment';
      onDeviceSelect(deviceId, facingMode);
    }
  };

  const switchCamera = () => {
    const currentIndex = devices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    if (devices[nextIndex]) {
      handleDeviceChange(devices[nextIndex].deviceId);
    }
  };

  const getDeviceIcon = (label: string) => {
    if (label.toLowerCase().includes('front') || label.toLowerCase().includes('user')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Camera className="h-4 w-4" />;
  };

  if (!hasPermission) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Camera access required for device selection
          </p>
          <Button onClick={getDevices} disabled={isLoading} size="sm">
            {isLoading ? 'Requesting...' : 'Grant Camera Access'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select value={selectedDeviceId} onValueChange={handleDeviceChange} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select camera..." />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.label)}
                    <span className="truncate">{device.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {devices.length > 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={switchCamera}
            disabled={disabled}
            className="flex-shrink-0"
          >
            <SwitchCamera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {devices.length === 0 && hasPermission && (
        <p className="text-xs text-muted-foreground text-center">
          No cameras detected. Please check your device connections.
        </p>
      )}
    </div>
  );
};