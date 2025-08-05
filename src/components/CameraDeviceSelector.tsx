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
      
      // Request camera permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up
      setHasPermission(true);
      
      // Now get the actual device list
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
          kind: device.kind,
        }));

      setDevices(videoDevices);

      // Auto-select a suitable camera
      if (videoDevices.length > 0 && !selectedDeviceId) {
        // Prefer environment/back camera if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment') ||
          device.label.toLowerCase().includes('rear')
        );
        const preferredDevice = backCamera || videoDevices[0];
        onDeviceSelect(preferredDevice.deviceId, 'environment');
      }
    } catch (error) {
      console.error('Error accessing cameras:', error);
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