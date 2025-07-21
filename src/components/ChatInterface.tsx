import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'image';
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading = false
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
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Badge>
                {message.type === 'image' && (
                  <Badge variant="outline" className="text-xs">
                    Image
                  </Badge>
                )}
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