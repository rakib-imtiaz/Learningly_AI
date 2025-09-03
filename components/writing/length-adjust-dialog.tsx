"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShrinkIcon, ExpandIcon } from "lucide-react";

interface LengthAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjustLength: (action: 'shorten' | 'expand', percentage: number) => void;
  currentText: string;
}

const LengthAdjustDialog: React.FC<LengthAdjustDialogProps> = ({
  open,
  onOpenChange,
  onAdjustLength,
  currentText
}) => {
  const [action, setAction] = useState<'shorten' | 'expand'>('shorten');
  const [percentage, setPercentage] = useState<number>(50); // Default to 50%
  
  // Calculate word count of current selection
  const wordCount = currentText ? currentText.split(/\s+/).filter(Boolean).length : 0;
  
  // Calculate target word count based on action and percentage
  const targetWordCount = action === 'shorten' 
    ? Math.ceil(wordCount * (1 - percentage / 100))
    : Math.ceil(wordCount * (1 + percentage / 100));
  
  const handleSubmit = () => {
    onAdjustLength(action, percentage);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Text Length</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={action === 'shorten' ? 'default' : 'outline'}
              className={action === 'shorten' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              onClick={() => setAction('shorten')}
            >
              <ShrinkIcon className="h-4 w-4 mr-2" />
              Shorten Text
            </Button>
            
            <Button
              variant={action === 'expand' ? 'default' : 'outline'}
              className={action === 'expand' ? 'bg-green-500 hover:bg-green-600' : ''}
              onClick={() => setAction('expand')}
            >
              <ExpandIcon className="h-4 w-4 mr-2" />
              Expand Text
            </Button>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="percentage">
              {action === 'shorten' ? 'Shorten' : 'Expand'} by {percentage}%
            </Label>
            <Input
              id="percentage"
              type="range"
              min="10"
              max="90"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10%</span>
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mt-2">
            <p>Current word count: {wordCount} words</p>
            <p>Target word count: ~{targetWordCount} words</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LengthAdjustDialog;
