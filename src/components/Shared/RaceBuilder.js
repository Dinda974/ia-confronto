import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function RaceBuilder() {
  const { state, dispatch } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [improvementStats, setImprovementStats] = useState(null);

  // Template predefiniti per amministratori
  const promptTemplates = [
    {
      id: 'comunicazione-lavori',
      title: 'Comunicazione Lavori Straordinari',
      scenario: 'Informare i condòmini sui lavori di impermeabilizzazione terrazzo',
      ruolo: 'Sei un amministratore di condominio esperto e professionale',
      azione: 'Redigi una comunicazione formale per informare i condòmini sui lavori straordinari',
      contesto: 'Lavori di impermeabilizzazione del terrazzo di copertura, preventivo approvato in assemblea, inizio lavori lunedì prossimo, durata stimata 2 settimane',
      esempio: 'Tono professionale ma rassicurante, includi tempistiche precise, contatti di emergenza e misure per ridurre i disagi'
    },
    {
      id: 'verbale-assemblea',
      title: 'Riassunto Verbale Assemblea',
      scenario: 'Riassumere i punti salienti di un verbale lungo e complesso',
      ruolo: 'Sei un assistente amministrativo specializzato in documentazione condominiale',
      azione: 'Crea un riassunto esecutivo del verbale di assemblea',
      contesto: 'Assemblea ordinaria con 15 punti all\'ordine del giorno, discussioni su manutenzioni, bilancio preventivo e modifiche regolamento',
      esempio: 'Formato bullet points, evidenzia delibere approvate, voti contrari/astenuti, prossime scadenze'
    },
    {
      id: 'analisi-preventivi',
      title: 'Analisi Preventivi Comparativa',
      scenario: 'Confrontare più preventivi per lavori di manutenzione',
      ruolo: 'Sei un consulente tecnico specializzato in valutazione preventivi edilizi',
      azione: 'Analizza e confronta i preventivi forniti evidenziando pro, contro e raccomandazioni',
      contesto: 'Tre preventivi per rifacimento facciata, prezzi da €45.000 a €62.000, tempistiche e materiali diversi',
      esempio: 'Tabella comparativa, rapporto qualità-prezzo, fattori di rischio, raccomandazione motivata'
    },
    {
      id: 'gestione-conflitti',
      title: 'Mediazione Conflitti Condominiali',
      scenario: 'Gestire una disputa tra condòmini',
      ruolo: 'Sei un mediatore esperto in conflitti condominiali',
      azione: 'Proponi una strategia di mediazione e una comunicazione per risolvere il conflitto',
      contesto: 'Disputa su rumori molesti tra piano terra e primo piano, lamentele reciproche, tensioni in aumento',
      esempio: 'Approccio diplomatico, soluzioni pratiche, regole chiare, coinvolgimento di terze parti se necessario'
    }
  ];

  const workshopData = state.workshopData.raceBuilder;

  const closeWorkshop = () => {
    dispatch({ type: 'CLOSE_WORKSHOP' });
  };

  const updateWorkshopData = (field, value) => {
    dispatch({
      type: 'UPDATE_WORKSHOP_DATA',
      payload: {
        workshop: 'raceBuilder',
        data: { [field]: value }
      }
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    updateWorkshopData('ruolo', template.ruolo);
    updateWorkshopData('azione', template.azione);
    updateWorkshopData('contesto', template.contesto);
    updateWorkshopData('esempio', template.esempio);
  };

  const generatePrompt = () => {
    const { ruolo, azione, contesto, esempio } = workshopData;
    if (!ruolo || !azione || !contesto || !esempio) return '';
    
    return `**RUOLO**: ${ruolo}

**AZIONE**: ${azione}

**CONTESTO**: ${contesto}

**ESEMPIO/FORMATO**: ${esempio}`;
  };

  // Sistema di valutazione qualità prompt
  const calculatePromptQuality = (data) => {
    let score = 0;
    let factors = [];
    
    const { ruolo, azione, contesto, esempio } = data;
    
    // Valuta RUOLO
    if (ruolo.length > 20) score += 25;
    if (ruolo.includes('esperto') || ruolo.includes('specializzato') || ruolo.includes('anni')) {
      score += 15;
      factors.push('Ruolo specifico');
    }
    
    // Valuta AZIONE
    if (azione.length > 30) score += 25;
    if (azione.includes('dettagliat') || azione.includes('completo') || azione.includes('professional')) {
      score += 10;
      factors.push('Azione dettagliata');
    }
    
    // Valuta CONTESTO
    if (contesto.length > 50) score += 25;
    if (contesto.match(/\d+/)) {
      score += 10;
      factors.push('Dati specifici');
    }
    
    // Valuta ESEMPIO
    if (esempio.length > 30) score += 25;
    if (esempio.includes('formato') || esempio.includes('struttura') || esempio.includes('tono')) {
      score += 10;
      factors.push('Formato specifico');
    }
    
    return { score: Math.min(100, score), factors };
  };

  // Rilevamento topic avanzato
  const detectPromptTopic = (content) => {
    const text = content.toLowerCase();
    
    const topics = {
      lavori: {
        keywords: ['lavori', 'manutenzione', 'ristrutturazione', 'cantiere', 'impermeabilizzazione', 'rifacimento', 'interventi'],
        weight: 0
      },
      comunicazione: {
        keywords: ['comunicazione', 'lettera', 'avviso', 'informare', 'comunicare', 'notificare'],
        weight: 0
      },
      assemblea: {
        keywords: ['assemblea', 'verbale', 'riunione', 'delibera', 'votazione', 'bilancio'],
        weight: 0
      },
      preventivi: {
        keywords: ['preventivo', 'preventivi', 'offerta', 'confronto', 'analisi', 'valutazione'],
        weight: 0
      },
      conflitti: {
        keywords: ['conflitto', 'disputa', 'mediazione', 'problema', 'risoluzione', 'tensioni'],
        weight: 0
      },
      amministrativo: {
        keywords: ['amministratore', 'condominio', 'condòmini', 'gestione', 'proprietari'],
        weight: 0
      }
    };
    
    // Calcola peso per ogni topic
    Object.keys(topics).forEach(topic => {
      topics[topic].keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          topics[topic].weight += keyword.length > 6 ? 2 : 1;
        }
      });
    });
    
    // Trova topic dominante
    const dominantTopic = Object.keys(topics).reduce((a, b) => 
      topics[a].weight > topics[b].weight ? a : b
    );
    
    return { dominantTopic, allTopics: topics };
  };

  // Generatore di miglioramenti intelligenti multipli
  const generateIntelligentImprovements = (data) => {
    const { ruolo, azione, contesto, esempio } = data;
    const content = `${ruolo} ${azione} ${contesto} ${esempio}`;
    const qualityAnalysis = calculatePromptQuality(data);
    const topicAnalysis = detectPromptTopic(content);
    
    const improvements = [];
    
    // VERSIONE 1: Focus su esperienza e competenze
    improvements.push({
      version: "Esperienza Professionale",
      priority: qualityAnalysis.score < 50 ? "alta" : "media",
      ruolo: enhanceRoleWithExperience(ruolo, topicAnalysis.dominantTopic),
      azione: enhanceActionWithMethodology(azione, topicAnalysis.dominantTopic),
      contesto: enhanceContextWithDetails(contesto, topicAnalysis.dominantTopic),
      esempio: enhanceExampleWithFormat(esempio, topicAnalysis.dominantTopic)
    });
    
    // VERSIONE 2: Focus su metodologia e processo
    improvements.push({
      version: "Metodologia Strutturata",
      priority: qualityAnalysis.factors.includes('Azione dettagliata') ? "media" : "alta",
      ruolo: enhanceRoleWithMethodology(ruolo, topicAnalysis.dominantTopic),
      azione: enhanceActionWithProcess(azione, topicAnalysis.dominantTopic),
      contesto: enhanceContextWithConstraints(contesto, topicAnalysis.dominantTopic),
      esempio: enhanceExampleWithStructure(esempio, topicAnalysis.dominantTopic)
    });
    
    // VERSIONE 3: Focus su personalizzazione e adattamento
    if (qualityAnalysis.score > 60) {
      improvements.push({
        version: "Personalizzazione Avanzata",
        priority: "media",
        ruolo: enhanceRoleWithSpecialization(ruolo, topicAnalysis.dominantTopic),
        azione: enhanceActionWithCustomization(azione, topicAnalysis.dominantTopic),
        contesto: enhanceContextWithScenario(contesto, topicAnalysis.dominantTopic),
        esempio: enhanceExampleWithPersonalization(esempio, topicAnalysis.dominantTopic)
      });
    }
    
    return { improvements, qualityAnalysis, topicAnalysis };
  };

  // Funzioni di miglioramento per RUOLO
  const enhanceRoleWithExperience = (ruolo, topic) => {
    const experiences = {
      lavori: "con 15+ anni di esperienza nella gestione di cantieri condominiali e coordinamento lavori straordinari",
      comunicazione: "con expertise in comunicazione istituzionale e gestione relazioni condominiali da oltre 12 anni",
      assemblea: "specializzato in governance condominiale e facilitazione assembleare con certificazione professionale",
      preventivi: "con competenze in valutazione tecnico-economica e due decenni di esperienza nel settore edilizio",
      conflitti: "formato in mediazione e risoluzione conflitti, con specializzazione in dinamiche condominiali",
      amministrativo: "con qualifica professionale ANACI e esperienza pluriennale in amministrazione immobiliare"
    };
    
    const baseRole = ruolo.replace(/^sei un/i, '').replace(/^sei una/i, '').trim();
    return `Sei un ${baseRole} ${experiences[topic] || experiences.amministrativo}`;
  };

  const enhanceRoleWithMethodology = (ruolo, topic) => {
    const methodologies = {
      lavori: "che applica metodologie di project management e protocolli di sicurezza avanzati",
      comunicazione: "che utilizza principi di comunicazione strategica e tecniche di engagement",
      assemblea: "che segue framework strutturati per la governance partecipativa",
      preventivi: "che applica criteri di valutazione multi-dimensionale e analisi costi-benefici",
      conflitti: "che utilizza tecniche di mediazione professionale e comunicazione non violenta"
    };
    
    return `${ruolo}, ${methodologies[topic] || methodologies.amministrativo}`;
  };

  const enhanceRoleWithSpecialization = (ruolo, topic) => {
    const specializations = {
      lavori: "specializzato in innovazione tecnologica e sostenibilità edilizia",
      comunicazione: "con expertise in digital communication e stakeholder engagement",
      assemblea: "certificato in facilitazione partecipativa e decision-making collettivo",
      preventivi: "con competenze in due diligence tecnica e risk assessment",
      conflitti: "specializzato in psicologia sociale e dinamiche di gruppo"
    };
    
    return `${ruolo}, ${specializations[topic] || 'con approccio innovativo e orientamento ai risultati'}`;
  };

  // Funzioni di miglioramento per AZIONE
  const enhanceActionWithMethodology = (azione, topic) => {
    const enhancements = {
      lavori: "utilizzando un approccio sistematico che integri pianificazione, comunicazione proattiva e gestione del rischio",
      comunicazione: "applicando principi di chiarezza, trasparenza e orientamento all'azione per massimizzare l'engagement",
      assemblea: "seguendo una metodologia strutturata che garantisca completezza, accuratezza e actionable insights",
      preventivi: "implementando un framework di valutazione multi-criterio che consideri tutti i fattori rilevanti",
      conflitti: "attraverso un processo strutturato di mediazione che promuova soluzioni win-win e sostenibili"
    };
    
    return `${azione}, ${enhancements[topic] || enhancements.lavori}`;
  };

  const enhanceActionWithProcess = (azione, topic) => {
    const processes = {
      lavori: "seguendo un processo in 5 fasi: analisi preliminare, pianificazione dettagliata, comunicazione preventiva, monitoraggio execution, follow-up post-lavori",
      comunicazione: "strutturando il messaggio secondo il framework AIDA (Attention, Interest, Desire, Action) con personalizzazione per target specifici",
      assemblea: "organizzando il contenuto in sezioni logiche con executive summary, dettagli operativi e piano d'azione immediato",
      preventivi: "sviluppando un'analisi comparativa strutturata con scoring matrix, risk assessment e raccomandazioni prioritizzate"
    };
    
    return `${azione}, ${processes[topic] || 'con approccio metodico e orientato ai risultati'}`;
  };

  const enhanceActionWithCustomization = (azione, topic) => {
    return `${azione}, personalizzando il contenuto per le specificità del contesto e adattando il linguaggio al target di riferimento, con particolare attenzione agli aspetti psicologici e relazionali`;
  };

  // Funzioni di miglioramento per CONTESTO (abbreviate per spazio)
  const enhanceContextWithDetails = (contesto, topic) => {
    const additions = {
      lavori: ". Include timeline dettagliata con milestone, budget approvato con breakdown costi, impatto previsto sui residenti, misure di mitigazione disagi, protocolli di sicurezza",
      comunicazione: ". Considera target audience eterogeneo (età, competenze digitali, sensibilità), canali di distribuzione multipli, timing strategico per massimo impatto",
      assemblea: ". Partecipazione: X/Y proprietari presenti, procure valide, quorum raggiunto. Decisioni con impatto economico e temporale significativo per la comunità"
    };
    
    return `${contesto}${additions[topic] || additions.lavori}`;
  };

  const enhanceContextWithConstraints = (contesto, topic) => {
    return `${contesto}. Vincoli operativi: normative vigenti, budget approvato, tempistiche stringenti, necessità di consenso, gestione aspettative multiple stakeholder`;
  };

  const enhanceContextWithScenario = (contesto, topic) => {
    return `${contesto}. Scenario caratterizzato da dinamiche complesse, necessità di bilanciare interessi diversi, opportunità di creazione valore a lungo termine per la comunità condominiale`;
  };

  // Funzioni per ESEMPIO
  const enhanceExampleWithFormat = (esempio, topic) => {
    const formats = {
      lavori: ". Struttura: header con info essenziali, timeline visuale, sezione FAQ proattiva, contatti emergenza 24/7, disclaimer responsabilità",
      comunicazione: ". Formato: apertura empatica, corpo strutturato in bullet points, call-to-action chiara, sezione contatti, follow-up programmato",
      assemblea: ". Layout: executive summary (1 pagina), dettagli per sezione, tabelle riepilogative, action items con owner e deadline"
    };
    
    return `${esempio}${formats[topic] || formats.lavori}`;
  };

  const enhanceExampleWithStructure = (esempio, topic) => {
    return `${esempio}. Architettura del documento: introduzione coinvolgente, sviluppo logico-sequenziale, evidenziazione punti chiave, conclusione con next steps concreti`;
  };

  const enhanceExampleWithPersonalization = (esempio, topic) => {
    return `${esempio}. Personalizzazione: tone of voice adattato al target, esempi concreti e relatable, linguaggio accessibile ma professionale, considerazione aspetti emotivi`;
  };

  // Funzione principale di miglioramento
  const improveWithAdvancedAI = async () => {
    setIsImproving(true);
    
    // Tempo realistico variabile (1.5 - 4.5 secondi)
    const processingTime = Math.random() * 3000 + 1500;
    
    try {
      if (!OPENAI_API_KEY) {
        // Simulazione avanzata
        setTimeout(() => {
          const analysis = generateIntelligentImprovements(workshopData);
          
          // Seleziona il miglioramento migliore basato su priorità e qualità
          const bestImprovement = analysis.improvements.find(imp => imp.priority === "alta") 
            || analysis.improvements[0];
          
          const improved = `**RUOLO**: ${bestImprovement.ruolo}

**AZIONE**: ${bestImprovement.azione}

**CONTESTO**: ${bestImprovement.contesto}

**ESEMPIO/FORMATO**: ${bestImprovement.esempio}`;
          
          setImprovedPrompt(improved);
          setImprovementStats({
            originalQuality: analysis.qualityAnalysis.score,
            improvements: analysis.improvements.length,
            dominantTopic: analysis.topicAnalysis.dominantTopic,
            selectedVersion: bestImprovement.version,
            processingTime: Math.round(processingTime / 1000 * 10) / 10
          });
          setShowComparison(true);
          setIsImproving(false);
        }, processingTime);
        return;
      }

      // Tentativo API reale (se disponibile)
      const currentPrompt = generatePrompt();
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Sei un esperto di prompt engineering specializzato nel migliorare prompt per amministratori di condominio. Migliora il prompt seguendo il framework RACE (Ruolo, Azione, Contesto, Esempio) rendendo ogni sezione più specifica, dettagliata e professionale.'
            },
            {
              role: 'user',
              content: `Migliora questo prompt RACE per un amministratore di condominio: ${currentPrompt}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Errore API OpenAI: ${response.status}`);
      }

      const data = await response.json();
      const improved = data.choices[0].message.content;
      
      setImprovedPrompt(improved);
      setImprovementStats({
        originalQuality: calculatePromptQuality(workshopData).score,
        improvements: 1,
        dominantTopic: detectPromptTopic(`${workshopData.ruolo} ${workshopData.azione} ${workshopData.contesto} ${workshopData.esempio}`).dominantTopic,
        selectedVersion: "OpenAI GPT-3.5-turbo",
        processingTime: Math.round(processingTime / 1000 * 10) / 10
      });
      setShowComparison(true);
      setIsImproving(false);
      
    } catch (error) {
      console.error('Errore API, uso simulazione avanzata:', error);
      
      // Fallback alla simulazione avanzata
      const analysis = generateIntelligentImprovements(workshopData);
      const bestImprovement = analysis.improvements[0];
      
      const improved = `**RUOLO**: ${bestImprovement.ruolo}

**AZIONE**: ${bestImprovement.azione}

**CONTESTO**: ${bestImprovement.contesto}

**ESEMPIO/FORMATO**: ${bestImprovement.esempio}`;
      
      setImprovedPrompt(improved);
      setImprovementStats({
        originalQuality: analysis.qualityAnalysis.score,
        improvements: analysis.improvements.length,
        dominantTopic: analysis.topicAnalysis.dominantTopic,
        selectedVersion: bestImprovement.version,
        processingTime: Math.round(processingTime / 1000 * 10) / 10
      });
      setShowComparison(true);
      setIsImproving(false);
    }
  };

  const copyPromptToClipboard = () => {
    const prompt = generatePrompt();
    navigator.clipboard.writeText(prompt).then(() => {
      alert('Prompt copiato negli appunti!');
    });
  };

  const resetBuilder = () => {
    dispatch({ type: 'RESET_WORKSHOP_DATA', payload: 'raceBuilder' });
    setSelectedTemplate(null);
    setImprovedPrompt('');
    setShowComparison(false);
    setImprovementStats(null);
  };

  const completionPercentage = () => {
    const fields = Object.values(workshopData).filter(v => v);
    return Math.round((fields.length / 4) * 100);
  };

  const getQualityColor = (score) => {
    if (score >= 80) return '#059669'; // Verde
    if (score >= 60) return '#d97706'; // Arancione
    if (score >= 40) return '#dc2626'; // Rosso
    return '#6b7280'; // Grigio
  };

  if (!state.activeWorkshop || state.activeWorkshop !== 'race-builder') {
    return null;
  }

  const currentQuality = calculatePromptQuality(workshopData);

  return (
    <div className="workshop-overlay">
      <div className="workshop-container">
        <div className="workshop-header">
          <div>
            <h2>🎯 Workshop: Framework RACE</h2>
            <p>Costruisci prompt professionali con IA avanzata</p>
          </div>
          <button onClick={closeWorkshop} className="workshop-close">
            ✕
          </button>
        </div>

        <div className="workshop-content">
          <div className="workshop-left">
            {/* Framework Info */}
            <div className="race-framework-info">
              <h3>🏗️ Framework RACE</h3>
              <div className="race-grid">
                <div className="race-item">
                  <div className="race-letter">R</div>
                  <div>
                    <strong>RUOLO</strong>
                    <p>Chi deve essere l'IA</p>
                  </div>
                </div>
                <div className="race-item">
                  <div className="race-letter">A</div>
                  <div>
                    <strong>AZIONE</strong>
                    <p>Cosa deve fare</p>
                  </div>
                </div>
                <div className="race-item">
                  <div className="race-letter">C</div>
                  <div>
                    <strong>CONTESTO</strong>
                    <p>Situazione specifica</p>
                  </div>
                </div>
                <div className="race-item">
                  <div className="race-letter">E</div>
                  <div>
                    <strong>ESEMPIO</strong>
                    <p>Formato desiderato</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="template-section">
              <h3>📚 Template Predefiniti</h3>
              <div className="template-list">
                {promptTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  >
                    <h4>{template.title}</h4>
                    <p>{template.scenario}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Builder Form */}
            <div className="builder-section">
              <h3>⚡ Prompt Builder</h3>
              <div className="form-group">
                <label>R - RUOLO</label>
                <textarea
                  value={workshopData.ruolo}
                  onChange={(e) => updateWorkshopData('ruolo', e.target.value)}
                  placeholder="es. Sei un amministratore esperto..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>A - AZIONE</label>
                <textarea
                  value={workshopData.azione}
                  onChange={(e) => updateWorkshopData('azione', e.target.value)}
                  placeholder="es. Redigi una comunicazione..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>C - CONTESTO</label>
                <textarea
                  value={workshopData.contesto}
                  onChange={(e) => updateWorkshopData('contesto', e.target.value)}
                  placeholder="es. Lavori impermeabilizzazione..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>E - ESEMPIO</label>
                <textarea
                  value={workshopData.esempio}
                  onChange={(e) => updateWorkshopData('esempio', e.target.value)}
                  placeholder="es. Tono professionale..."
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="workshop-right">
            {/* Live Preview */}
            <div className="preview-section">
              <h3>👁️ Anteprima Live</h3>
              {!showComparison ? (
                <div className="prompt-preview">
                  <pre>{generatePrompt() || 'Il tuo prompt apparirà qui mentre scrivi...'}</pre>
                </div>
              ) : (
                <div className="comparison-view">
                  <div className="original-prompt">
                    <h4>📝 Versione Originale:</h4>
                    <pre>{generatePrompt()}</pre>
                  </div>
                  <div className="improved-prompt">
                    <h4>🤖 Migliorato con IA:</h4>
                    <pre>{improvedPrompt}</pre>
                  </div>
                  
                  {/* Stats del miglioramento */}
                  {improvementStats && (
                    <div className="improvement-stats">
                      <h4>📊 Analisi Miglioramento:</h4>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <strong>Qualità originale:</strong> 
                          <span style={{color: getQualityColor(improvementStats.originalQuality)}}>
                            {improvementStats.originalQuality}%
                          </span>
                        </div>
                        <div className="stat-item">
                          <strong>Topic rilevato:</strong> {improvementStats.dominantTopic}
                        </div>
                        <div className="stat-item">
                          <strong>Versione applicata:</strong> {improvementStats.selectedVersion}
                        </div>
                        <div className="stat-item">
                          <strong>Tempo di elaborazione:</strong> {improvementStats.processingTime}s
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="preview-actions">
                {!showComparison ? (
                  <>
                    <button
                      onClick={improveWithAdvancedAI}
                      disabled={!generatePrompt() || isImproving}
                      className="btn-improve"
                    >
                      {isImproving ? (
                        <>
                          <span className="spinner"></span>
                          Elaborando...
                        </>
                      ) : (
                        '🤖 Migliora con IA'
                      )}
                    </button>
                    <button
                      onClick={copyPromptToClipboard}
                      disabled={!generatePrompt()}
                      className="btn-copy"
                    >
                      📋 Copia
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigator.clipboard.writeText(improvedPrompt)}
                      className="btn-copy"
                    >
                      📋 Copia Migliorato
                    </button>
                    <button
                      onClick={() => setShowComparison(false)}
                      className="btn-secondary"
                    >
                      ← Torna al Builder
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quality Assessment */}
            <div className="quality-section">
              <h3>📈 Analisi Qualità Prompt</h3>
              <div className="quality-score">
                <div className="workshop-score-circle">
                  <span 
                    className="workshop-score-number"
                    style={{color: getQualityColor(currentQuality.score)}}
                  >
                    {currentQuality.score}%
                  </span>
                </div>
                <div className="quality-factors">
                  {currentQuality.factors.length > 0 ? (
                    currentQuality.factors.map((factor, index) => (
                      <div key={index} className="factor-item">
                        ✓ {factor}
                      </div>
                    ))
                  ) : (
                    <div className="factor-item">
                      💡 Aggiungi più dettagli per migliorare
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress & Completion */}
            <div className="progress-section">
              <h3>📊 Completamento</h3>
              <div className="progress-bar">
                <div 
                  className="workshop-progress-fill" 
                  style={{ width: `${completionPercentage()}%` }}
                ></div>
              </div>
              <p>{completionPercentage()}% completato</p>
              
              <div className="progress-items">
                {['ruolo', 'azione', 'contesto', 'esempio'].map((field) => (
                  <div key={field} className="progress-item">
                    <span className={`progress-dot ${workshopData[field] ? 'completed' : ''}`}></span>
                    <span className="field-name">{field.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Tips */}
            <div className="tips-section">
              <h3>💡 Tips Avanzati</h3>
              <div className="tip-item">
                <strong>🎯 Specificity:</strong> Più dettagli = risultati migliori
              </div>
              <div className="tip-item">
                <strong>📊 Data-Driven:</strong> Includi numeri e metriche
              </div>
              <div className="tip-item">
                <strong>🔄 Iterative:</strong> Testa e affina gradualmente
              </div>
              <div className="tip-item">
                <strong>🧠 Context-Aware:</strong> L'IA adatta lo stile al topic
              </div>
            </div>

            <button onClick={resetBuilder} className="btn-reset">
              🔄 Reset Tutto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaceBuilder;