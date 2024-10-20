import React from 'react';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  user: {
    user: {
      firstName: string;
      profileUrl: string;
    };
  };
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar user={user} />
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer can be added here if needed */}
    </div>
  );
};

export default Layout;