import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextToSpeech } from './TextToSpeech';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'image' | 'video';
  mediaItems?: Array<{
    id: string;
    type: 'image' | 'video';
    preview: string;
    file: File;
  }>;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
  autoSpeak?: boolean;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading = false,
  autoSpeak = false,
  onSpeakingChange
}) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.sender === 'user' ? "justify-end" : "justify-start"
          )}
        >
          {message.sender === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
          
          <Card className={cn(
            "max-w-[80%] transition-all duration-300",
            message.sender === 'user' 
              ? "bg-primary text-primary-foreground" 
              : "bg-card shadow-card hover:shadow-soft"
          )}>
            <CardContent className="p-3">
              {/* Message Content */}
              <div className="flex items-start gap-2">
                <p className="text-sm leading-relaxed flex-1">{message.content}</p>
                {message.sender === 'assistant' && (
                  <TextToSpeech
                    text={message.content}
                    autoPlay={autoSpeak}
                    onSpeakingChange={onSpeakingChange}
                  />
                )}
              </div>
              
              {/* Media Items */}
              {message.mediaItems && message.mediaItems.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {message.mediaItems.map((item) => (
                    <div key={item.id} className="relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.preview}
                          alt="Shared"
                          className="w-full h-20 object-cover rounded border"
                        />
                      ) : (
                        <video
                          src={item.preview}
                          className="w-full h-20 object-cover rounded border"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Badge>
                <div className="flex gap-1">
                  {message.type === 'image' && (
                    <Badge variant="outline" className="text-xs">
                      Image
                    </Badge>
                  )}
                  {message.type === 'video' && (
                    <Badge variant="outline" className="text-xs">
                      Video
                    </Badge>
                  )}
                  {message.mediaItems && message.mediaItems.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {message.mediaItems.length} file{message.mediaItems.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {message.sender === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <Card className="bg-card shadow-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce-gentle" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce-gentle" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};