import React from 'react';
import Header from './Header';
import ProgressBar from '../Shared/ProgressBar';
import { useApp } from '../../contexts/AppContext';

function Layout({ children }) {
  const { state } = useApp();

  return (
    <div className="layout">
      <Header />
      
      {/* Progress bar - mostra solo durante onboarding */}
      {!state.progress.onboardingComplete && (
        <ProgressBar />
      )}
      
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {/* Footer con info legali */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 - Seminario "A Confronto con l'IA" | Avv. [Il tuo nome] | Privacy & GDPR Compliant</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;