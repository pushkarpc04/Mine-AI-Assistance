'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
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
  content: "Hello! I am GPT Mine, your personal AI assistant for coding, learning, and building projects. How can I help you today? Select a tool and type your query. I specialize in Python 3.11+ by default.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([initialSystemMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AiTool>('code-generation');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
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
        const result = await intelligentCodeGeneration({ prompt: newUserMessage.content, language: 'Python' });
        aiResponseContent = `\`\`\`python\n${result.code}\n\`\`\``;
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
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto flex-grow my-4 sm:my-6">
      <ToolSelector selectedTool={selectedTool} onToolChange={setSelectedTool} />
      <ScrollArea className="flex-grow mb-4 p-4 sm:p-6 pr-2" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <div className="bg-card p-3 sm:p-4 border-t rounded-lg shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              selectedTool === 'code-explanation' 
              ? "Paste code here to explain..." 
              : selectedTool === 'fact-verification' 
              ? "Ask a question to verify..."
              : "Describe the code you want to generate..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow text-base"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon" aria-label="Send message">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          GPT Mine uses AI and may produce inaccurate information. Default language for code generation is Python 3.11+.
        </p>
      </div>
    </div>
  );
}
