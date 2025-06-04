import React from 'react';
import { useApp } from '../../contexts/AppContext';

function ModuleOverview() {
  const { state, dispatch } = useApp();

  // Dati moduli dal PROJECT_RESUME
  const modules = [
    {
      id: 1,
      title: "Dall'Euforia alla Strategia",
      subtitle: "L'Evoluzione dell'IA nell'Amministrazione Condominiale", 
      duration: 75,
      icon: "🚀"
    },
    {
      id: 2,
      title: "L'Amministratore Aumentato",
      subtitle: "Nuove Competenze e Prompt Engineering Avanzato",
      duration: 90,
      icon: "🧠"
    },
    {
      id: 3,
      title: "Navigare il Labirinto dell'IA",
      subtitle: "Etica, Normativa e Gestione Responsabile",
      duration: 75,
      icon: "⚖️"
    },
    {
      id: 4,
      title: "Implementare l'IA con Saggezza",
      subtitle: "Gestione del Cambiamento e Visione Futura",
      duration: 60,
      icon: "🎯"
    }
  ];

  // ===== VISTA FACILITATORE =====
  if (state.facilitatorMode) {
    return (
      <div className="facilitator-dashboard">
        <div className="container">
          <h2>🎛️ Dashboard Facilitatore</h2>
          
          <div className="session-controls">
            <div className="session-status">
              Sessione: {state.sessionActive ? '🟢 Attiva' : '🔴 Non attiva'}
            </div>
            
            <div className="module-control">
              <label>Modulo Corrente:</label>
              <select 
                value={state.currentModule} 
                onChange={(e) => dispatch({ 
                  type: 'SET_CURRENT_MODULE', 
                  payload: parseInt(e.target.value) 
                })}
              >
                <option value={0}>Nessun modulo</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.icon} Modulo {module.id}: {module.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="session-buttons">
              <button 
                onClick={() => dispatch({ type: 'START_SESSION' })}
                disabled={state.sessionActive}
                className="btn-primary"
              >
                ▶️ Avvia Sessione
              </button>
              <button 
                onClick={() => dispatch({ type: 'END_SESSION' })}
                disabled={!state.sessionActive}
                className="btn-secondary"
              >
                ⏹️ Termina Sessione
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== VISTA PARTECIPANTI - ATTESA =====
  if (!state.sessionActive) {
    return (
      <div className="waiting-screen">
        <div className="container">
          <div className="waiting-content">
            <h2>⏳ In Attesa dell'Inizio</h2>
            <p>Il seminario inizierà a breve. Rimani in attesa che il facilitatore avvii la sessione.</p>
            
            <div className="modules-preview">
              <h3>Oggi affronteremo:</h3>
              <div className="modules-grid">
                {modules.map(module => (
                  <div key={module.id} className="module-preview-card">
                    <div className="module-icon">{module.icon}</div>
                    <h4>Modulo {module.id}</h4>
                    <h5>{module.title}</h5>
                    <p>{module.subtitle}</p>
                    <span className="duration">⏱️ {module.duration} minuti</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== VISTA PARTECIPANTI - SESSIONE ATTIVA =====
  return (
    <div className="module-overview">
      <div className="container">
        <div className="session-header">
          <div className="session-info">
            <span className="live-badge">🔴 LIVE</span>
            <h2>Seminario in Corso</h2>
          </div>
          
          {state.currentModule > 0 && (
            <div className="current-module">
              <span className="current-label">Modulo Attuale:</span>
              <div className="module-indicator">
                {modules.find(m => m.id === state.currentModule)?.icon} 
                Modulo {state.currentModule}
              </div>
            </div>
          )}
        </div>

        <div className="modules-grid">
          {modules.map(module => (
            <div 
              key={module.id} 
              className={`module-card ${module.id === state.currentModule ? 'active' : ''} ${module.id < state.currentModule ? 'completed' : ''}`}
            >
              <div className="module-header">
                <span className="module-icon">{module.icon}</span>
                <div className="module-info">
                  <h3>Modulo {module.id}</h3>
                  <h4>{module.title}</h4>
                </div>
                <div className="module-status">
                  {module.id === state.currentModule && '▶️'}
                  {module.id < state.currentModule && '✅'}
                  {module.id > state.currentModule && '⏳'}
                </div>
              </div>
              <div className="module-content">
                <p>{module.subtitle}</p>
                <div className="module-meta">
                  <span className="duration">⏱️ {module.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModuleOverview;