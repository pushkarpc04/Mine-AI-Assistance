
'use client';

import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, MessageSquareQuote, CheckCircle, Code } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ToolSelector, { type AiTool } from './ToolSelector';
import { useToast } from '@/hooks/use-toast';

import { intelligentCodeGeneration } from '@/ai/flows/intelligent-code-generation';
import { verifyFact } from '@/ai/flows/fact-verification';
import { explainCode } from '@/ai/flows/code-explanation';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  tool?: AiTool;
  sources?: string[];
}

const initialSystemMessage: Message = {
  id: 'initial-system-message',
  role: 'system',
  content: "Hello! I am GPT Mine, your personal AI assistant for coding, learning, and building projects. How can I help you today? Select a tool and type your query. For code generation, I'll try to use the language you specify in your prompt, defaulting to Python 3.11+ if none is mentioned.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([initialSystemMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AiTool>('code-generation');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedTool]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      tool: selectedTool,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let aiResponseContent: string = '';
      let aiResponseSources: string[] | undefined = undefined;

      if (selectedTool === 'code-generation') {
        const result = await intelligentCodeGeneration({ prompt: newUserMessage.content });
        const languageTag = result.language ? result.language.toLowerCase() : 'plaintext';
        aiResponseContent = `\`\`\`${languageTag}\n${result.code}\n\`\`\``;
      } else if (selectedTool === 'fact-verification') {
        const result = await verifyFact({ question: newUserMessage.content });
        aiResponseContent = result.verifiedAnswer;
        aiResponseSources = result.sources;
      } else if (selectedTool === 'code-explanation') {
        const result = await explainCode({ code: newUserMessage.content });
        aiResponseContent = result.explanation;
      }

      const newAiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponseContent,
        tool: selectedTool,
        sources: aiResponseSources,
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);

    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage : Message = {
        id: crypto.randomUUID(),
        role: 'error',
        content: "Sorry, I encountered an error while processing your request. Please try again.",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: (error as Error).message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  const getPlaceholderText = () => {
    switch (selectedTool) {
      case 'code-explanation':
        return "Paste the code you want to understand here...";
      case 'fact-verification':
        return "Ask a technical question to verify...";
      case 'code-generation':
        return "Describe the code you want (e.g., 'Java class for...'). Shift+Enter for new line.";
      default:
        return "Type your message... Shift+Enter for new line.";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto flex-grow my-0 sm:my-0 h-[calc(100vh-var(--header-height)-var(--footer-height)-2rem)] bg-transparent">
      <ToolSelector selectedTool={selectedTool} onToolChange={setSelectedTool} />
      <ScrollArea className="flex-grow mb-4 pr-2 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4 py-4 px-1 sm:px-0">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="bg-background p-3 sm:p-4 border-t sticky bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2 sm:gap-3"
        >
          <Textarea
            ref={textareaRef}
            placeholder={getPlaceholderText()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-grow resize-none text-base rounded-xl px-4 py-3 min-h-[48px] max-h-[150px] shadow-sm focus-visible:ring-primary/70 overflow-y-auto"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon" className="rounded-full w-12 h-12 shadow-sm bg-primary hover:bg-primary/90 self-end shrink-0" aria-label="Send message">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          <Bot size={14} className="inline mr-1 align-text-bottom"/>
          GPT Mine uses AI and may produce inaccurate information.
        </p>
      </div>
    </div>
  );
}
