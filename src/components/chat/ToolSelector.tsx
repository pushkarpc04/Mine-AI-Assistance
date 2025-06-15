'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, CheckCircle, MessageSquareQuote } from "lucide-react";

export type AiTool = "code-generation" | "fact-verification" | "code-explanation";

interface ToolSelectorProps {
  selectedTool: AiTool;
  onToolChange: (tool: AiTool) => void;
}

const tools: { value: AiTool; label: string; icon: React.ElementType }[] = [
  { value: "code-generation", label: "Code Generation", icon: Code },
  { value: "fact-verification", label: "Fact Verification", icon: CheckCircle },
  { value: "code-explanation", label: "Code Explanation", icon: MessageSquareQuote },
];

export default function ToolSelector({ selectedTool, onToolChange }: ToolSelectorProps) {
  return (
    <div className="mb-4">
      <Tabs value={selectedTool} onValueChange={(value) => onToolChange(value as AiTool)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1.5">
          {tools.map((tool) => (
            <TabsTrigger key={tool.value} value={tool.value} className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 data-[state=active]:shadow-lg">
              <tool.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{tool.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
