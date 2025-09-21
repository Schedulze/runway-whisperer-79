import { useState } from 'react';
import CFODashboard from '@/components/CFODashboard';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <CFODashboard />
      ) : (
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
};

export default Index;
