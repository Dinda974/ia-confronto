import React from 'react';
import { useApp } from '../../contexts/AppContext';

function Header() {
  const { state, dispatch } = useApp();

  const toggleFacilitatorMode = () => {
    dispatch({ type: 'TOGGLE_FACILITATOR_MODE' });
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            {/* Qui metteremo i tuoi loghi */}
            <div className="logo-placeholder">
              <span className="logo-text">IA</span>
            </div>
            <h1 className="header-title">A Confronto con l'Intelligenza Artificiale</h1>
            <p className="header-subtitle">Strategie Avanzate per Amministratori di Condominio</p>
          </div>
          
          {/* Facilitator mode toggle - nascosto durante onboarding */}
          {state.progress.onboardingComplete && (
            <button 
              onClick={toggleFacilitatorMode}
              className={`facilitator-toggle ${state.facilitatorMode ? 'active' : ''}`}
            >
              {state.facilitatorMode ? '👥 Modalità Partecipante' : '🎯 Modalità Facilitatore'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;