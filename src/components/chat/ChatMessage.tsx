import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Bot, AlertTriangle } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { Message } from "./ChatInterface"; // Assuming Message type is exported from ChatInterface

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "error";

  const Icon = isUser ? User : isError ? AlertTriangle : Bot;
  const avatarBg = isUser ? "bg-accent" : isError ? "bg-destructive" : "bg-primary";
  const avatarText = isUser ? "text-accent-foreground" : isError ? "text-destructive-foreground" : "text-primary-foreground";
  const cardClasses = `max-w-2xl w-fit ${isUser ? "ml-auto bg-primary text-primary-foreground" : isSystem || isError ? "mx-auto bg-secondary text-secondary-foreground" : "bg-card text-card-foreground"}`;
  const textAlign = isSystem || isError ? "text-center" : isUser ? "text-right" : "text-left";

  return (
    <div className={`flex gap-3 my-4 ${isUser ? "justify-end" : isSystem || isError ? "justify-center" : "justify-start"}`}>
      {!isUser && !isSystem && !isError && (
        <Avatar className="self-end">
          <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <Icon size={24} />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={`${cardClasses} rounded-xl shadow-md`}>
        <CardContent className={`p-3 sm:p-4 text-sm sm:text-base ${textAlign}`}>
          {isSystem || isError ? (
            <div className="flex items-center gap-2">
              {isError && <AlertTriangle className="text-destructive h-5 w-5" />}
               <p className={`font-medium ${isError ? 'text-destructive': ''}`}>{message.content}</p>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {message.tool === "fact-verification" && message.sources && message.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50">
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
         <Avatar className="self-end">
           <AvatarFallback className={`${avatarBg} ${avatarText}`}>
            <User size={24} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
