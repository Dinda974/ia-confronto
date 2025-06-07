import React from 'react';
import { useApp } from '../../contexts/AppContext';

const RoiPlanner = () => {
  const { state, dispatch } = useApp();

  if (state.activeWorkshop !== 'roi-planner') {
    return null;
  }

  const roiData = state.workshopData.roiPlanner || {
    step: 1,
    businessProfile: {},
    selectedTools: [],
    timeline: '12months',
    investmentLevel: 'starter',
    calculations: null,
    reportGenerated: false
  };

    // Debug logs
  console.log('🔵 roiData:', roiData);
  console.log('🔵 roiData.step:', roiData.step);

  const closeWorkshop = () => {
    dispatch({ type: 'CLOSE_WORKSHOP' });
    dispatch({ type: 'RESET_WORKSHOP_DATA', payload: 'roiPlanner' });
  };

  const updateRoiData = (data) => {
    dispatch({
      type: 'UPDATE_WORKSHOP_DATA',
      payload: {
        workshop: 'roiPlanner',
        data
      }
    });
  };

  // Business Profiles
  const businessProfiles = [
    {
      id: 'solo',
      title: 'Amministratore Solo',
      icon: '👤',
      description: 'Studio individuale, 5-15 condomini',
      characteristics: ['1 persona', '5-15 condomini', 'Budget limitato', 'Focus efficienza'],
      baseRevenue: 45000,
      timeSpent: 45,
      painPoints: ['Sovraccarico lavoro', 'Comunicazioni ripetitive', 'Poco tempo sviluppo business']
    },
    {
      id: 'small-team',
      title: 'Studio Piccolo',
      icon: '👥',
      description: 'Team 2-4 persone, 15-35 condomini',
      characteristics: ['2-4 persone', '15-35 condomini', 'Budget moderato', 'Crescita sostenuta'],
      baseRevenue: 120000,
      timeSpent: 50,
      painPoints: ['Coordinamento team', 'Standardizzazione processi', 'Qualità costante output']
    },
    {
      id: 'established',
      title: 'Studio Affermato',
      icon: '🏢',
      description: 'Team 5+ persone, 35+ condomini',
      characteristics: ['5+ persone', '35+ condomini', 'Budget significativo', 'Leadership mercato'],
      baseRevenue: 250000,
      timeSpent: 55,
      painPoints: ['Scalabilità processi', 'Innovazione competitiva', 'Differenziazione premium']
    }
  ];

  // IA Tools Database
  const iaTools = [
    {
      id: 'chatgpt-plus',
      name: 'ChatGPT Plus',
      category: 'Generative AI',
      monthlyCost: 20,
      setupCost: 0,
      timeSaving: 8,
      useCases: ['Comunicazioni', 'Email', 'Documenti base'],
      complexity: 'low',
      roi: 'immediate'
    },
    {
      id: 'claude-pro',
      name: 'Claude Pro',
      category: 'Document Analysis',
      monthlyCost: 20,
      setupCost: 0,
      timeSaving: 12,
      useCases: ['Analisi contratti', 'Capitolati', 'Documenti complessi'],
      complexity: 'low',
      roi: 'immediate'
    },
    {
      id: 'office-copilot',
      name: 'Microsoft 365 Copilot',
      category: 'Workflow Integration',
      monthlyCost: 30,
      setupCost: 200,
      timeSaving: 15,
      useCases: ['Office integration', 'Email auto', 'Scheduling'],
      complexity: 'medium',
      roi: 'medium-term'
    },
    {
      id: 'property-ai',
      name: 'Property Management AI',
      category: 'Specialized Tools',
      monthlyCost: 150,
      setupCost: 1500,
      timeSaving: 25,
      useCases: ['Manutenzione predittiva', 'Reporting auto', 'Analytics'],
      complexity: 'high',
      roi: 'long-term'
    },
    {
      id: 'smart-building',
      name: 'Smart Building Platform',
      category: 'IoT + AI',
      monthlyCost: 300,
      setupCost: 5000,
      timeSaving: 35,
      useCases: ['Building automation', 'Energy optimization', 'Predictive maintenance'],
      complexity: 'high',
      roi: 'long-term'
    }
  ];

  const investmentLevels = [
    {
      id: 'starter',
      title: 'Starter Package',
      budget: '€500-2.000/anno',
      description: 'Tools base per iniziare',
      icon: '🌱'
    },
    {
      id: 'professional',
      title: 'Professional Suite',
      budget: '€2.000-8.000/anno',
      description: 'Integrazione workflow completa',
      icon: '⚡'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Solution',
      budget: '€8.000+/anno',
      description: 'Trasformazione digitale totale',
      icon: '🚀'
    }
  ];
// FUNZIONI HELPER PER ROI MIGLIORATO
  const calculateConfidenceLevel = (profile, tools) => {
    let confidence = 70; // Base 70%
  
  // Fattori che aumentano la confidenza
    if (profile.timeSpent > 50) confidence += 10; // Studio grande
    if (tools.some(t => t.complexity === 'low')) confidence += 10; // Tools semplici
    if (tools.length <= 2) confidence += 5; // Focus su pochi strumenti
  
  // Fattori che diminuiscono la confidenza  
    if (tools.some(t => t.complexity === 'high')) confidence -= 15; // Tools complessi
    if (tools.length > 3) confidence -= 10; // Troppi strumenti insieme
    if (profile.baseRevenue < 50000) confidence -= 10; // Studio piccolo
  
    return Math.max(40, Math.min(90, confidence));
  };

  const identifyRiskFactors = (profile, tools) => {
    const risks = [];
  
    if (tools.some(t => t.complexity === 'high')) {
      risks.push('Strumenti complessi richiedono formazione estesa');
    }
    if (tools.length > 3) {
      risks.push('Gestione multipla di strumenti può creare inefficienze');
    }
    if (profile.baseRevenue < 80000) {
      risks.push('Budget limitato può compromettere implementazione completa');
    }
    if (profile.timeSpent < 40) {
      risks.push('Tempo limitato può rallentare adozione dei nuovi strumenti');
    }
  
    return risks;
  };

  // FUNZIONE calculateROI MIGLIORATA
  const calculateROI = () => {
    const profile = businessProfiles.find(p => p.id === roiData.businessProfile.id);
    if (!profile || roiData.selectedTools.length === 0) return null;

    const selectedToolsData = roiData.selectedTools.map(id => iaTools.find(t => t.id === id));
  
  // CALCOLI BASE
    const monthlyCosts = selectedToolsData.reduce((sum, tool) => sum + tool.monthlyCost, 0);
    const setupCosts = selectedToolsData.reduce((sum, tool) => sum + tool.setupCost, 0);
    const annualCost = (monthlyCosts * 12) + setupCosts;
  
    const totalTimeSaving = selectedToolsData.reduce((sum, tool) => sum + tool.timeSaving, 0);
    const hourlyRate = profile.baseRevenue / (profile.timeSpent * 52);
    const annualTimeSavings = totalTimeSaving * 52;
    const monetaryBenefit = annualTimeSavings * hourlyRate;
  
  // FATTORI DI CORREZIONE REALISTICI
    const corrections = {
      learningCurveMultiplier: 0.8,    // Primi 6 mesi al 80% efficienza
      hiddenCostMultiplier: 1.15,      // 15% costi nascosti
      realizationFactor: 0.75,         // 75% del tempo risparmiato è monetizzabile
      efficiencyDecline: 0.95          // 5% deterioramento annuo
    };

  // CALCOLI REALISTICI
    const adjustedTimeSaving = totalTimeSaving * corrections.realizationFactor;
    const adjustedAnnualCost = annualCost * corrections.hiddenCostMultiplier;
    const adjustedBenefit = (adjustedTimeSaving * 52 * hourlyRate) * corrections.learningCurveMultiplier;

  // ROI OTTIMISTICO (originale)
    const optimisticROI = ((monetaryBenefit - annualCost) / annualCost * 100);
    const optimisticPayback = annualCost / (monetaryBenefit / 12);
  
  // ROI REALISTICO (con correzioni)
    const realisticROI = ((adjustedBenefit - adjustedAnnualCost) / adjustedAnnualCost * 100);
    const realisticPayback = adjustedAnnualCost / (adjustedBenefit / 12);
  
  // PROIEZIONI TRIENNALI
  // Ottimistiche (calcolo originale)
    const optimisticYear1 = monetaryBenefit - annualCost;
    const optimisticYear2 = monetaryBenefit - (monthlyCosts * 12);
    const optimisticYear3 = monetaryBenefit - (monthlyCosts * 12);
    const optimisticThreeYear = optimisticYear1 + optimisticYear2 + optimisticYear3;
  
  // Realistiche (con deterioramento)
    const realisticYear1 = adjustedBenefit - adjustedAnnualCost;
    const realisticYear2 = (adjustedBenefit * corrections.efficiencyDecline) - (monthlyCosts * 12 * corrections.hiddenCostMultiplier);
    const realisticYear3 = (adjustedBenefit * Math.pow(corrections.efficiencyDecline, 2)) - (monthlyCosts * 12 * corrections.hiddenCostMultiplier);
    const realisticThreeYear = realisticYear1 + realisticYear2 + realisticYear3;

  // ANALISI QUALITATIVA
    const confidenceLevel = calculateConfidenceLevel(profile, selectedToolsData);
    const riskFactors = identifyRiskFactors(profile, selectedToolsData);

    return {
    // CALCOLI ORIGINALI (per compatibilità)
      annualCost,
      monthlyCosts,
      setupCosts,
      timeSaving: totalTimeSaving,
      annualTimeSavings,
      monetaryBenefit,
      roi: optimisticROI,
      paybackMonths: optimisticPayback,
      year1: optimisticYear1,
      year2: optimisticYear2,
      year3: optimisticYear3,
      threeYearNet: optimisticThreeYear,
      hourlyRate,
    
    // NUOVI CALCOLI REALISTICI
      adjustedAnnualCost,
      adjustedBenefit,
      realisticROI,
      realisticPayback,
      realisticYear1,
      realisticYear2,
      realisticYear3,
      realisticThreeYear,
    
    // ANALISI QUALITATIVA
      confidenceLevel,
      riskFactors,
    
    // RANGE DI INCERTEZZA
      roiRange: {
        pessimistic: realisticROI * 0.8,
        optimistic: optimisticROI * 1.1
      }
    };
  };

  const proceedToResults = () => {
    const calculations = calculateROI();
    updateRoiData({
      ...roiData,
      step: 4,
      calculations
    });
  };

  // AGGIUNGI questa funzione nel componente RoiPlanner.js

  const generateReport = () => {
  // Aggiorna lo stato
    updateRoiData({
      ...roiData,
      reportGenerated: true
    });
  
  // Genera e scarica il report
    const profile = businessProfiles.find(p => p.id === roiData.businessProfile.id);
    const selectedToolsData = roiData.selectedTools.map(id => iaTools.find(t => t.id === id));
  
    const reportContent = `
  === ROI ANALYSIS REPORT - IA CONFRONTO ===
  Data generazione: ${new Date().toLocaleDateString('it-IT')}

  PROFILO BUSINESS
  • Tipo: ${profile.title}
  • Descrizione: ${profile.description}
  • Fatturato medio: €${profile.baseRevenue.toLocaleString()}
  • Ore lavoro/settimana: ${profile.timeSpent}h

  STRUMENTI SELEZIONATI
  ${selectedToolsData.map(tool => `• ${tool.name} (${tool.category}) - €${tool.monthlyCost}/mese`).join('\n')}

ANALISI ROI
- ROI Ottimistico: ${roiData.calculations.roi.toFixed(1)}%
- ROI Realistico: ${roiData.calculations.realisticROI.toFixed(1)}%
- Payback Ottimistico: ${roiData.calculations.paybackMonths.toFixed(1)} mesi
- Payback Realistico: ${roiData.calculations.realisticPayback.toFixed(1)} mesi
- Livello di Confidenza: ${roiData.calculations.confidenceLevel}%
- Costi Aggiustati: €${roiData.calculations.adjustedAnnualCost.toLocaleString()}

  PROIEZIONE TRIENNALE
  • Anno 1: €${roiData.calculations.year1.toLocaleString()}
  • Anno 2: €${roiData.calculations.year2.toLocaleString()}
  • Anno 3: €${roiData.calculations.year3.toLocaleString()}
  • Totale 3 anni: €${roiData.calculations.threeYearNet.toLocaleString()}

  RACCOMANDAZIONI
  ${roiData.calculations.roi > 100 ? '✅ Investimento Fortemente Consigliato - ROI eccellente con payback rapido' : 
    roiData.calculations.roi > 50 ? '👍 Investimento Valido - Buon ROI con rischi contenuti' :
    roiData.calculations.roi > 0 ? '⚠️ Valuta Attentamente - ROI positivo ma moderato' :
    '🔄 Rivedi Strategia - ROI negativo, considera alternative'}

    ⚠️ IMPORTANTE - LIMITAZIONI DELL'ANALISI:
- I calcoli sono basati su stime e medie di settore
- I risultati effettivi possono variare del ±20-30%
- Non considera costi di formazione e integrazione
- Assume disponibilità immediate delle competenze
- Consigliamo un progetto pilota prima dell'investimento completo

📊 LIVELLO DI CONFIDENZA: ${roiData.calculations.confidenceLevel}%

  ---
  Report generato da IA CONFRONTO - Seminario Interattivo
  www.ia-confronto.it
  ` ;
  
  // Crea e scarica il file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ROI_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  
  // Mostra feedback visivo
    alert('📄 Report generato e scaricato con successo!\n\nTrova il file nella cartella Downloads del tuo computer.');
  };

  return (
    <div className="workshop-overlay">
      <div className="workshop-container roi-planner-container">
        {/* Header */}
        <div className="workshop-header roi-header">
          <div>
            <h2>📊 ROI Planner IA</h2>
            <p>Pianifica investimenti IA con analisi costi-benefici professionale</p>
          </div>
          <button onClick={closeWorkshop} className="workshop-close">×</button>
        </div>

        {/* Progress Bar - FIXED NAMES */}
        <div className="roi-progress">
          <div className="roi-progress-steps">
            {['Profilo', 'Strumenti', 'Budget', 'Risultati'].map((step, index) => (
              <div key={index} className={`roi-progress-step ${index + 1 <= roiData.step ? 'active' : ''}`}>
                <div className="roi-step-number">{index + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="roi-content">
          {/* STEP 1: Business Profile */}
          {roiData.step === 1 && (
            <div className="roi-step">
              <h3>🎯 Seleziona il Tuo Profilo Business</h3>
              <p>Identifica la categoria che meglio descrive il tuo studio</p>
              
              <div className="business-profiles">
                {businessProfiles.map(profile => (
                  <div 
                    key={profile.id} 
                    className={`profile-card ${roiData.businessProfile.id === profile.id ? 'selected' : ''}`}
                    onClick={() => updateRoiData({...roiData, businessProfile: profile})}
                  >
                    <div className="profile-header">
                      <div className="profile-icon">{profile.icon}</div>
                      <h4>{profile.title}</h4>
                    </div>
                    
                    <p className="profile-description">{profile.description}</p>
                    
                    <div className="profile-characteristics">
                      {profile.characteristics.map((char, i) => (
                        <span key={i} className="characteristic-tag">{char}</span>
                      ))}
                    </div>
                    
                    <div className="profile-metrics">
                      <div className="metric">
                        <strong>Fatturato medio:</strong> €{profile.baseRevenue.toLocaleString()}
                      </div>
                      <div className="metric">
                        <strong>Ore lavoro/settimana:</strong> {profile.timeSpent}h
                      </div>
                    </div>
                    
                    <div className="pain-points">
                      <strong>Pain Points Principali:</strong>
                      <ul>
                        {profile.painPoints.map((pain, i) => (
                          <li key={i}>{pain}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              {roiData.businessProfile.id && (
                <button 
                  onClick={() => updateRoiData({...roiData, step: 2})}
                  className="btn-next-step"
                >
                  Continua → Selezione Strumenti
                </button>
              )}
            </div>
          )}

          {/* STEP 2: Tools Selection */}
          {roiData.step === 2 && (
            <div className="roi-step">
              <h3>🛠️ Seleziona Strumenti IA</h3>
              <p>Scegli gli strumenti che vuoi valutare per il tuo investimento</p>
              
              <div className="tools-grid">
                {iaTools.map(tool => (
                  <div 
                    key={tool.id}
                    className={`tool-card ${roiData.selectedTools.includes(tool.id) ? 'selected' : ''}`}
                    onClick={() => {
                      const newSelected = roiData.selectedTools.includes(tool.id)
                        ? roiData.selectedTools.filter(id => id !== tool.id)
                        : [...roiData.selectedTools, tool.id];
                      updateRoiData({...roiData, selectedTools: newSelected});
                    }}
                  >
                    <div className="tool-header">
                      <h4>{tool.name}</h4>
                      <span className="tool-category">{tool.category}</span>
                    </div>
                    
                    <div className="tool-cost">
                      <div className="monthly-cost">€{tool.monthlyCost}/mese</div>
                      {tool.setupCost > 0 && (
                        <div className="setup-cost">Setup: €{tool.setupCost}</div>
                      )}
                    </div>
                    
                    <div className="tool-benefits">
                      <div className="time-saving">
                        ⏰ Risparmio: {tool.timeSaving}h/settimana
                      </div>
                      <div className={`complexity complexity-${tool.complexity}`}>
                        📈 Complessità: {tool.complexity}
                      </div>
                    </div>
                    
                    <div className="use-cases">
                      <strong>Casi d'uso:</strong>
                      <ul>
                        {tool.useCases.map((useCase, i) => (
                          <li key={i}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="step-actions">
                <button 
                  onClick={() => updateRoiData({...roiData, step: 1})}
                  className="btn-back"
                >
                  ← Torna al Profilo
                </button>
                
                {roiData.selectedTools.length > 0 && (
                  <button 
                    onClick={() => updateRoiData({...roiData, step: 3})}
                    className="btn-next-step"
                  >
                    Continua → Configurazione Budget
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Investment Level */}
          {roiData.step === 3 && (
            <div className="roi-step">
              <h3>💰 Livello Investimento</h3>
              <p>Seleziona il range di budget per la tua strategia IA</p>
              
              <div className="investment-levels">
                {investmentLevels.map(level => (
                  <div 
                    key={level.id}
                    className={`investment-card ${roiData.investmentLevel === level.id ? 'selected' : ''}`}
                    onClick={() => updateRoiData({...roiData, investmentLevel: level.id})}
                  >
                    <div className="investment-icon">{level.icon}</div>
                    <h4>{level.title}</h4>
                    <div className="investment-budget">{level.budget}</div>
                    <p>{level.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="timeline-selection">
                <h4>📅 Timeline Analisi</h4>
                <div className="timeline-options">
                  {[
                    {id: '6months', label: '6 Mesi', desc: 'Quick wins focus'},
                    {id: '12months', label: '1 Anno', desc: 'Standard planning'},
                    {id: '24months', label: '2 Anni', desc: 'Strategic view'},
                    {id: '36months', label: '3 Anni', desc: 'Long-term ROI'}
                  ].map(option => (
                    <label key={option.id} className="timeline-option">
                      <input 
                        type="radio" 
                        name="timeline" 
                        value={option.id}
                        checked={roiData.timeline === option.id}
                        onChange={(e) => updateRoiData({...roiData, timeline: e.target.value})}
                      />
                      <span className="timeline-label">
                        <strong>{option.label}</strong>
                        <small>{option.desc}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="step-actions">
                <button 
                  onClick={() => updateRoiData({...roiData, step: 2})}
                  className="btn-back"
                >
                  ← Modifica Strumenti
                </button>
                
                <button 
                  onClick={proceedToResults}
                  className="btn-calculate"
                >
                  🧮 Calcola ROI
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {roiData.step === 4 && roiData.calculations && (
            <div className="roi-step">
              <h3>📈 Analisi ROI Completa</h3>
              
              <div className="roi-results-dashboard">
                {/* Key Metrics */}
                <div className="key-metrics">
                  <div className="metric-card primary">
                    <h4>ROI Annuale</h4>
                    <div className="metric-value">
                      {roiData.calculations.roi > 0 ? '+' : ''}{roiData.calculations.roi.toFixed(1)}%
                    </div>
                    <div className="metric-trend">
                      {roiData.calculations.roi > 100 ? 'Eccellente' : 
                       roiData.calculations.roi > 50 ? 'Molto Buono' : 
                       roiData.calculations.roi > 0 ? 'Positivo' : 'Da rivedere'}
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h4>Payback Period</h4>
                    <div className="metric-value">
                      {roiData.calculations.paybackMonths.toFixed(1)} mesi
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h4>Risparmio Tempo</h4>
                    <div className="metric-value">
                      {roiData.calculations.timeSaving}h/settimana
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h4>Costo Annuale</h4>
                    <div className="metric-value">
                      €{roiData.calculations.annualCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Confronto Scenari */}
                <div className="scenario-comparison">
                  <h4>📊 Confronto Scenari</h4>
                  <div className="roi-comparison-grid">
                    <div className="roi-scenario-card optimistic">
                      <h5>🎯 Scenario Ottimistico</h5>
                      <div className="scenario-metric">
                        <span>ROI</span>
                        <span className="value">{roiData.calculations.roi.toFixed(1)}%</span>
                      </div>
                      <div className="scenario-metric">
                        <span>Payback</span>
                        <span className="value">{roiData.calculations.paybackMonths.toFixed(1)} mesi</span>
                      </div>
                      <div className="scenario-metric">
                        <span>3 anni</span>
                        <span className="value">€{roiData.calculations.threeYearNet.toLocaleString()}</span>
                      </div>
                    </div>
    
                <div className="scenario-card realistic">
                  <h5>⚖️ Scenario Realistico</h5>
                  <div className="scenario-metric">
                    <span>ROI</span>
                    <span className="value">{roiData.calculations.realisticROI.toFixed(1)}%</span>
                  </div>
                  <div className="scenario-metric">
                    <span>Payback</span>
                    <span className="value">{roiData.calculations.realisticPayback.toFixed(1)} mesi</span>
                  </div>
                  <div className="scenario-metric">
                    <span>3 anni</span>
                    <span className="value">€{roiData.calculations.realisticThreeYear.toLocaleString()}</span>
                  </div>
                </div>
              </div>
  
              <div className="confidence-indicator">
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{width: `${roiData.calculations.confidenceLevel}%`}}
                  ></div>
                </div>
                <p>Livello di Confidenza: <strong>{roiData.calculations.confidenceLevel}%</strong></p>
              </div>
            </div>

            {/* Risk Analysis */}
            {roiData.calculations.riskFactors.length > 0 && (
              <div className="risk-analysis">
                <h4>⚠️ Fattori di Rischio</h4>
                <div className="risk-list">
                  {roiData.calculations.riskFactors.map((risk, index) => (
                    <div key={index} className="risk-item">
                      <span className="risk-icon">⚠️</span>
                      <span className="risk-text">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <h4>💸 Breakdown Costi</h4>
                  <div className="roi-breakdown-items">
                    <div className="roi-breakdown-item">
                      <span>Costi Setup Iniziali</span>
                      <span>€{roiData.calculations.setupCosts.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Costi Mensili</span>
                      <span>€{roiData.calculations.monthlyCosts}/mese</span>
                    </div>
                    <div className="breakdown-item total">
                      <span>Totale Anno 1</span>
                      <span>€{roiData.calculations.annualCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits Analysis */}
                <div className="benefits-analysis">
                  <h4>💰 Analisi Benefici</h4>
                  <div className="roi-benefit-items">
                    <div className="roi-benefit-item">
                      <span>Ore risparmiate/anno</span>
                      <span>{roiData.calculations.annualTimeSavings}h</span>
                    </div>
                    <div className="benefit-item">
                      <span>Valore orario stimato</span>
                      <span>€{roiData.calculations.hourlyRate.toFixed(0)}/h</span>
                    </div>
                    <div className="benefit-item total">
                      <span>Beneficio Monetario</span>
                      <span>€{roiData.calculations.monetaryBenefit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 3-Year Projection */}
                <div className="projection-chart">
                  <h4>📊 Proiezione Triennale</h4>
                  <div className="year-projections">
                    <div className="year-projection">
                      <div className="year-label">Anno 1</div>
                      <div className={`year-value ${roiData.calculations.year1 > 0 ? 'positive' : 'negative'}`}>
                        €{roiData.calculations.year1.toLocaleString()}
                      </div>
                    </div>
                    <div className="year-projection">
                      <div className="year-label">Anno 2</div>
                      <div className={`year-value ${roiData.calculations.year2 > 0 ? 'positive' : 'negative'}`}>
                        €{roiData.calculations.year2.toLocaleString()}
                      </div>
                    </div>
                    <div className="year-projection">
                      <div className="year-label">Anno 3</div>
                      <div className={`year-value ${roiData.calculations.year3 > 0 ? 'positive' : 'negative'}`}>
                        €{roiData.calculations.year3.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="total-projection">
                    <strong>Guadagno Netto 3 Anni: €{roiData.calculations.threeYearNet.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="recommendations">
                  <h4>🎯 Raccomandazioni</h4>
                  <div className="roi-recommendation-list">
                    {roiData.calculations.roi > 100 && (
                      <div className="roi-recommendation success">
                        <strong>✅ Investimento Fortemente Consigliato</strong>
                        <p>ROI eccellente con payback rapido. Implementa subito!</p>
                      </div>
                    )}
                    
                    {roiData.calculations.roi > 50 && roiData.calculations.roi <= 100 && (
                      <div className="recommendation good">
                        <strong>👍 Investimento Valido</strong>
                        <p>Buon ROI con rischi contenuti. Procedi con implementazione graduale.</p>
                      </div>
                    )}
                    
                    {roiData.calculations.roi > 0 && roiData.calculations.roi <= 50 && (
                      <div className="recommendation caution">
                        <strong>⚠️ Valuta Attentamente</strong>
                        <p>ROI positivo ma moderato. Considera benefici qualitativi aggiuntivi.</p>
                      </div>
                    )}
                    
                    {roiData.calculations.roi <= 0 && (
                      <div className="recommendation warning">
                        <strong>🔄 Rivedi Strategia</strong>
                        <p>ROI negativo. Riduci strumenti o cerca alternative più economiche.</p>
                      </div>
                    )}
                    
                    {roiData.calculations.paybackMonths <= 6 && (
                      <div className="recommendation info">
                        <strong>⚡ Quick Wins</strong>
                        <p>Payback molto rapido. Inizia con questi strumenti per risultati immediati.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 🎯 AGGIUNGI QUI IL DISCLAIMER */}
              <div className="roi-disclaimer">
                <h4>⚠️ Limitazioni dell'Analisi</h4>
                <div className="disclaimer-content">
                  <p><strong>IMPORTANTE:</strong> I calcoli sono basati su stime e medie di settore</p>
                  <ul>
                    <li>I risultati effettivi possono variare del ±20-30%</li>
                    <li>Non considera costi di formazione e integrazione</li>
                    <li>Assume disponibilità immediate delle competenze</li>
                    <li>Consigliamo un progetto pilota prima dell'investimento completo</li>
                  </ul>
                  <div className="confidence-badge">
                    📊 LIVELLO DI CONFIDENZA: <strong>{roiData.calculations.confidenceLevel}%</strong>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button 
                  onClick={() => updateRoiData({...roiData, step: 3})}
                  className="btn-back"
                >
                  ← Modifica Configurazione
                </button>
                
                <button 
                  onClick={generateReport}
                  className="btn-generate-report"
                >
                  📄 Genera Report Completo
                </button>
                
                <button 
                  onClick={closeWorkshop}
                  className="btn-complete"
                >
                  ✅ Completa Analisi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoiPlanner;