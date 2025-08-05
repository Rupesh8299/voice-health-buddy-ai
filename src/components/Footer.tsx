import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, FileText, Mail, ExternalLink } from "lucide-react";
import medicoPeerLogo from "@/assets/logoMedicoicon.png";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={medicoPeerLogo}
                alt="MedicoPeer"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h3 className="font-semibold bg-health-gradient bg-clip-text text-transparent">
                  MedicoPeer
                </h3>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Health Assistant
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced AI technology providing personalized health guidance
              through voice and multimedia interactions. Get real-time medical
              insights and symptom analysis.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>for better health outcomes</span>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-medium mb-4">Legal & Privacy</h4>
            <div className="space-y-2">
              <Link to="/disclaimer">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 text-sm"
                >
                  <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                  Medical Disclaimer
                </Button>
              </Link>
              <Link to="/terms">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 text-sm"
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  Terms of Use
                </Button>
              </Link>
            </div>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-2 text-sm"
                onClick={() =>
                  window.open("mailto:support@medicopeer.com", "_blank")
                }
              >
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                Contact Support
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-2 text-sm"
                onClick={() =>
                  window.open("https://help.medicopeer.com", "_blank")
                }
              >
                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                Help Center
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 MedicoPeer. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>🔒 HIPAA Compliant</span>
              <span>•</span>
              <span>🌟 AI-Powered</span>
              <span>•</span>
              <span>⚡ 24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
