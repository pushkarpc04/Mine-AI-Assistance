import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bot, AlertTriangle } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { Message } from "./ChatInterface"; 

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "error";
  const isAssistant = message.role === "assistant";

  const Icon = isUser ? User : isError ? AlertTriangle : Bot;
  
  let avatarBg = "";
  let avatarText = "";
  let cardClasses = "max-w-2xl w-fit shadow-sm ";
  let textAlign = "text-left";
  let bubbleSpecificRounding = "";

  if (isUser) {
    avatarBg = "bg-accent";
    avatarText = "text-accent-foreground";
    cardClasses += "ml-auto bg-primary text-primary-foreground";
    textAlign = "text-right";
    bubbleSpecificRounding = "rounded-br-none";
  } else if (isAssistant) {
    avatarBg = "bg-primary"; // Or choose a different color for assistant avatar
    avatarText = "text-primary-foreground";
    cardClasses += "bg-secondary text-secondary-foreground";
    bubbleSpecificRounding = "rounded-bl-none";
  } else if (isSystem || isError) {
    cardClasses += "mx-auto bg-muted text-muted-foreground";
    textAlign = "text-center";
    if (isError) {
      avatarBg = "bg-destructive";
      avatarText = "text-destructive-foreground";
      cardClasses = "mx-auto bg-destructive/10 text-destructive-foreground border border-destructive/30"; // More distinct error card
    }
  }

  return (
    <div className={`flex gap-3 my-2 ${isUser ? "justify-end" : (isSystem || isError) ? "justify-center" : "justify-start"}`}>
      {!isUser && !isSystem && !isError && (
        <Avatar className="self-end shrink-0">
          <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <Icon size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={`${cardClasses} rounded-xl ${bubbleSpecificRounding}`}>
        <CardContent className={`p-3 sm:p-4 text-sm sm:text-base ${textAlign}`}>
          {isSystem || isError ? (
            <div className="flex items-center gap-2">
              {isError && <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />}
               <p className={`font-medium ${isError ? 'text-destructive': ''}`}>{message.content}</p>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {message.tool === "fact-verification" && message.sources && message.sources.length > 0 && (
            <div className={`mt-2 pt-2 border-t ${isUser ? 'border-primary-foreground/30' : 'border-border/50'}`}>
              <h4 className="font-semibold text-xs mb-1">Sources:</h4>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {message.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      {isUser && (
         <Avatar className="self-end shrink-0">
           <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
