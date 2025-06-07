import React, { useEffect } from 'react';
import PollParticipant from './PollParticipant';
import { useApp } from '../../contexts/AppContext';
import ModuleContent from './ModuleContent';

function ModuleOverview() {
  const { state, dispatch } = useApp();

  // Bypass onboarding per facilitatori
  React.useEffect(() => {
    if (state.facilitatorMode && state.currentStep !== 'modules' && !state.progress.onboardingComplete) {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
    }
  }, [state.facilitatorMode, state.currentStep, state.progress.onboardingComplete, dispatch]);

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

  // Funzioni per gestire i poll (solo facilitatore)
  const startPoll = (question, type = 'yesno') => {
    dispatch({
      type: 'START_POLL',
      payload: {
        question,
        type,
        timestamp: new Date().toISOString()
      }
    });
  };

  const endPoll = () => {
    dispatch({ type: 'END_POLL' });
  };

  // Poll predefiniti per il seminario
  const quickPolls = [
    "Avete mai usato ChatGPT per lavoro?",
    "Vi sentite pronti ad adottare l'IA nel vostro studio?",
    "Pensate che l'IA migliorerà il vostro lavoro?",
    "Avete preoccupazioni sulla privacy dei dati con l'IA?",
    "Implementerete almeno uno strumento IA nei prossimi 3 mesi?"
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

            <div className="module-navigation">
              <button 
                onClick={() => dispatch({ 
                  type: 'SET_CURRENT_MODULE', 
                  payload: Math.max(0, state.currentModule - 1) 
                })}
                disabled={state.currentModule <= 1}
                className="btn-secondary"
              >
                ⬅️ Modulo Precedente
              </button>
              <button 
                onClick={() => dispatch({ 
                  type: 'SET_CURRENT_MODULE', 
                  payload: Math.min(4, state.currentModule + 1) 
                })}
                disabled={state.currentModule >= 4}
                className="btn-secondary"
              >
                Modulo Successivo ➡️
              </button>
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

            {/* CONTROLLI POLLING */}
            <div className="poll-controls">
              <h3>📊 Controlli Polling</h3>
              
              {state.activePoll ? (
                <div className="active-poll-control">
                  <div className="poll-info">
                    <strong>Poll Attivo:</strong> {state.activePoll.question}
                  </div>
                  <div className="poll-results-live">
                    <span>✅ Sì: {state.pollResults.yes || 0}</span>
                    <span>❌ No: {state.pollResults.no || 0}</span>
                    <span>📊 Totale: {(state.pollResults.yes || 0) + (state.pollResults.no || 0)}</span>
                  </div>
                  <button onClick={endPoll} className="btn-secondary">
                    🛑 Termina Poll
                  </button>
                </div>
              ) : (
                <div className="poll-start-controls">
                  <div className="quick-polls">
                    <h4>Poll Rapidi:</h4>
                    {quickPolls.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => startPoll(question)}
                        className="btn-poll-quick"
                        disabled={!state.sessionActive}
                      >
                        📋 {question}
                      </button>
                    ))}
                  </div>
                  <div className="custom-poll">
                    <h4>Poll Personalizzato:</h4>
                    <input
                      type="text"
                      placeholder="Scrivi la tua domanda..."
                      id="customPollInput"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          startPoll(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      disabled={!state.sessionActive}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('customPollInput');
                        if (input.value.trim()) {
                          startPoll(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="btn-primary"
                      disabled={!state.sessionActive}
                    >
                      🚀 Lancia Poll
                    </button>
                  </div>
                </div>
              )}
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

       {state.currentModule > 0 ? (
          <ModuleContent />
        ) : (
          <div className="modules-grid">
            {modules.map(module => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <span className="module-icon">{module.icon}</span>
                  <div className="module-info">
                    <h3>Modulo {module.id}</h3>
                    <h4>{module.title}</h4>
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
        )}
      </div>

      {/* POLLING OVERLAY PER PARTECIPANTI */}
      <PollParticipant />
    </div>
  );
}

export default ModuleOverview;