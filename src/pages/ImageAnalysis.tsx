// src/pages/ImageAnalysis.tsx
import React, { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ImageAnalysisPage = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error while uploading image");
      }

      const data = await response.json();
      setAnalysis(data.insights || data.analysis || "No analysis available.");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-xl font-semibold text-center">
        Symptom Image Analyzer
      </h1>
      <ImageUpload onImageUpload={handleImageUpload} />

      {loading && (
        <div className="flex justify-center mt-4">
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      )}

      {analysis && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Analysis Result:
            </h2>
            <p className="mt-2 text-sm">{analysis}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageAnalysisPage;
