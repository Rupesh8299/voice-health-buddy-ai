import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface MediaButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  loading?: boolean;
}

export const MediaButton: React.FC<MediaButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  active = false,
  loading = false
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "media-active" : "media"}
            size="media"
            onClick={onClick}
            disabled={disabled || loading}
            className="relative overflow-hidden"
          >
            <Icon className={`h-6 w-6 ${loading ? 'animate-pulse' : ''}`} />
            {active && (
              <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground border shadow-md">
          <p className="text-sm font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};