
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/chat/ChatInterface';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto py-6 sm:py-8 flex justify-center items-center">
          <ChatInterface />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
