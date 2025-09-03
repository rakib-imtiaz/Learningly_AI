"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIStatusIndicatorProps {
  isProcessing: boolean;
  lastProcessedFeature?: string;
  model: string;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  isProcessing,
  lastProcessedFeature,
  model = "Gemini 2.5 Flash"
}) => {
  return (
    <div className="flex items-center text-xs">
      {isProcessing ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin mr-1.5 text-primary" />
          <span className="text-primary">
            Processing with {model}...
          </span>
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
          <span className="text-gray-500">
            {lastProcessedFeature 
              ? `Last used: ${lastProcessedFeature}` 
              : `AI Ready • ${model}`}
          </span>
        </>
      )}
    </div>
  );
};

export default AIStatusIndicator;
