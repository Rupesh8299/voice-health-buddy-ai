import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { sendMessage, uploadImage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Activity, Camera, MessageCircle, Mic, Shield, Clock } from 'lucide-react';
import heroImage from '@/assets/health-hero.jpg';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'image';
}

export const HealthAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const { toast } = useToast();

  const addMessage = (content: string, sender: 'user' | 'assistant', type: 'text' | 'image' = 'text') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    addMessage(content, 'user');
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message: content,
        conversationId
      });

      setConversationId(response.conversationId);
      addMessage(response.reply, 'assistant');

      if (response.suggestions) {
        // You could add suggestions as a separate UI element
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptChange = (transcript: string) => {
    setCurrentTranscript(transcript);
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
    if (!recording && currentTranscript.trim()) {
      handleSendMessage(currentTranscript);
      setCurrentTranscript('');
    }
  };

  const handleImageUpload = async (file: File) => {
    addMessage(`Uploaded image: ${file.name}`, 'user', 'image');
    setIsLoading(true);

    try {
      const response = await uploadImage(file);
      addMessage(response.insights, 'assistant');
      
      if (response.recommendations) {
        const recommendationsText = "Recommendations:\n" + response.recommendations.join('\n• ');
        addMessage(recommendationsText, 'assistant');
      }

      toast({
        title: "Image analyzed",
        description: "Your image has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Mic className="h-5 w-5" />,
      title: "Voice Input",
      description: "Describe your symptoms naturally"
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Visual Analysis",
      description: "Upload photos of visible symptoms"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "AI Consultation",
      description: "Get immediate medical guidance"
    }
  ];

  return (
    <div className="min-h-screen bg-health-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Health Assistant" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Activity className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold bg-health-gradient bg-clip-text text-transparent">
                Voice-Based Health Assistant
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Describe your symptoms or show visible ones for medical guidance
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
                  Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceRecorder
                  onTranscriptChange={handleTranscriptChange}
                  onRecordingStateChange={handleRecordingStateChange}
                  disabled={isLoading}
                />
                {currentTranscript && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Current transcript:</p>
                    <p className="text-sm">{currentTranscript}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="shadow-card hover:shadow-soft transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Visual Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  disabled={isLoading}
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
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
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
                      <h3 className="font-medium mb-2">Start Your Consultation</h3>
                      <p className="text-sm text-muted-foreground">
                        Use the voice recorder or upload an image to begin describing your symptoms.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <ChatInterface messages={messages} isLoading={isLoading} />
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
                <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only. 
                Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment. 
                In case of emergency, contact your local emergency services immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};