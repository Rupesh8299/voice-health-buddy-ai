import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedVoiceRecorder } from "@/components/EnhancedVoiceRecorder";
import { MultiMediaUpload } from "@/components/MultiMediaUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { sendMessage, uploadImage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Camera,
  MessageCircle,
  Mic,
  Shield,
  Clock,
  Brain,
  Stethoscope,
} from "lucide-react";
import heroImage from "@/assets/health-hero.jpg";
import medicoPeerLogo from "@/assets/logoMedicoicon.png";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image" | "video";
  mediaItems?: Array<{
    id: string;
    type: "image" | "video";
    preview: string;
    file: File;
  }>;
}

interface MediaItem {
  id: string;
  file: File;
  type: "image" | "video";
  preview: string;
  timestamp: Date;
}

export const HealthAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [history, setHistory] = useState([
    {
      role: "system",
      content:
        "You are a helpful and professional medical assistant. Ask only one or two follow-up questions at a time...",
    },
  ]);
  const { toast } = useToast();

  const addMessage = (
    content: string,
    sender: "user" | "assistant",
    type: "text" | "image" | "video" = "text",
    mediaItems?: Array<{
      id: string;
      type: "image" | "video";
      preview: string;
      file: File;
    }>
  ) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type,
      mediaItems,
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    addMessage(content, "user");
    setIsLoading(true);

    // Add user's message to history
    const newHistory = [...history, { role: "user", content }];
    setHistory(newHistory);

    try {
      const response = await sendMessage({
        message: content,
        conversationId,
        //history: newHistory, // Pass full history to backend
      });

      setConversationId(response.conversationId);

      // Add assistant's reply to history
      const updatedHistory = [
        ...newHistory,
        { role: "assistant", content: response.reply },
      ];
      setHistory(updatedHistory);

      addMessage(response.reply, "assistant");

      if (response.suggestions) {
        // You could add suggestions as a separate UI element
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptChange = (transcript: string, isFinal: boolean) => {
    if (isFinal) {
      if (transcript.trim()) {
        handleSendMessage(transcript);
      }
      setPendingTranscript("");
      setCurrentTranscript("");
    } else {
      setPendingTranscript(transcript);
      setCurrentTranscript(transcript);
    }
  };

  const handleConversationModeChange = (isActive: boolean) => {
    setIsConversationMode(isActive);
    if (!isActive) {
      setPendingTranscript("");
      setCurrentTranscript("");
    }
  };

  const handleMediaUpload = async (mediaItems: MediaItem[]) => {
    if (mediaItems.length === 0) return;

    const mediaItemsForMessage = mediaItems.map((item) => ({
      id: item.id,
      type: item.type,
      preview: item.preview,
      file: item.file,
    }));

    const fileNames = mediaItems.map((item) => item.file.name).join(", ");
    const messageContent = `Uploaded ${mediaItems.length} file${
      mediaItems.length > 1 ? "s" : ""
    }: ${fileNames}`;

    addMessage(
      messageContent,
      "user",
      mediaItems.length === 1 ? mediaItems[0].type : "text",
      mediaItemsForMessage
    );
    setIsLoading(true);

    try {
      // Process images
      const imageItems = mediaItems.filter((item) => item.type === "image");
      if (imageItems.length > 0) {
        for (const item of imageItems) {
          const response = await uploadImage(item.file);
          addMessage(response.insights, "assistant");

          if (response.recommendations) {
            const recommendationsText =
              "Recommendations:\n" + response.recommendations.join("\n• ");
            addMessage(recommendationsText, "assistant");
          }
        }
      }

      // Note: Video processing would be implemented similarly
      const videoItems = mediaItems.filter((item) => item.type === "video");
      if (videoItems.length > 0) {
        addMessage(
          `Received ${videoItems.length} video file${
            videoItems.length > 1 ? "s" : ""
          }. Video analysis coming soon.`,
          "assistant"
        );
      }

      toast({
        title: "Media analyzed",
        description: `${mediaItems.length} file${
          mediaItems.length > 1 ? "s" : ""
        } processed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveVideoStart = () => {
    addMessage("Started live video sharing", "user", "video");
    toast({
      title: "Live video started",
      description: "Sharing live video feed with assistant.",
    });
  };

  const handleLiveVideoStop = () => {
    addMessage("Stopped live video sharing", "user", "text");
    toast({
      title: "Live video stopped",
      description: "Video sharing has ended.",
    });
  };

  const handleSpeakingChange = (speaking: boolean) => {
    setIsSpeaking(speaking);
  };

  const features = [
    {
      icon: <Mic className="h-5 w-5" />,
      title: "Real-time Voice",
      description: "Continuous conversation with voice responses",
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Multi-Media Upload",
      description: "Share multiple photos, videos, or live stream",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live AI Consultation",
      description: "Real-time medical guidance with immediate responses",
    },
  ];

  return (
    <div className="min-h-screen bg-health-gradient-subtle">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="MedicoPeer Health Assistant"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <img
                src={medicoPeerLogo}
                alt="MedicoPeer"
                className="h-12 w-12 mr-4 object-contain"
              />
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold bg-health-gradient bg-clip-text text-transparent">
                  MedicoPeer
                </h1>
                <p className="text-lg text-muted-foreground">
                  AI-Powered Health Assistant
                </p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced AI technology for personalized health guidance through
              voice and multimedia interactions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                24/7 Available
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Stethoscope className="h-3 w-3 mr-1" />
                Medical Grade
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input Methods */}
          <div className="lg:col-span-1 space-y-6">
            {/* Voice Input */}
            <Card className="shadow-card hover:shadow-soft transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Real-time Voice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedVoiceRecorder
                  onTranscriptChange={handleTranscriptChange}
                  onConversationModeChange={handleConversationModeChange}
                  disabled={isLoading}
                  isSpeaking={isSpeaking}
                />
                {(currentTranscript || pendingTranscript) && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      {pendingTranscript ? "Listening..." : "Transcript:"}
                    </p>
                    <p className="text-sm">
                      {currentTranscript || pendingTranscript}
                    </p>
                  </div>
                )}
                {isConversationMode && (
                  <div className="mt-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-xs text-accent">
                      🎙️ Conversation mode active - speak naturally, assistant
                      will respond with voice
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Multi-Media Upload */}
            <Card className="shadow-card hover:shadow-soft transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Multi-Media Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MultiMediaUpload
                  onMediaUpload={handleMediaUpload}
                  onLiveVideoStart={handleLiveVideoStart}
                  onLiveVideoStop={handleLiveVideoStop}
                  disabled={isLoading}
                  maxItems={5}
                />
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-card flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-health-info" />
                  Health Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium mb-2">
                        Start Real-time Consultation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enable conversation mode for hands-free interaction, or
                        upload multiple media files to share symptoms.
                      </p>
                      {isConversationMode && (
                        <div className="mt-3 p-2 bg-accent/10 rounded-lg border border-accent/20">
                          <p className="text-xs text-accent">
                            🎙️ Ready to listen and respond
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <ChatInterface
                      messages={messages}
                      isLoading={isLoading}
                      autoSpeak={isConversationMode}
                      onSpeakingChange={handleSpeakingChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Medical Disclaimer:</strong> This AI assistant provides
                general health information only. Always consult qualified
                healthcare professionals for medical advice, diagnosis, or
                treatment. In case of emergency, contact your local emergency
                services immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
