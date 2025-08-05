import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, FileText, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import medicoPeerLogo from '@/assets/medicopeer-logo.png';

export const NavigationHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img 
            src={medicoPeerLogo} 
            alt="MedicoPeer" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold bg-health-gradient bg-clip-text text-transparent">
              MedicoPeer
            </h1>
            <p className="text-xs text-muted-foreground">
              AI Health Assistant
            </p>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Legal Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/disclaimer">
              <Button variant="ghost" size="sm" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Disclaimer
              </Button>
            </Link>
            <Link to="/terms">
              <Button variant="ghost" size="sm" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Terms
              </Button>
            </Link>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Signed in
                </p>
              </div>
              <DropdownMenuSeparator />
              
              {/* Mobile Legal Links */}
              <div className="md:hidden">
                <Link to="/disclaimer">
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Medical Disclaimer
                  </DropdownMenuItem>
                </Link>
                <Link to="/terms">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms of Use
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};