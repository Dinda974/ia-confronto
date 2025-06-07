import React from 'react';
import { useApp } from '../../contexts/AppContext';
import RaceBuilder from './RaceBuilder';
import PromptOptimizer from './PromptOptimizer';
import BiasSimulator from './BiasSimulator';  // ← AGGIUNGI questa riga
import RoiPlanner from './RoiPlanner';

function ModuleContent() {
  const { state, dispatch } = useApp(); // AGGIUNGI dispatch
  
  if (!state.currentModule) {
    return null;
  }

  const moduleData = getModuleContent(state.currentModule);
  
  // Funzione per aprire workshop
  const openWorkshop = (workshopType) => {
    dispatch({ type: 'OPEN_WORKSHOP', payload: workshopType });
  };

  // Funzione per rilevare se una sezione ha workshop
  const hasWorkshop = (section) => {
    const title = section.title.toLowerCase();
    return title.includes('workshop') || 
           title.includes('laboratorio') || 
           (title.includes('bias') && title.includes('algoritmici')) ||
           title.includes('costruire');
  };

  // Funzione per determinare il tipo di workshop
  const getWorkshopType = (section, moduleId) => {
    const title = section.title.toLowerCase();
    
    if (title.includes('framework race') || (moduleId === 1 && title.includes('workshop'))) {
      return 'race-builder';
    }
    if (title.includes('laboratorio') || (moduleId === 2 && title.includes('laboratorio'))) {
      return 'prompt-optimizer';
    }
    if (title.includes('bias') && title.includes('algoritmici')) {
      return 'bias-simulator';
    }
    if (moduleId === 4 && title.includes('costruire')) {
      return 'roi-planner';
    }
    return null;
  };

  // Funzione per ottenere il testo del pulsante
  const getWorkshopButtonText = (workshopType) => {
    switch (workshopType) {
      case 'race-builder':
        return '🎯 Prompt Builder RACE';
      case 'prompt-optimizer':
        return '🧠 Prompt Optimizer Lab';  // ← Assicurati che questo ci sia
      case 'bias-simulator':           
        return '⚖️ Simula Bias Algoritmici';
      case 'roi-planner':
        return '📊 Pianifica ROI Implementazione';
      default:
        return '⚡ Apri Workshop';
    }
  };
  
  return (
    <>
    <div className="module-content-detail">
      <div className="container">
        <div className="module-header">
          <h2>{moduleData.icon} {moduleData.title}</h2>
          <p className="module-subtitle">{moduleData.subtitle}</p>
          <div className="module-meta">
            <span>⏱️ {moduleData.duration} minuti</span>
            <span>📍 Modulo {state.currentModule}/4</span>
          </div>
        </div>
        
        <div className="module-sections">
          {moduleData.sections.map((section, index) => {
            const workshopType = getWorkshopType(section, state.currentModule);
            
            return (
              <div key={index} className="module-section">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                {section.keyPoints && (
                  <ul className="key-points">
                    {section.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
                
                {/* WORKSHOP BUTTON - Solo se la sezione ha un workshop */}
                {hasWorkshop(section) && workshopType && (
                  <div className="workshop-trigger">
                    <button
                      onClick={() => openWorkshop(workshopType)}
                      className="btn-workshop"
                    >
                      {getWorkshopButtonText(workshopType)}
                    </button>
                    <p className="workshop-hint">
                      💡 Sessione interattiva per mettere in pratica i concetti appena appresi
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <RaceBuilder />
    <PromptOptimizer />
    <BiasSimulator />
    <RoiPlanner />
    </>
  );
}

function getModuleContent(moduleId) {
  const modules = {
    1: {
      title: "Dall'Euforia alla Strategia",
      subtitle: "L'Evoluzione dell'IA nell'Amministrazione Condominiale",
      icon: "🚀",
      duration: 75,
      sections: [
        {
          title: "Apertura e Riconnessione: Dal 'Se' al 'Come' Strategico",
          description: "L'evoluzione della conversazione sull'IA: non più sperimentazione, ma confronto strategico quotidiano.",
          keyPoints: [
            "Velocità evolutiva dell'IA: ogni fase dura la metà della precedente",
            "Dall'approccio occasionale al partner strategico quotidiano",
            "Focus shift: dal 'se usare l'IA' al 'come usarla strategicamente'"
          ],
          duration: "5 minuti"
        },
        {
          title: "Aggiornamenti Express: Le Rivoluzioni degli Ultimi Mesi",
          description: "Panoramica delle innovazioni significative che impattano direttamente la professione dell'amministratore.",
          keyPoints: [
            "Claude Sonnet 4: analisi documenti voluminosi (capitolati 100+ pagine)",
            "ChatGPT Search Integration: normative aggiornate in tempo reale", 
            "Gemini 2.0 + Deep Research: IA come consulente senior per analisi complesse",
            "Il cambio di paradigma: da strumento occasionale a partner strategico"
          ],
          duration: "10 minuti"
        },
        {
          title: "L'IA Oltre l'Automazione: Impatto Strategico e Trasformativo",
          description: "Esplorare il potenziale dell'IA come partner strategico per ridefinire il ruolo dell'amministratore.",
          keyPoints: [
            "Livello 1 - Automazione: comunicazioni standard, template, FAQ",
            "Livello 2 - Augmentation: analisi predittiva, consulenza supportata, gestione proattiva",
            "Livello 3 - Transformation: partner strategico, facilitatore comunità intelligenti"
          ],
          duration: "15 minuti"
        },
        {
          title: "Workshop Flash: Il Framework RACE per Prompt Efficaci", 
          description: "Metodologia pratica per costruire prompt professionali che garantiscono risultati consistenti.",
          keyPoints: [
            "R - Ruolo: Chi deve essere l'IA per voi",
            "A - Azione: Cosa deve fare esattamente", 
            "C - Contesto: Situazione specifica",
            "E - Esempio/Formato: Come deve essere l'output"
          ],
          duration: "45 minuti"
        }
      ]
    },
    
    2: {
      title: "L'Amministratore Aumentato",
      subtitle: "Nuove Competenze e Prompt Engineering Avanzato",
      icon: "🧠", 
      duration: 90,
      sections: [
        {
          title: "Dall'Operatività alla Strategia: Il Nuovo Focus dell'Amministratore",
          description: "L'IA come 'collaboratore digitale' che gestisce attività operative, liberando tempo per consulenza strategica.",
          keyPoints: [
            "Da mero esecutore a manager e consulente strategico del 'bene condominio'",
            "L'efficienza guadagnata deve tradursi in riqualificazione verso attività di maggior valore",
            "Focus su problem solving complesso e gestione relazioni umane"
          ],
          duration: "15 minuti"
        },
        {
          title: "I Nuovi Volti dell'Amministratore del Futuro",
          description: "Evoluzione del ruolo in figure complementari per affrontare la complessità crescente.",
          keyPoints: [
            "Manager del Patrimonio Digitale: gestisce e protegge dati condominiali IoT",
            "Analista Predittivo: interpreta output IA per anticipare problemi",
            "Facilitatore di Comunità Intelligenti: promuove tecnologie sostenibili",
            "Consulente Proattivo: offre consulenza mirata basata su analisi dati",
            "Innovatore del Mercato: identifica nuovi servizi a valore aggiunto"
          ],
          duration: "15 minuti"
        },
        {
          title: "Il Fattore Umano Insostituibile",
          description: "Competenze umane che rimangono cruciali nell'era dell'IA.",
          keyPoints: [
            "Empatia e Intelligenza Emotiva: gestire situazioni delicate",
            "Negoziazione e Mediazione: dinamiche interpersonali complesse",
            "Pensiero Critico: valutare output IA, considerare implicazioni etiche",
            "Costruzione di Fiducia: il rapporto fiduciario si basa sull'interazione umana"
          ],
          duration: "20 minuti"
        },
        {
          title: "Prompt Engineering Avanzato: Oltre il Framework RACE",
          description: "Tecniche sofisticate per problemi complessi e casi d'uso avanzati.",
          keyPoints: [
            "Chain of Thought: guidare l'IA step-by-step per problemi multi-fase",
            "Role Playing Multiplo: analizzare situazioni da più prospettive",
            "Iterazione Guidata: sviluppo progressivo documenti complessi",
            "Validazione Automatica: auto-controllo output secondo criteri predefiniti"
          ],
          duration: "25 minuti"
        },
        {
          title: "Laboratorio Pratico: Costruisci il Tuo Prompt Perfetto",
          description: "Personalizzazione estrema delle tecniche apprese su casi reali individuali.",
          keyPoints: [
            "Self-reflection guidata: identificazione necessità ricorrente",
            "Applicazione framework RACE al caso specifico",
            "Test e iterazione su scenario reale del proprio lavoro",
            "Peer review e raffinamento collaborativo"
          ],
          duration: "15 minuti"
        }
      ]
    },

    3: {
      title: "Navigare il Labirinto dell'IA",
      subtitle: "Etica, Normativa e Gestione Responsabile",
      icon: "⚖️",
      duration: 75,
      sections: [
        {
          title: "Data Governance per l'IA in Condominio",
          description: "Fondamenta per un uso responsabile: policy, ruoli, processi e controlli per gestione dati.",
          keyPoints: [
            "Principi chiave: accountability, trasparenza, sicurezza, qualità, minimizzazione",
            "Identificazione dati critici: personali condomini, relativi all'immobile",
            "Gestione ciclo di vita dati: accessi, finalità, conservazione",
            "Qualità input = qualità output IA"
          ],
          duration: "15 minuti"
        },
        {
          title: "Privacy by Design e by Default nell'Era dell'IA",
          description: "Applicazione principi GDPR specificamente per sistemi IA condominiali.",
          keyPoints: [
            "Valutazione ogni applicazione IA per protezione dati personali",
            "Basi giuridiche: consenso, contratto, legittimo interesse, obbligo legale",
            "DPIA obbligatoria per trattamenti ad alto rischio",
            "Caso emblematico: videosorveglianza intelligente"
          ],
          duration: "15 minuti"
        },
        {
          title: "L'AI Act Europeo e DDL Italiano S.1146",
          description: "Prepararsi ai nuovi adempimenti normativi con approccio pratico.",
          keyPoints: [
            "Classificazione rischi: Inaccettabile, Alto, Limitato, Minimo",
            "Obblighi formativi specifici per professionisti iscritti ordini",
            "Modulazione equo compenso basata su competenze IA",
            "Responsabilità professionale evoluta: duty of care tecnologico"
          ],
          duration: "20 minuti"
        },
        {
          title: "Bias Algoritmici e Cybersecurity",
          description: "Riconoscere e mitigare rischi emergenti nella gestione condominiale.",
          keyPoints: [
            "Bias settore-specifici: selezione inquilini, prioritizzazione manutenzioni",
            "Strategie mitigazione: diversificazione dati, audit algoritmici, supervisione umana",
            "Cybersecurity edifici intelligenti: vulnerabilità IoT, contromisure essenziali",
            "Piano di Risposta Incidenti per sistemi IA"
          ],
          duration: "25 minuti"
        }
      ]
    },

    4: {
      title: "Implementare l'IA con Saggezza",
      subtitle: "Gestione del Cambiamento e Visione Futura", 
      icon: "🎯",
      duration: 60,
      sections: [
        {
          title: "Dall'Idea all'Azione: Metodologia Pratica per Valutare e Adottare Soluzioni IA",
          description: "Framework strutturato in 5 fasi per adozione strategica e sostenibile.",
          keyPoints: [
            "1. Identificazione bisogni e opportunità specifiche",
            "2. Analisi soluzioni IA disponibili",
            "3. Valutazione approfondita rischi e benefici (TCO)",
            "4. Pianificazione dettagliata implementazione",
            "5. Monitoraggio continuo e ottimizzazione"
          ],
          duration: "20 minuti"
        },
        {
          title: "Change Management: Guidare l'Adozione dell'IA",
          description: "Gestione efficace del cambiamento nei processi e nella cultura organizzativa.",
          keyPoints: [
            "Superare resistenza staff: coinvolgimento, formazione, rassicurazioni",
            "Comunicare valore ai condomini: trasparenza, benefici, tutela privacy",
            "Creare cultura innovazione: curiosità, sperimentazione, apprendimento continuo",
            "Leadership change management rafforza reputazione amministratore"
          ],
          duration: "15 minuti"
        },
        {
          title: "Tendenze Emergenti e Prospettive Future",
          description: "Panoramica evoluzione settore e posizionamento strategico per dominare il futuro.",
          keyPoints: [
            "Sistemi IA sempre più integrati e autonomi",
            "Cognitive Buildings: apprendimento e adattamento dinamico",
            "Ruolo crescente IA nella sostenibilità e reportistica ESG",
            "Iper-personalizzazione spinta servizi predittivi"
          ],
          duration: "10 minuti"
        },
        {
          title: "Costruire il 'Condominio del Futuro'",
          description: "L'amministratore come agente di innovazione e facilitatore di comunità intelligenti.",
          keyPoints: [
            "Guidare adozione soluzioni per qualità vita, efficienza, sostenibilità",
            "Cogliere opportunità iniziative territoriali e finanziamenti",
            "Posizionamento come pioniere trasformazione settoriale",
            "Vision: condominio intelligente, sostenibile, resiliente, iper-connesso"
          ],
          duration: "15 minuti"
        }
      ]
    }
  };
  
  return modules[moduleId] || null;
}

export default ModuleContent;