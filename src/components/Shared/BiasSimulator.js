import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const BiasSimulator = () => {
  const { state, dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  // Se il workshop non è attivo o è stato forzatamente chiuso
  if (!isVisible || state.activeWorkshop !== 'bias-simulator') {
    return null;
  }

  const biasData = state.workshopData.biasSimulator || {
    step: 1,
    selectedScenario: null,
    userInput: '',
    simulationResults: null,
    biasDetected: [],
    checklistCompleted: false
  };

  const closeWorkshop = () => {
    console.log('🔴 Closing workshop with force...');
    
    // Prima nasconde il componente immediatamente
    setIsVisible(false);
    
    // Poi pulisce lo state
    dispatch({ type: 'CLOSE_WORKSHOP' });
    dispatch({ type: 'RESET_WORKSHOP_DATA', payload: 'biasSimulator' });
    
    console.log('✅ Workshop closed');
  };

  const updateBiasData = (data) => {
    dispatch({
      type: 'UPDATE_WORKSHOP_DATA',
      payload: {
        workshop: 'biasSimulator',
        data
      }
    });
  };

  // STEP 1: Selezione Scenario
  const selectScenario = (scenarioId) => {
    updateBiasData({
      step: 2,
      selectedScenario: scenarioId,
      userInput: '',
      simulationResults: null,
      biasDetected: []
    });
  };

  // STEP 2: Input personalizzato
  const handleInputChange = (value) => {
    updateBiasData({ ...biasData, userInput: value });
  };

  const proceedToSimulation = () => {
    const newData = { ...biasData, step: 3 };
    updateBiasData(newData);
    // Simula elaborazione con delay
    setTimeout(() => {
      runBiasSimulation(newData);  // ← Passa i dati aggiornati
    }, 2000);
  };

  // STEP 3: Simulazione bias
  const runBiasSimulation = (currentData = biasData) => {  // ← Usa i dati passati
    const scenario = scenarios.find(s => s.id === currentData.selectedScenario);
    if (!scenario) return; // ← Sicurezza extra
  
    const results = scenario.simulateResults(currentData.userInput);
    updateBiasData({
      ...currentData,
      simulationResults: results,
      biasDetected: results.biasesFound
    });
  };

  // STEP 4: Checklist finale
  const completeChecklist = () => {
    updateBiasData({ ...biasData, step: 4, checklistCompleted: true });
  };

  const resetSimulator = () => {
    updateBiasData({
      step: 1,
      selectedScenario: null,
      userInput: '',
      simulationResults: null,
      biasDetected: [],
      checklistCompleted: false
    });
  };

  const toggleChecklistItem = (index) => {
    const checkedItems = biasData.checkedItems || [];
    const newCheckedItems = checkedItems.includes(index)
      ? checkedItems.filter(i => i !== index)
      : [...checkedItems, index];
  
    updateBiasData({ 
      ...biasData, 
      checkedItems: newCheckedItems 
    });
  };

  // Dati scenari completi
  const scenarios = [
    {
      id: 'tenant-selection',
      title: 'Selezione Inquilini Intelligente',
      description: 'Sistema IA per valutazione affidabilità inquilini basato su dati storici',
      icon: '🏠',
      warningLevel: 'alto',
      contexts: [
        'Valutazione automatica domande affitto',
        'Scoring rischio inquilino',
        'Prioritizzazione candidati'
      ],
      biasTypes: [
        'Discriminazione geografica (CAP "sfavorevoli")',
        'Bias anagrafico (età = rischio)',
        'Stereotipi familiari (single = instabili)'
      ],
      simulateResults: (input) => {
        const biases = [];
        let score = 85;
        let recommendation = "APPROVATO";
        
        // Simula bias realistici
        if (input.toLowerCase().includes('zona') || input.toLowerCase().includes('cap') || input.toLowerCase().includes('periferia')) {
          biases.push({
            type: 'Bias Geografico',
            severity: 'critico',
            description: 'IA penalizza automaticamente CAP periferico (-15 punti)',
            impact: 'Discriminazione sistematica zone economicamente svantaggiate'
          });
          score -= 15;
        }
        
        if (input.toLowerCase().includes('single') || input.toLowerCase().includes('giovane') || input.toLowerCase().includes('età')) {
          biases.push({
            type: 'Bias Anagrafico',
            severity: 'moderato', 
            description: 'Correlazione età/stato civile con "instabilità" (-8 punti)',
            impact: 'Penalizza demographic specifiche senza base oggettiva'
          });
          score -= 8;
        }
        
        if (input.toLowerCase().includes('famiglia') || input.toLowerCase().includes('bambini')) {
          biases.push({
            type: 'Bias Compositivo',
            severity: 'lieve',
            description: 'Preferenza per "famiglie tradizionali" (+5 punti)',
            impact: 'Discrimina composizioni familiari non convenzionali'
          });
          score += 5;
        }

        if (score < 70) recommendation = "RIFIUTATO";
        else if (score < 80) recommendation = "DA VALUTARE";

        return {
          originalScore: 85,
          biasedScore: score,
          recommendation,
          processingTime: '1.2s',
          biasesFound: biases,
          explanation: `Sistema ha elaborato ${biases.length} fattori discriminatori automaticamente`,
          corrections: [
            'Rimuovere CAP dal calcolo score',
            'Sostituire età con criteri reddituali oggettivi',
            'Standardizzare criteri indipendenti da composizione familiare'
          ]
        };
      }
    },
    {
      id: 'maintenance-priority',
      title: 'Prioritizzazione Manutenzioni Smart',
      description: 'IA gestisce priorità interventi basandosi su storico e pattern comportamentali',
      icon: '🔧',
      warningLevel: 'medio',
      contexts: [
        'Gestione automatica work order',
        'Ranking urgenza interventi',
        'Allocazione risorse tecniche'
      ],
      biasTypes: [
        'Favoritismo verso proprietari "influenti"',
        'Bias di conferma su zone monitorate',
        'Discriminazione per tipo problema segnalato'
      ],
      simulateResults: (input) => {
        const biases = [];
        let priority = 5;
        let timeline = "7-10 giorni";
        
        if (input.toLowerCase().includes('piano alto') || input.toLowerCase().includes('attico') || input.toLowerCase().includes('proprietario importante')) {
          biases.push({
            type: 'Bias Socio-Economico',
            severity: 'critico',
            description: 'Priorità automatica per appartamenti "prestigiosi" (+3 livelli)',
            impact: 'Crea sistema a due velocità basato su status percepito'
          });
          priority = Math.min(8, priority + 3);
          timeline = "2-3 giorni";
        }
        
        if (input.toLowerCase().includes('elettrico') || input.toLowerCase().includes('tecnico') || input.toLowerCase().includes('impianto')) {
          biases.push({
            type: 'Bias di Complessità',
            severity: 'moderato',
            description: 'Problemi "tecnici" sovraprioritizzati rispetto a habitabilità',
            impact: 'Problemi semplici ma urgenti per inquilini vengono ritardati'
          });
          priority = Math.min(9, priority + 2);
        }
        
        if (input.toLowerCase().includes('reclamo') || input.toLowerCase().includes('secondo') || input.toLowerCase().includes('ripetuto')) {
          biases.push({
            type: 'Bias di Frequenza',
            severity: 'lieve',
            description: 'Penalizzazione automatica per "reclamanti abituali" (-2 livelli)',
            impact: 'Chi segnala legittimamente più problemi viene discriminato'
          });
          priority = Math.max(1, priority - 2);
          timeline = "15-20 giorni";
        }

        return {
          originalPriority: 5,
          biasedPriority: priority,
          estimatedTimeline: timeline,
          processingTime: '0.8s',
          biasesFound: biases,
          explanation: `Algoritmo ha applicato ${biases.length} fattori di prioritizzazione impliciti`,
          corrections: [
            'Criteri trasparenti: sicurezza > habitabilità > comfort',
            'Rotation sistematica per prevenire favoritismi',
            'Tracking equità distribuzione interventi per zona/proprietario'
          ]
        };
      }
    },
    {
      id: 'communication-personalization',
      title: 'Comunicazioni Personalizzate AI',
      description: 'Sistema genera comunicazioni adattate a profili condomini per "massima efficacia"',
      icon: '💬',
      warningLevel: 'alto',
      contexts: [
        'Email automatiche personalizzate',
        'Tonalità adattiva per demografico',
        'Selezione contenuti per "rilevanza"'
      ],
      biasTypes: [
        'Linguaggio paternalistico per anziani',
        'Esclusione informazioni "complesse"',
        'Toni differenziati per status percepito'
      ],
      simulateResults: (input) => {
        const biases = [];
        let tone = "professionale";
        let contentLevel = "completo";
        
       // Controlli più sensibili
        if (input.toLowerCase().includes('straniero') || 
            input.toLowerCase().includes('stranieri') || 
            input.toLowerCase().includes('straniera') ||
            input.toLowerCase().includes('nazionalità') ||
            input.toLowerCase().includes('paese') ||
            input.toLowerCase().includes('lingua')) {
          biases.push({
            type: 'Bias Culturale/Linguistico',
            severity: 'critico',
            description: 'IA potrebbe adattare linguaggio per "facilitare comprensione" stranieri',
            impact: 'Discriminazione paternalistica basata su nazionalità percepita'
          });
          tone = "semplificato-culturale";
          contentLevel = "ridotto-culturale";
        }
  
        if (input.toLowerCase().includes('anziano') || input.toLowerCase().includes('età') || input.toLowerCase().includes('senior')) {
          biases.push({
            type: 'Bias Paternalistico',
            severity: 'critico',
            description: 'Linguaggio automaticamente semplificato per over 65',
            impact: 'Infantilizza persone competenti, limita autonomia decisionale'
          });
          tone = "semplificato-protettivo";
          contentLevel = "ridotto";
        }
  
        if (input.toLowerCase().includes('assemblea') || input.toLowerCase().includes('convocazione')) {
          biases.push({
            type: 'Bias di Complessità Normativa',
            severity: 'moderato',
            description: 'IA filtra informazioni legali per "semplicità"',
            impact: 'Riduce trasparenza e comprensione diritti/doveri'
          });
          contentLevel = "selettivo-legale";
        }

        return {
          originalTone: "professionale",
          biasedTone: tone,
          contentFiltering: contentLevel,
          processingTime: '0.5s',
          biasesFound: biases,
          explanation: `IA ha personalizzato messaggio con ${biases.length} adattamenti discriminatori`,
          corrections: [
          'Standard comunicativi minimi uguali per tutti',
          'Traduzioni disponibili invece di semplificazioni',
          'Informazioni complete sempre accessibili',
          'Review periodica per bias linguistici'
          ]
        };
      }
    }
  ];

  const currentScenario = scenarios.find(s => s.id === biasData.selectedScenario);

  return (
    <div className="workshop-overlay">
      <div className="workshop-container bias-simulator-container">
        {/* Header */}
        <div className="workshop-header bias-header">
          <div>
            <h2>⚖️ Bias Simulator</h2>
            <p>Riconoscere e mitigare bias algoritmici nella gestione condominiale</p>
          </div>
          <button onClick={closeWorkshop} className="workshop-close">×</button>
        </div>

        {/* Progress Indicator */}
        <div className="bias-progress-container">
          <div className="bias-progress-bar">
            <div 
              className="bias-progress-fill" 
              style={{ width: `${(biasData.step / 4) * 100}%` }}
            ></div>
          </div>
          <div className="bias-progress-steps">
            {['Scenario', 'Input', 'Simulazione', 'Validazione'].map((label, index) => (
              <div 
                key={index}
                className={`bias-progress-step ${index + 1 <= biasData.step ? 'active' : ''}`}
              >
                <div className="step-circle">{index + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bias-content">
          {/* STEP 1: Selezione Scenario */}
          {biasData.step === 1 && (
            <div className="bias-step">
              <div className="step-header">
                <h3>🎯 Seleziona Scenario di Bias</h3>
                <p>Scegli una situazione condominiale dove l'IA potrebbe sviluppare comportamenti discriminatori</p>
              </div>
              
              <div className="scenarios-grid-bias">
                {scenarios.map(scenario => (
                  <div key={scenario.id} className="scenario-card-bias">
                    <div className="scenario-header">
                      <div className="scenario-icon">{scenario.icon}</div>
                      <div className={`warning-badge ${scenario.warningLevel}`}>
                        {scenario.warningLevel === 'alto' ? '🔴 ALTO RISCHIO' : 
                         scenario.warningLevel === 'medio' ? '🟡 MEDIO RISCHIO' : '🟢 BASSO RISCHIO'}
                      </div>
                    </div>
                    
                    <h4>{scenario.title}</h4>
                    <p>{scenario.description}</p>
                    
                    <div className="scenario-details">
                      <div className="detail-section">
                        <strong>Contesti di Utilizzo:</strong>
                        <ul>
                          {scenario.contexts.map((context, i) => (
                            <li key={i}>{context}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-section">
                        <strong>Potenziali Bias:</strong>
                        <ul className="bias-list">
                          {scenario.biasTypes.map((bias, i) => (
                            <li key={i} className="bias-warning">{bias}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => selectScenario(scenario.id)}
                      className="btn-select-scenario-bias"
                    >
                      🔍 Simula Questo Scenario
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Input personalizzato */}
          {biasData.step === 2 && (
            <div className="bias-step">
              <div className="step-header">
                <h3>📝 Configura Input del Sistema</h3>
                <p>Descrivi una situazione specifica per <strong>{currentScenario?.title}</strong></p>
              </div>
              
              <div className="input-layout">
                <div className="scenario-context">
                  <div className="selected-scenario">
                    <div className="scenario-badge">
                      {currentScenario?.icon} {currentScenario?.title}
                    </div>
                    <p>{currentScenario?.description}</p>
                  </div>
                  
                  <div className="input-examples">
                    <h4>💡 Esempi di Input:</h4>
                    <div className="example-inputs">
                      {currentScenario?.id === 'tenant-selection' && (
                        <>
                          <div className="example-input safe">
                            <strong>✅ Input Neutrale:</strong>
                            <p>"Valuta candidato: reddito €2.800/mese, contratto indeterminato, referenze positive"</p>
                          </div>
                          <div className="example-input risky">
                            <strong>⚠️ Input a Rischio Bias:</strong>
                            <p>"Valuta candidato: giovane single, zona periferica, primo affitto, famiglia straniera"</p>
                          </div>
                        </>
                      )}
                      
                      {currentScenario?.id === 'maintenance-priority' && (
                        <>
                          <div className="example-input safe">
                            <strong>✅ Input Neutrale:</strong>
                            <p>"Perdita acqua bagno principale, appartamento 3B, segnalata oggi mattina"</p>
                          </div>
                          <div className="example-input risky">
                            <strong>⚠️ Input a Rischio Bias:</strong>
                            <p>"Reclamo elettrico, piano alto, proprietario importante, secondo reclamo questo mese"</p>
                          </div>
                        </>
                      )}
                      
                      {currentScenario?.id === 'communication-personalization' && (
                        <>
                          <div className="example-input safe">
                            <strong>✅ Input Neutrale:</strong>
                            <p>"Invia comunicazione assemblea condominiale a tutti i condomini"</p>
                          </div>
                          <div className="example-input risky">
                            <strong>⚠️ Input a Rischio Bias:</strong>
                            <p>"Personalizza messaggio per anziano pensionato, argomento normativa tecnica complessa"</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="input-form">
                  <label>Il tuo scenario specifico:</label>
                  <textarea
                    value={biasData.userInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Descrivi la situazione che vuoi far elaborare al sistema IA..."
                    rows="6"
                  />
                  
                  <div className="input-actions">
                    <button 
                      onClick={() => updateBiasData({ ...biasData, step: 1 })}
                      className="btn-back"
                    >
                      ← Cambia Scenario
                    </button>
                    <button 
                      onClick={proceedToSimulation}
                      className="btn-simulate"
                      disabled={!biasData.userInput.trim()}
                    >
                      🚀 Avvia Simulazione
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Simulazione in corso e risultati */}
          {biasData.step === 3 && (
            <div className="bias-step">
              {!biasData.simulationResults ? (
                <div className="simulation-loading">
                  <div className="ai-brain-animation">
                    <div className="brain-pulse">🧠</div>
                    <div className="processing-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </div>
                  <h3>🔍 IA in Elaborazione</h3>
                  <p>Il sistema sta analizzando il tuo input e applicando i suoi algoritmi...</p>
                  <div className="processing-steps">
                    <div className="processing-step active">📊 Analisi pattern storici</div>
                    <div className="processing-step active">🏷️ Classificazione automatica</div>
                    <div className="processing-step active">⚡ Applicazione bias impliciti</div>
                    <div className="processing-step active">📋 Generazione raccomandazione</div>
                  </div>
                </div>
              ) : (
                <div className="simulation-results">
                  <div className="step-header">
                    <h3>⚠️ Bias Rilevati nel Sistema</h3>
                    <p>La simulazione ha identificato comportamenti discriminatori automatici</p>
                  </div>
                  
                  <div className="results-layout-bias">
                    <div className="bias-detection-panel">
                      <div className="bias-alert">
                        <div className="alert-icon">🚨</div>
                        <div>
                          <strong>{biasData.simulationResults.biasesFound.length} Bias Rilevati</strong>
                          <p>Il sistema ha applicato discriminazioni automatiche</p>
                        </div>
                      </div>
                      
                      <div className="detected-biases">
                        {biasData.simulationResults.biasesFound.map((bias, index) => (
                          <div key={index} className={`bias-item ${bias.severity}`}>
                            <div className="bias-header">
                              <span className="bias-type">{bias.type}</span>
                              <span className={`severity-badge ${bias.severity}`}>
                                {bias.severity === 'critico' ? '🔴' : bias.severity === 'moderato' ? '🟡' : '🟢'}
                                {bias.severity.toUpperCase()}
                              </span>
                            </div>
                            <div className="bias-description">{bias.description}</div>
                            <div className="bias-impact">
                              <strong>Impatto:</strong> {bias.impact}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="comparison-panel">
                      <h4>📊 Confronto Risultati</h4>
                      
                      <div className="before-after">
                        <div className="result-box neutral">
                          <h5>✅ Decisione Neutra</h5>
                          {currentScenario?.id === 'tenant-selection' && (
                            <div className="metric">Score: <span className="value">{biasData.simulationResults.originalScore}/100</span></div>
                          )}
                          {currentScenario?.id === 'maintenance-priority' && (
                            <div className="metric">Priorità: <span className="value">{biasData.simulationResults.originalPriority}/10</span></div>
                          )}
                          {currentScenario?.id === 'communication-personalization' && (
                            <div className="metric">Tono: <span className="value">{biasData.simulationResults.originalTone}</span></div>
                          )}
                        </div>
                        
                        <div className="result-box biased">
                          <h5>⚠️ Decisione con Bias</h5>
                          {currentScenario?.id === 'tenant-selection' && (
                            <>
                              <div className="metric">Score: <span className="value danger">{biasData.simulationResults.biasedScore}/100</span></div>
                              <div className="recommendation">{biasData.simulationResults.recommendation}</div>
                            </>
                          )}
                          {currentScenario?.id === 'maintenance-priority' && (
                            <>
                              <div className="metric">Priorità: <span className="value danger">{biasData.simulationResults.biasedPriority}/10</span></div>
                              <div className="recommendation">{biasData.simulationResults.estimatedTimeline}</div>
                            </>
                          )}
                          {currentScenario?.id === 'communication-personalization' && (
                            <>
                              <div className="metric">Tono: <span className="value danger">{biasData.simulationResults.biasedTone}</span></div>
                              <div className="recommendation">Contenuto: {biasData.simulationResults.contentFiltering}</div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="corrections-preview">
                        <h5>🛠️ Correzioni Suggerite</h5>
                        <ul>
                          {biasData.simulationResults.corrections.map((correction, i) => (
                            <li key={i}>{correction}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <button 
                        onClick={completeChecklist}
                        className="btn-proceed-validation"
                      >
                        ✅ Procedi alla Validazione
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Checklist finale */}
          {biasData.step === 4 && (
            <div className="bias-step">
              <div className="step-header">
                <h3>🛡️ Toolkit Anti-Bias</h3>
                <p>Framework pratico per riconoscere e prevenire bias algoritmici</p>
              </div>
              
              <div className="validation-layout">
                <div className="checklist-section">
                  <h4>📋 Checklist "Bias Detection"</h4>
                  <p><em>Prima di implementare qualsiasi decisione IA, verifica:</em></p>
                  
                  <div className="checklist-items">
                    {[
                      "L'IA ha trattato tutti i soggetti equamente?",
                      "Le raccomandazioni favoriscono qualche gruppo specifico?", 
                      "I criteri di decisione sono trasparenti e giustificabili?",
                      "Avresti preso la stessa decisione con metodo tradizionale?",
                      "Puoi spiegare il ragionamento a un terzo neutrale?"
                    ].map((item, index) => {
                      const isChecked = biasData.checkedItems?.includes(index);
                      return (
                        <div 
                          key={index} 
                          className={`checklist-item ${isChecked ? 'checked' : ''}`}
                          onClick={() => toggleChecklistItem(index)}
                        >
                          <div className="checkbox">{isChecked ? '✓' : '□'}</div>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="perspective-section">
                  <h4>🔄 Tecnica "Perspective Shifting"</h4>
                  <div className="perspective-box">
                    <div className="perspective-quote">
                      "Prima di implementare decisione IA, chiedetevi: 
                      <strong>Come la vedrebbe il condomino più svantaggiato? 
                      Il più critico? Il più vulnerabile?</strong>"
                    </div>
                    
                    <div className="perspective-examples">
                      <h5>💭 Applica al tuo scenario:</h5>
                      {currentScenario && (
                        <div className="scenario-reflection">
                          <strong>Scenario: {currentScenario.title}</strong>
                          <div className="reflection-questions">
                            {currentScenario.id === 'tenant-selection' && (
                              <>
                                <p>👥 <strong>Dal punto di vista del candidato rifiutato:</strong> "Sono stato discriminato per la mia zona di provenienza?"</p>
                                <p>🏘️ <strong>Dal punto di vista della comunità:</strong> "Questo sistema perpetua segregazione territoriale?"</p>
                                <p>⚖️ <strong>Dal punto di vista legale:</strong> "Questi criteri violano normative anti-discriminazione?"</p>
                              </>
                            )}
                            
                            {currentScenario.id === 'maintenance-priority' && (
                              <>
                                <p>🔧 <strong>Dal punto di vista dell'inquilino penalizzato:</strong> "Perché il mio problema è sempre meno prioritario?"</p>
                                <p>🏠 <strong>Dal punto di vista di equità condominiale:</strong> "Tutti i condomini ricevono stesso livello di servizio?"</p>
                                <p>📊 <strong>Dal punto di vista della trasparenza:</strong> "I criteri di priorità sono chiari e giusti?"</p>
                              </>
                            )}
                            
                            {currentScenario.id === 'communication-personalization' && (
                              <>
                                <p>👴 <strong>Dal punto di vista dell'anziano "protetto":</strong> "Sono trattato come incapace di capire?"</p>
                                <p>📚 <strong>Dal punto di vista dell'autonomia:</strong> "Ho diritto alle stesse informazioni di tutti?"</p>
                                <p>🎯 <strong>Dal punto di vista dell'inclusione:</strong> "Questa personalizzazione mi isola o mi integra?"</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="action-framework">
                  <h4>🛠️ Framework Implementazione</h4>
                  <div className="framework-steps">
                    <div className="framework-step">
                      <div className="step-number">1</div>
                      <div>
                        <strong>Audit Preliminare</strong>
                        <p>Test sistema con dataset diversificati prima del deploy</p>
                      </div>
                    </div>
                    <div className="framework-step">
                      <div className="step-number">2</div>
                      <div>
                        <strong>Monitoring Continuo</strong>
                        <p>Tracking pattern discriminatori su base mensile</p>
                      </div>
                    </div>
                    <div className="framework-step">
                      <div className="step-number">3</div>
                      <div>
                        <strong>Supervisione Umana</strong>
                        <p>Review manuale decisioni IA ad alto impatto</p>
                      </div>
                    </div>
                    <div className="framework-step">
                      <div className="step-number">4</div>
                      <div>
                        <strong>Feedback Loop</strong>
                        <p>Canale per segnalazione bias e correzione algoritmi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="final-actions">
                <button onClick={resetSimulator} className="btn-new-simulation">
                  🔄 Nuova Simulazione
                </button>
                <button onClick={closeWorkshop} className="btn-complete-workshop">
                  ✅ Completa Workshop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiasSimulator;