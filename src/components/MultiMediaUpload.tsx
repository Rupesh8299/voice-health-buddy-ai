import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaButton } from "@/components/MediaButton";
import { CameraDeviceSelector } from "@/components/CameraDeviceSelector";
import { Camera, Upload, X, Video, Image, Play, Pause, FolderOpen, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  file: File;
  type: "image" | "video";
  preview: string;
  timestamp: Date;
}

interface MultiMediaUploadProps {
  onMediaUpload: (files: MediaItem[]) => void;
  onLiveVideoStart?: () => void;
  onLiveVideoStop?: () => void;
  disabled?: boolean;
  maxItems?: number;
}

export const MultiMediaUpload: React.FC<MultiMediaUploadProps> = ({
  onMediaUpload,
  onLiveVideoStart,
  onLiveVideoStop,
  disabled = false,
  maxItems = 10,
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isLiveVideo, setIsLiveVideo] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [cameraFacingMode, setCameraFacingMode] = useState<string>("environment");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const createMediaItem = (file: File): Promise<MediaItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaItem: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          type: file.type.startsWith("image/") ? "image" : "video",
          preview: e.target?.result as string,
          timestamp: new Date(),
        };
        resolve(mediaItem);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: FileList) => {
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (mediaItems.length + validFiles.length > maxItems) {
      alert(`Maximum ${maxItems} items allowed`);
      return;
    }

    const newMediaItems = await Promise.all(
      validFiles.map((file) => createMediaItem(file))
    );

    const updatedItems = [...mediaItems, ...newMediaItems];
    setMediaItems(updatedItems);
    onMediaUpload(updatedItems);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeMediaItem = (id: string) => {
    const updatedItems = mediaItems.filter((item) => item.id !== id);
    setMediaItems(updatedItems);
    onMediaUpload(updatedItems);
  };

  const startLiveVideo = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedCameraId 
          ? {
              deviceId: { exact: selectedCameraId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : {
              facingMode: cameraFacingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play();
      }

      setIsLiveVideo(true);
      onLiveVideoStart?.();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions and try selecting a different camera.");
    }
  };

  const stopLiveVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }

    setIsLiveVideo(false);
    onLiveVideoStop?.();
  };

  const clearAllMedia = () => {
    setMediaItems([]);
    onMediaUpload([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleCameraDeviceSelect = (deviceId: string, facingMode?: string) => {
    setSelectedCameraId(deviceId);
    if (facingMode) {
      setCameraFacingMode(facingMode);
    }
    
    // If currently live, restart with new device
    if (isLiveVideo) {
      stopLiveVideo();
      setTimeout(() => startLiveVideo(), 100);
    }
  };

  return (
    <div className="space-y-4">
      {/* Camera Device Selector */}
      <CameraDeviceSelector
        onDeviceSelect={handleCameraDeviceSelect}
        selectedDeviceId={selectedCameraId}
        disabled={disabled}
      />

      {/* Live Video Stream */}
      {isLiveVideo && (
        <Card className="border-accent">
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={liveVideoRef}
                className="w-full h-64 rounded-lg bg-black object-cover"
                autoPlay
                muted
                playsInline
                style={{ minHeight: "256px" }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                  LIVE
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={stopLiveVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Live video feed - Share what you're experiencing in real-time
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card
        className={cn(
          "transition-all duration-300",
          dragOver && "border-primary shadow-glow",
          mediaItems.length > 0 && "border-accent"
        )}
      >
        <CardContent className="p-6">
          {mediaItems.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Uploaded Media ({mediaItems.length}/{maxItems})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllMedia}
                  disabled={disabled}
                >
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mediaItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="Uploaded"
                        className="w-full h-24 object-cover rounded-lg shadow-card"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-24 object-cover rounded-lg shadow-card"
                        controls
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMediaItem(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1">
                      <div className="px-1 py-0.5 bg-black/70 text-white text-xs rounded">
                        {item.type === "image" ? (
                          <Image className="h-3 w-3" />
                        ) : (
                          <Video className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Upload photos or videos of your symptoms
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag and drop multiple files, use camera, or browse
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Control Buttons - Material Design Style */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <MediaButton
              icon={Camera}
              label="Take Photo"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled || mediaItems.length >= maxItems}
            />

            <MediaButton
              icon={VideoIcon}
              label="Record Video"
              onClick={() => videoInputRef.current?.click()}
              disabled={disabled || mediaItems.length >= maxItems}
            />

            <MediaButton
              icon={isLiveVideo ? Pause : Play}
              label={isLiveVideo ? "Stop Live Stream" : "Start Live Stream"}
              onClick={isLiveVideo ? stopLiveVideo : startLiveVideo}
              disabled={disabled}
              active={isLiveVideo}
              loading={isLiveVideo && !liveVideoRef.current?.srcObject}
            />

            <MediaButton
              icon={FolderOpen}
              label="Browse Files"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || mediaItems.length >= maxItems}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};
