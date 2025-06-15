import { Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Cpu className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-2xl font-headline font-semibold text-primary">
          GPT Mine
        </h1>
      </div>
    </header>
  );
}
