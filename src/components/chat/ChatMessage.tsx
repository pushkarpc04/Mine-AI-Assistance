
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bot, AlertTriangle, Copy, Check } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { Message } from "./ChatInterface"; 
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "error";
  const isAssistant = message.role === "assistant";

  const Icon = isUser ? User : isError ? AlertTriangle : Bot;
  
  let avatarBg = "";
  let avatarText = "";
  let cardClasses = "max-w-2xl w-fit shadow-md transition-all duration-200 ease-out "; // Softer shadow
  let textAlign = "text-left";
  let bubbleSpecificRounding = "rounded-2xl"; // More rounded

  if (isUser) {
    avatarBg = "bg-primary"; 
    avatarText = "text-primary-foreground";
    cardClasses += "ml-auto bg-primary text-primary-foreground rounded-br-lg"; 
    textAlign = "text-right";
  } else if (isAssistant) {
    avatarBg = "bg-accent"; 
    avatarText = "text-accent-foreground";
    cardClasses += "bg-card text-card-foreground border border-border/50 rounded-bl-lg"; 
  } else if (isSystem || isError) {
    cardClasses += "mx-auto bg-muted/50 text-muted-foreground border-none shadow-none text-xs p-2";
    textAlign = "text-center";
     bubbleSpecificRounding = "rounded-lg";
    if (isError) {
      avatarBg = "bg-destructive";
      avatarText = "text-destructive-foreground";
      cardClasses = "mx-auto bg-destructive/10 text-destructive-foreground border border-destructive/30 shadow-sm";
    }
  }

  const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)\n```/;
  const codeMatch = message.content.match(codeBlockRegex);
  const rawCode = codeMatch ? codeMatch[1] : null;

  const handleCopyCode = async () => {
    if (!rawCode) return;
    try {
      await navigator.clipboard.writeText(rawCode);
      setIsCopied(true);
      toast({ title: "Copied to clipboard!", description: "The code has been copied." });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy code to clipboard." });
    }
  };

  return (
    <div className={`flex gap-2 my-2 ${isUser ? "justify-end" : (isSystem || isError) ? "justify-center" : "justify-start"}`}>
      {!isUser && !isSystem && !isError && (
        <Avatar className="self-end shrink-0 h-8 w-8">
          <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <Icon size={18} />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`relative group ${cardClasses} ${bubbleSpecificRounding}`}>
        <CardContent className={`p-3 sm:p-4 text-sm sm:text-base ${textAlign} leading-relaxed`}>
          {isSystem || isError ? (
            <div className="flex items-center gap-2">
              {isError && <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />}
               <p className={`font-medium ${isError ? 'text-destructive': ''}`}>{message.content}</p>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {message.tool === "fact-verification" && message.sources && message.sources.length > 0 && (
            <div className={`mt-2 pt-2 border-t ${isUser ? 'border-primary-foreground/20' : 'border-border/30'}`}>
              <h4 className="font-semibold text-xs mb-1">Sources:</h4>
              <ul className="list-disc list-inside text-xs space-y-0.5 opacity-80">
                {message.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        {isAssistant && rawCode && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-card/50 hover:bg-card z-10"
            onClick={handleCopyCode}
            aria-label="Copy code"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
          </Button>
        )}
      </div>

      {isUser && (
         <Avatar className="self-end shrink-0 h-8 w-8">
           <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
