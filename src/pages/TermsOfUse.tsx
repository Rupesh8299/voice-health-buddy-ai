import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfUse = () => {
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
            <CardTitle className="text-3xl text-center text-primary">Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using MedicoPeer, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer is an AI-powered health information platform that provides educational content about medical topics, 
                symptom analysis, and general health guidance. The service includes text-based conversations, voice interactions, 
                and image analysis capabilities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">3. User Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to use MedicoPeer. If you are under 18, you may only use this service with 
                the involvement and consent of a parent or guardian.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">4. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate information when creating your account</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to circumvent security measures</li>
                <li>Not share false or misleading health information</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not use the service to provide medical advice to others</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">5. Privacy and Data Collection</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect and process personal information as described in our Privacy Policy. By using MedicoPeer, you consent to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Collection of account information and conversation data</li>
                <li>Analysis of interactions to improve our AI models</li>
                <li>Storage of uploaded images for processing purposes</li>
                <li>Use of cookies and similar technologies</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">6. Medical Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer is not a medical service and does not provide medical advice, diagnosis, or treatment. 
                All information provided is for educational purposes only. Please refer to our detailed 
                <Link to="/disclaimer" className="text-primary hover:underline mx-1">Medical Disclaimer</Link>
                for complete terms regarding medical information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The MedicoPeer platform, including but not limited to software, design, text, graphics, and AI models, 
                is owned by MedicoPeer and protected by intellectual property laws. You may not copy, modify, or distribute 
                any part of the service without explicit permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">8. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain service availability but do not guarantee uninterrupted access. The service may be 
                temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify 
                or discontinue features at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">9. User-Generated Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                By submitting content (text, images, voice recordings) to MedicoPeer, you grant us a license to use, 
                process, and analyze this content for the purpose of providing our services and improving our AI models. 
                You retain ownership of your content but are responsible for ensuring you have the right to share it.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">10. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed">You may not use MedicoPeer to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide medical advice or practice medicine</li>
                <li>Share illegal, harmful, or offensive content</li>
                <li>Attempt to reverse engineer our AI models</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate healthcare professionals</li>
                <li>Share content that violates others' privacy</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">11. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                MedicoPeer and its operators shall not be liable for any direct, indirect, incidental, special, or 
                consequential damages resulting from your use of the service. This includes but is not limited to 
                damages for loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">12. Account Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these terms 
                or for any other reason deemed necessary for the protection of our service or other users.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">13. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. Users will be notified of significant changes via email 
                or through the service. Continued use of MedicoPeer after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">14. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws. Any disputes 
                arising from these terms or your use of MedicoPeer shall be resolved through binding arbitration.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">15. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Use, please contact us through the support channels 
                available within the MedicoPeer application.
              </p>
            </section>

            <div className="text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                By using MedicoPeer, you acknowledge that you have read, understood, and agree to these Terms of Use.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfUse;