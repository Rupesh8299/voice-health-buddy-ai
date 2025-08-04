import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to MedicoPeer
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center text-primary">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                IMPORTANT: MedicoPeer is NOT a substitute for professional medical advice, diagnosis, or treatment.
              </AlertDescription>
            </Alert>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">General Medical Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The information provided by MedicoPeer is for educational and informational purposes only and is not intended as medical advice. 
                You should not use this information to diagnose or treat a health problem or disease without consulting with a qualified healthcare provider.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">AI-Generated Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer uses artificial intelligence to provide health-related information. While we strive for accuracy, AI-generated responses:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>May contain errors or inaccuracies</li>
                <li>Should not replace professional medical consultation</li>
                <li>Are based on general medical knowledge, not your specific medical history</li>
                <li>Cannot account for all possible medical conditions or interactions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Emergency Situations</h2>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>In case of medical emergency, call emergency services immediately (911 in the US) or go to your nearest emergency room.</strong>
                  Do not rely on MedicoPeer for emergency medical situations.
                </AlertDescription>
              </Alert>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Professional Medical Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
                Never disregard professional medical advice or delay in seeking it because of something you have read on MedicoPeer.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Image Analysis Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer's image analysis feature is for educational purposes only. Visual symptoms can be:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Difficult to assess accurately through images alone</li>
                <li>Misleading without proper clinical examination</li>
                <li>Similar in appearance across different conditions</li>
                <li>Requiring additional tests for proper diagnosis</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Medication and Treatment</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer does not prescribe medications or recommend specific treatments. Any mention of medications or treatments 
                is for informational purposes only and should be discussed with your healthcare provider.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Privacy and Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we implement security measures to protect your information, please be mindful that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>No system is completely secure</li>
                <li>Avoid sharing highly sensitive personal health information</li>
                <li>Consider using general terms when describing symptoms</li>
                <li>Be aware that conversations may be stored for service improvement</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer and its developers shall not be liable for any direct, indirect, incidental, consequential, or punitive damages 
                arising from your use of the service. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Geographic Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Medical practices, regulations, and standards vary by country and region. Information provided by MedicoPeer may not be 
                applicable to your specific geographic location or healthcare system.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Updates and Changes</h2>
              <p className="text-muted-foreground leading-relaxed">
                This disclaimer may be updated periodically. Your continued use of MedicoPeer constitutes acceptance of any changes. 
                Please review this disclaimer regularly.
              </p>
            </section>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>By using MedicoPeer, you acknowledge that you have read, understood, and agree to this medical disclaimer.</strong>
              </AlertDescription>
            </Alert>

            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Disclaimer;