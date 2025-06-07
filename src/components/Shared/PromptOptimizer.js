import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

function PromptOptimizer() {
  const { state, dispatch } = useApp();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customInput, setCustomInput] = useState('');

  // Scenari complessi per amministratori
  const complexScenarios = [
    {
      id: 'verbale-complesso',
      title: 'Verbale Assemblea Complessa',
      description: 'Assemblea straordinaria con 12 punti ODG, tensioni tra proprietari',
      context: 'Assemblea straordinaria condominio 45 unità. Discussioni accese su: rifacimento facciata (€180k), cambio amministratore, nuovo regolamento pets, installazione colonnine elettriche. Presenti 32/45, 8 procure. Proprietario Rossi sempre contrario, signora Bianchi leader opposizione. Budget limitato, urgenze manutentive.',
      challenge: 'Creare verbale che documenti tutto mantenendo tono neutrale e professionale',
      expectedOutput: 'Verbale strutturato, sintesi decisioni, voti dettagliati, azioni follow-up'
    },
    {
      id: 'mediazione-conflitto',
      title: 'Mediazione Conflitto Vicinato',
      description: 'Disputa rumorosa tra inquilino piano terra e proprietario primo piano',
      context: 'Inquilino piano terra (famiglia giovane, 2 bambini) vs proprietario primo piano (pensionato 70 anni). Lamentele reciproche: bambini corrono (7-22), musica alta weekend, cane abbaia. Escalation: lettere legali, minacce sfratto. Altri condomini segnalano disagio.',
      challenge: 'Proporre strategia mediazione diplomatica e sostenibile',
      expectedOutput: 'Piano mediazione, regole condivise, meccanismo monitoraggio'
    },
    {
      id: 'analisi-preventivi',
      title: 'Analisi Comparative Preventivi',
      description: 'Valutazione 4 preventivi rifacimento impianto termico centralizzato',
      context: 'Impianto termico 25 anni, inefficiente, costi gas aumentati 40%. 4 preventivi: €85k (caldaia tradizionale), €120k (condensazione), €145k (pompa calore), €170k (geotermico). Incentivi disponibili 65%. Condomini divisi su investimento vs risparmio immediato.',
      challenge: 'Analisi costi-benefici 10 anni, raccomandazione motivata',
      expectedOutput: 'Report comparativo, TCO analysis, scenario risparmio, raccomandazione'
    }
  ];

  // Tecniche avanzate di prompt engineering
  const advancedTechniques = [
    {
      id: 'chain-of-thought',
      name: 'Chain of Thought',
      description: 'Guida l\'IA step-by-step attraverso ragionamento complesso',
      approach: 'Scomposizione problema → Analisi fase-by-fase → Sintesi finale',
      example: 'Prima identifica stakeholder, poi analizza posizioni, infine proponi soluzione',
      useCase: 'Problemi multi-dimensionali, decisioni complesse'
    },
    {
      id: 'role-playing-multiple',
      name: 'Role Playing Multiplo',
      description: 'Analizza situazione da prospettive multiple stakeholder',
      approach: 'Più ruoli → Confronto viewpoint → Bilanciamento interessi',
      example: 'Analizza come amministratore, poi come condomino, poi come fornitore',
      useCase: 'Conflitti, negoziazioni, decisioni collegiali'
    },
    {
      id: 'iterative-refinement',
      name: 'Iterazione Guidata',
      description: 'Sviluppo progressivo attraverso raffinamenti successivi',
      approach: 'Bozza iniziale → Feedback → Miglioramento → Ripetizione',
      example: 'Draft comunicazione → Review critica → Versione migliorata',
      useCase: 'Documenti complessi, comunicazioni sensibili'
    },
    {
      id: 'validation-framework',
      name: 'Validazione Automatica',
      description: 'Auto-controllo output secondo criteri predefiniti',
      approach: 'Output iniziale → Checklist validazione → Correzioni → Versione finale',
      example: 'Verifica: completezza, tono, aspetti legali, chiarezza',
      useCase: 'Documenti formali, controllo qualità'
    }
  ];

  const closeWorkshop = () => {
    dispatch({ type: 'CLOSE_WORKSHOP' });
  };

  const selectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(2);
  };

  const selectTechnique = (technique) => {
    setSelectedTechnique(technique);
    setCurrentStep(3);
  };

  const generateAdvancedPrompt = (scenario, technique) => {
    const prompts = {
      'chain-of-thought': `**ANALISI STRUTTURATA STEP-BY-STEP**

Scenario: ${scenario.context}

Procedi seguendo questi step sequenziali:

STEP 1 - MAPPATURA STAKEHOLDER
- Identifica tutti i soggetti coinvolti
- Analizza interessi e preoccupazioni di ciascuno
- Evidenzia potenziali conflitti di interesse

STEP 2 - ANALISI FATTORI CRITICI  
- Fattori tecnici/normativi da considerare
- Vincoli economici e temporali
- Aspetti relazionali e comunicativi

STEP 3 - GENERAZIONE SOLUZIONI
- Brainstorm 3 approcci diversi
- Valuta pro/contro di ogni opzione
- Considera sostenibilità a lungo termine

STEP 4 - RACCOMANDAZIONE FINALE
- Soluzione ottimale motivata
- Piano implementazione concreto
- Metriche per monitoraggio successo

Mantieni ragionamento esplicito tra ogni step.`,

      'role-playing-multiple': `**ANALISI MULTI-PROSPETTIVA**

Scenario: ${scenario.context}

Analizza la situazione assumendo in sequenza questi ruoli:

🏢 PROSPETTIVA AMMINISTRATORE:
- Responsabilità legali e professionali
- Equilibrio tra tutte le parti
- Efficienza gestionale e reputazione

👥 PROSPETTIVA CONDOMINI COINVOLTI:
- Interessi specifici di ogni parte
- Preoccupazioni e aspettative
- Disponibilità a compromessi

⚖️ PROSPETTIVA LEGALE/NORMATIVA:
- Compliance regolamentare
- Potenziali rischi e responsabilità
- Best practices settoriali

🎯 SINTESI BILANCIATA:
- Confronta le diverse prospettive
- Identifica punti di convergenza
- Proponi soluzione che bilanci tutti gli interessi`,

      'iterative-refinement': `**SVILUPPO ITERATIVO GUIDATO**

Scenario: ${scenario.context}

ITERAZIONE 1 - DRAFT INIZIALE:
Crea una prima versione della soluzione focalizzandoti sui punti essenziali.

ITERAZIONE 2 - REVIEW CRITICA:
Analizza il draft chiedendoti:
- Cosa manca o è poco chiaro?
- Quali aspetti potrebbero creare problemi?
- Come migliorare tono e comunicazione?

ITERAZIONE 3 - RAFFINAMENTO:
Sviluppa versione migliorata incorporando:
- Dettagli mancanti identificati
- Correzioni per problemi potenziali
- Miglioramenti comunicativi

ITERAZIONE 4 - VALIDAZIONE FINALE:
Verifica che la soluzione finale soddisfi:
- Completezza e accuratezza
- Chiarezza e professionalità
- Fattibilità e sostenibilità`,

      'validation-framework': `**FRAMEWORK DI VALIDAZIONE AUTOMATICA**

Scenario: ${scenario.context}

Sviluppa la soluzione e successivamente applicale questo controllo qualità:

CHECKLIST VALIDAZIONE:

✓ COMPLETEZZA:
- Tutti gli aspetti del problema sono affrontati?
- Mancano informazioni o passaggi cruciali?

✓ ACCURATEZZA:
- Le informazioni sono corrette e aggiornate?
- I riferimenti normativi sono appropriati?

✓ CHIAREZZA:
- Il linguaggio è accessibile al target?
- La struttura è logica e scorrevole?

✓ PROFESSIONALITÀ:
- Il tono è appropriato al contesto?
- Rispetta standard professionali del settore?

✓ FATTIBILITÀ:
- La soluzione è realisticamente implementabile?
- Considera vincoli pratici ed economici?

Per ogni punto non validato, proponi correzione specifica.`
    };

    return prompts[technique.id] || '';
  };

  const simulateAdvancedProcessing = async () => {
    setIsProcessing(true);
    
    // Simula elaborazione più lunga per tecniche avanzate
    const processingTime = 3000 + Math.random() * 4000; // 3-7 secondi
    
    setTimeout(() => {
      const mockResults = generateMockResults(selectedScenario, selectedTechnique);
      setResults(mockResults);
      setCurrentStep(4);
      setIsProcessing(false);
    }, processingTime);
  };

  const generateMockResults = (scenario, technique) => {
    // Database completo di tutte le combinazioni scenario-tecnica
    const allResults = {
      // VERBALE COMPLESSO
      'verbale-complesso': {
        'chain-of-thought': {
          quality: 92,
          highlights: ['Mappatura stakeholder completa', 'Analisi conflitti approfondita', 'Soluzioni step-by-step'],
          output: `**VERBALE ASSEMBLEA STRAORDINARIA - ANALISI STRUTTURATA**

**STEP 1 - STAKEHOLDER ANALYSIS:**
- Proprietari favorevoli: Verdi, Neri, Gialli (32%)
- Fronte opposizione: Rossi (leader), Bianchi, Grigi (28%) 
- Indecisi/Astenuti: Blues, Viola (40%)

**STEP 2 - FATTORI CRITICI:**
- Budget limitato vs necessità urgenti
- Conflitto generazionale su investimenti
- Pressione normativa efficienza energetica
- Timeline serrato per incentivi statali

**STEP 3 - SOLUZIONI GRADUATE:**
OPZIONE A: Intervento graduale 3 anni (€60k/anno)
OPZIONE B: Investimento completo con prestito (€180k subito)
OPZIONE C: Soluzione ibrida con priorità (€120k + €60k anno 2)

**STEP 4 - RACCOMANDAZIONE FINALE:**
Approccio ibrido (Opzione C): facciata + efficientamento anno 1 (€120k), 
resto anni 2-3. Finanziamento: 65% incentivi + prestito agevolato.
Monitoraggio: assemblea trimestrale, report mensile avanzamento.`,
          processingSteps: 4,
          reasoning: 'Dettagliato'
        },
        'role-playing-multiple': {
          quality: 88,
          highlights: ['Prospettive multiple', 'Bilanciamento interessi', 'Soluzione diplomatica'],
          output: `**VERBALE ASSEMBLEA - ANALISI MULTI-PROSPETTIVA**

**🏢 PROSPETTIVA AMMINISTRATORE:**
Necessità bilanciare urgenza tecnica con sostenibilità economica. 
Responsabilità: garantire trasparenza, gestire conflitti, proporre soluzione fattibile.
Risk: perdita mandato se gestione inadeguata tensioni.

**👥 PROSPETTIVA CONDOMINI:**
- Favorevoli: "Investimento necessario, aumenta valore immobile, migliora comfort"
- Contrari: "Costi eccessivi in periodo inflazione, alternative più economiche"
- Indecisi: "Servono più informazioni, garanzie sui tempi, rateizzazione"

**⚖️ PROSPETTIVA LEGALE/NORMATIVA:**
Delibera maggioranza qualificata richiesta (art. 1136 CC).
Obbligo efficienza energetica crescente (EU Green Deal).
Tutela minoranze vs interesse collettivo prevalente.

**🎯 SINTESI BILANCIATA:**
Piano pluriennale con prima fase minimale (€80k) per test efficacia,
poi completamento condizionato a risultati positivi. 
Tutela minoranze: opzione uscita volontaria dalla seconda fase.`,
          processingSteps: 4,
          reasoning: 'Multidimensionale'
        },
        'iterative-refinement': {
          quality: 93,
          highlights: ['Sviluppo progressivo', 'Raffinamenti mirati', 'Versione ottimizzata'],
          output: `**VERBALE ASSEMBLEA - VERSIONE FINALE ITERATA**

**ITERAZIONE 1 - DRAFT INIZIALE:**
Verbale base con punti ODG e decisioni principali documentati.

**ITERAZIONE 2 - ANALISI CRITICA:**
Identificati punti di miglioramento:
- Mancanza dettagli votazioni specifiche per ogni punto
- Linguaggio troppo tecnico per alcuni passaggi normativi
- Necessità maggior chiarezza su tempistiche e responsabilità

**ITERAZIONE 3 - RAFFINAMENTO:**
Versione migliorata incorporando:
- Breakdown dettagliato voti (favorevoli/contrari/astenuti per ogni delibera)
- Glossario termini tecnici in appendice per accessibilità
- Timeline visual con milestone, responsabili e deadline

**ITERAZIONE 4 - VERSIONE FINALE:**

**ASSEMBLEA STRAORDINARIA DEL 15.06.2025**
Condominio "Residenza Verde" - Via Roma 123

**SINTESI ESECUTIVA:**
✓ Delibere approvate: 8/12 punti ODG
✓ Investimento totale autorizzato: €180.000
✓ Partecipazione: 89% (32 presenti + 8 procure)

**DECISIONI CHIAVE:**
1. Rifacimento facciata: APPROVATO (35 voti favorevoli, 5 contrari)
2. Prestito bancario: APPROVATO (32 favorevoli, 8 astenuti)  
3. Timeline: Inizio lavori settembre 2025, fine marzo 2026

**PROSSIMI STEP:**
- Contrattualizzazione ditta entro 31 luglio 2025
- Assemblea informativa pre-cantiere: 20 agosto 2025
- Report avanzamento lavori: ogni 15 del mese`,
          processingSteps: 4,
          reasoning: 'Iterativo'
        },
        'validation-framework': {
          quality: 96,
          highlights: ['Standard documentali elevati', 'Conformità normativa', 'Tracciabilità completa'],
          output: `**VERBALE ASSEMBLEA - VERSIONE VALIDATA**

**PROPOSTA INIZIALE:**
Verbale assemblea straordinaria con documentazione decisioni maggiori.

**VALIDAZIONE SISTEMATICA:**

✓ COMPLETEZZA: ✅ VERIFICATA
- Tutti i 12 punti ODG documentati integralmente
- Presenze e procure registrate (32/45 + 8 procure = 89% capitale)
- Votazioni dettagliate con maggioranze richieste per delibera

✓ ACCURATEZZA: ✅ CONFERMATA  
- Cifre budget verificate: €180k rifacimento facciata
- Quote millesimali applicate correttamente per ripartizione
- Riferimenti normativi aggiornati (Codice Civile art. 1131-1139)

✓ CHIAREZZA: ✅ OTTIMIZZATA
- Linguaggio tecnico spiegato in termini accessibili
- Decisioni riassunte in executive summary
- Timeline implementazione chiaramente definita

✓ PROFESSIONALITÀ: ✅ GARANTITA
- Tono neutrale mantenuto anche per discussioni accese
- Posizioni minoritarie documentate rispettosamente
- Standard ANACI per verbali assembleari rispettati

✓ FATTIBILITÀ: ✅ VERIFICATA
- Piano implementazione realistico e dettagliato
- Budget e timeline sostenibili e verificati
- Procedure di monitoraggio definite

**VERBALE FINALE VALIDATO:**
Documento completo con sintesi esecutiva, delibere con dettaglio voti,
cronoprogramma lavori e sistema monitoraggio implementazione.`,
          processingSteps: 5,
          reasoning: 'Validato'
        }
      },

      // MEDIAZIONE CONFLITTO
      'mediazione-conflitto': {
        'chain-of-thought': {
          quality: 90,
          highlights: ['Analisi cause profonde', 'Strategia strutturata', 'Prevenzione recidive'],
          output: `**PIANO MEDIAZIONE CONFLITTO - ANALISI STEP-BY-STEP**

**STEP 1 - MAPPATURA STAKEHOLDER:**
- Famiglia giovane: bisogni crescita bambini, socializzazione
- Pensionato: necessità quiete, rispetto riposo diurno
- Altri condomini: 60% solidali con anziano, 40% comprensivi famiglia
- Amministratore: equilibrio, prevenzione escalation legale

**STEP 2 - ANALISI FATTORI CRITICI:**
- Strutturali: scarso isolamento acustico edificio anni '80
- Comportamentali: mancanza consapevolezza impatto rumore
- Relazionali: comunicazione deteriorata, pregiudizi reciproci
- Legali: regolamento condominiale generico su rumori

**STEP 3 - GENERAZIONE SOLUZIONI:**
A) Mediazione diretta: incontri facilitati + accordo comportamentale
B) Interventi tecnici: isolamento acustico + regolamento dettagliato  
C) Soluzione mista: mediazione + piccoli interventi + monitoraggio

**STEP 4 - RACCOMANDAZIONE:**
Soluzione C: mediazione strutturata + tappeti assorbenti + regolamento
aggiornato + sistema feedback mensile per primi 6 mesi.`,
          processingSteps: 4,
          reasoning: 'Analitico'
        },
        'role-playing-multiple': {
          quality: 87,
          highlights: ['Empatia multi-stakeholder', 'Soluzioni equilibrate', 'Comprensione profonda'],
          output: `**MEDIAZIONE CONFLITTO - PROSPETTIVE MULTIPLE**

**🏠 PROSPETTIVA FAMIGLIA GIOVANE:**
"Bambini hanno diritto a giocare in casa. Già limitiamo molto movimento.
Pensionato esagera, proteste anche per passi normali.
Disponibili a soluzioni ragionevoli ma non rinunciare vivibilità."

**👴 PROSPETTIVA PENSIONATO:**
"Rumori continui dalle 7 alle 22. Salute compromessa, stress accumulato.
Non odio bambini ma serve rispetto fasce riposo.
Pagato appartamento per tranquillità, non chiedo troppo."

**🏢 PROSPETTIVA AMMINISTRATORE:**
Responsabilità mantenere armonia condominiale.
Entrambe parti hanno ragioni valide.
Risk: escalation legale costosa per tutti.

**👥 PROSPETTIVA ALTRI CONDOMINI:**
Preoccupazione per clima generale, alcuni hanno bambini piccoli.
Necessità regole chiare per evitare conflitti futuri.

**🎯 SINTESI EQUILIBRATA:**
Fasce orarie rispetto (8-14 e 16-20 gioco libero, 14-16 e 20-8 silenzio).
Tappeti area gioco + training comportamentale bambini.
Check-in mensili primi 3 mesi per aggiustamenti.`,
          processingSteps: 4,
          reasoning: 'Empatico'
        },
        'iterative-refinement': {
          quality: 90,
          highlights: ['Approccio diplomatico', 'Soluzioni win-win', 'Piano monitoraggio'],
          output: `**PIANO MEDIAZIONE - VERSIONE FINALE ITERATA**

**ITERAZIONE 1 - DRAFT INIZIALE:**
Proposta incontro mediato con regole base orari.

**ITERAZIONE 2 - REVIEW CRITICA:**
Problemi identificati:
- Troppo generico su orari specifici
- Mancano soluzioni tecniche immediate  
- Assente sistema verifica efficacia

**ITERAZIONE 3 - RAFFINAMENTO:**
Piano dettagliato con:
- Orari specifici per diverse attività
- Soluzioni pratiche immediate (tappeti, pantofole)
- Sistema feedback strutturato

**ITERAZIONE 4 - VERSIONE FINALE:**

**FASE 1 - INCONTRI SEPARATI** (Settimana 1)
Ascolto attivo posizioni individuali:
- Famiglia: mappatura esigenze sviluppo bambini vs spazi disponibili
- Pensionato: identificazione momenti critici e soglie tolleranza

**FASE 2 - SESSIONE MEDIATA** (Settimana 2)
Facilitazione dialogo costruttivo:
- Accordo fasce orarie: 21-8 silenzio assoluto, 14-16 rispetto riposo
- Implementazione immediata: tappeti area gioco, pantofole interne
- Training bambini: giochi silenziosi in ore sensibili

**FASE 3 - ACCORDO SCRITTO** (Settimana 3)
Protocollo firmato con impegni specifici:
- Sanzioni progressive per violazioni ripetute
- Sistema escalation: richiamo verbale → scritto → assemblea

**MONITORAGGIO CONTINUATIVO:**
- Check-in telefonico settimanale primo mese
- Valutazione mensile efficacia successivi 2 mesi
- Review trimestrale per aggiustamenti permanenti`,
          processingSteps: 4,
          reasoning: 'Iterativo'
        },
        'validation-framework': {
          quality: 94,
          highlights: ['Controllo qualità completo', 'Validazione sistematica', 'Standard professionali'],
          output: `**SOLUZIONE MEDIAZIONE - VALIDATA COMPLETAMENTE**

**PROPOSTA INIZIALE:**
Piano mediazione 3-fasi: incontri separati + sessione congiunta + monitoraggio.

**VALIDAZIONE SISTEMATICA:**

✓ COMPLETEZZA: ✅ VERIFICATA
- Tutti stakeholder coinvolti: famiglia, pensionato, altri condomini
- Processo completo: diagnosi → mediazione → implementazione → follow-up
- Soluzioni concrete per ogni fase identificata

✓ ACCURATEZZA: ✅ CONFERMATA
- Approccio conforme best practice mediazione professionale
- Tempistiche realistiche: 3 settimane + 3 mesi monitoraggio
- Tecniche validate: ascolto attivo, comunicazione non violenta

✓ CHIAREZZA: ✅ OTTIMIZZATA
- Linguaggio accessibile, evitata terminologia tecnica eccessiva
- Step chiaramente definiti con obiettivi misurabili
- Ruoli e responsabilità specificate per ogni parte

✓ PROFESSIONALITÀ: ✅ GARANTITA
- Tono neutrale e diplomatico mantenuto costantemente
- Rispetto standard deontologici mediazione
- Approccio bilanciato senza favoritismi verso alcuna parte

✓ FATTIBILITÀ: ✅ VERIFICATA
- Implementazione pratica testata in casi similari
- Costi contenuti: solo tempo amministratore + piccoli investimenti
- Scalabilità: modello replicabile per conflitti analoghi

**VERSIONE FINALE VALIDATA:**
Piano mediazione strutturato con protocolli di sicurezza,
check-point valutazione periodica e procedure escalation definite.
Probabilità successo stimata: 85% basata su precedenti similari.`,
          processingSteps: 5,
          reasoning: 'Sistematico'
        }
      },

      // ANALISI PREVENTIVI
      'analisi-preventivi': {
        'chain-of-thought': {
          quality: 94,
          highlights: ['Analisi finanziaria dettagliata', 'Valutazione multi-criterio', 'ROI calcolato'],
          output: `**ANALISI PREVENTIVI IMPIANTO TERMICO - STEP-BY-STEP**

**STEP 1 - MAPPATURA STAKEHOLDER:**
- Condomini cost-conscious: priorità risparmio immediato (40%)
- Condomini eco-oriented: investimenti green long-term (35%)
- Condomini neutrali: seguono raccomandazione tecnica (25%)

**STEP 2 - ANALISI FATTORI CRITICI:**
- Tecnici: efficienza energetica, affidabilità, manutenzione
- Economici: CAPEX, OPEX, incentivi, payback period
- Normativi: compliance efficienza, futuro AI Act edifici
- Operativi: disruption installazione, learning curve

**STEP 3 - VALUTAZIONE OPZIONI:**
A) Tradizionale €85k: basso rischio, ROI negativo
B) Condensazione €120k: equilibrio costi/benefici ottimo  
C) Pompa calore €145k: massima efficienza, payback 7 anni
D) Geotermico €170k: top performance, complessità elevata

**STEP 4 - RACCOMANDAZIONE FINALE:**
Opzione B (Condensazione) con backup plan C.
TCO 10 anni: €98k vs €165k attuale = 41% risparmio.
Implementation: fase 1 caldaia, fase 2 ottimizzazione smart controls.`,
          processingSteps: 4,
          reasoning: 'Finanziario'
        },
        'role-playing-multiple': {
          quality: 89,
          highlights: ['Analisi multi-stakeholder', 'Bilanciamento interessi', 'Compromesso ottimale'],
          output: `**ANALISI PREVENTIVI - PROSPETTIVE MULTIPLE**

**🔧 PROSPETTIVA TECNICA:**
"Caldaia condensazione rappresenta sweet spot: efficienza 95% vs 75% attuale,
tecnologia matura, manutenzione standard. Pompa calore ottima ma richiede
upgrade impianto distribuzione. Geotermico over-engineering per edificio."

**💰 PROSPETTIVA FINANZIARIA:**
"Con incentivi 65%, condensazione costa effettivamente €42k vs €85k tradizionale.
Payback 3.2 anni. Pompa calore payback 5.8 anni. 
Cash flow positivo da anno 4 con condensazione."

**🌱 PROSPETTIVA SOSTENIBILITÀ:**
"Condensazione: -40% emissioni CO2. Pompa calore: -65% emissioni.
Geotermico: -80% ma impatto economico eccessivo.
Obiettivi UE 2030 raggiungibili con opzione B."

**👥 PROSPETTIVA CONDOMINI:**
"Maggioranza preferisce sicurezza investimento vs performance massima.
Preoccupazioni su tecnologie troppo innovative.
Consenso su miglioramento efficienza con costi ragionevoli."

**🎯 SINTESI BILANCIATA:**
Condensazione con predisposizione upgrade futuro.
Soddisfa: contenimento costi + miglioramento significativo + futuro-compatibile.
Plan B: rivalutazione pompa calore tra 5 anni.`,
          processingSteps: 4,
          reasoning: 'Strategico'
        },
        'iterative-refinement': {
          quality: 91,
          highlights: ['Analisi approfondita', 'Comparazione sistematica', 'Raccomandazione motivata'],
          output: `**ANALISI PREVENTIVI - VERSIONE FINALE ITERATA**

**ITERAZIONE 1 - PRIMA ANALISI:**
Confronto base prezzi listino e caratteristiche tecniche principali.

**ITERAZIONE 2 - APPROFONDIMENTO:**
Integrazione analisi TCO 10 anni, calcolo incentivi effettivi,
valutazione track record fornitori, assessment impatto installation.

**ITERAZIONE 3 - OTTIMIZZAZIONE:**
Inclusione feedback tecnico specialista, simulazione scenari energia,
benchmarking contro installazioni similari, risk assessment.

**ITERAZIONE 4 - VERSIONE FINALE:**

**COMPARATIVE ANALYSIS - IMPIANTO TERMICO CENTRALIZZATO**

**OPZIONE A - Caldaia Tradizionale (€85k)**
- Investimento: €85.000 (100% autofinanziamento)
- TCO 10 anni: €165.000 (inclusi consumi stimati)
- Efficienza: 75% (tecnologia standard)
- Incentivi: €0 - ROI: Negativo (-15%)

**OPZIONE B - Caldaia Condensazione (€120k)** ⭐ RACCOMANDATA
- Investimento lordo: €120.000
- Incentivi Conto Termico 65%: -€78.000
- Investimento netto: €42.000  
- TCO 10 anni: €98.000 (vs €180k attuale)
- Efficienza: 95% - Risparmio annuo: €8.200
- ROI: +142% - Payback: 3.2 anni

**OPZIONE C - Pompa Calore (€145k)**
- Investimento netto: €50.750 (post-incentivi)
- TCO 10 anni: €89.000
- Efficienza: COP 4.5 - Risparmio: €9.100/anno
- ROI: +98% - Payback: 5.8 anni
- Note: richiede upgrade distribuzione (+€15k)

**OPZIONE D - Geotermico (€170k)**
- Investimento netto: €59.500
- TCO 10 anni: €85.000 (performance massima)
- Risk: complessità installazione alta, permits complessi
- Timeline: 8-12 mesi vs 2-3 mesi altre opzioni

**RACCOMANDAZIONE FINALE:**
Opzione B (Condensazione) per rapporto costi/benefici ottimale.
Implementation plan: contratto entro luglio, installazione settembre,
test sistema ottobre, operatività completa novembre 2025.`,
          processingSteps: 4,
          reasoning: 'Iterativo'
        },
        'validation-framework': {
          quality: 96,
          highlights: ['Analisi finanziaria rigorosa', 'Compliance normativa', 'Due diligence completa'],
          output: `**ANALISI PREVENTIVI - COMPLETAMENTE VALIDATA**

**PROPOSTA INIZIALE:**
Analisi comparativa 4 preventivi con raccomandazione investimento.

**VALIDAZIONE SISTEMATICA:**

✓ COMPLETEZZA: ✅ VERIFICATA
- Tutti i preventivi analizzati con metodologia uniforme
- Fattori considerati: costi, performance, incentivi, manutenzione, rischi
- Scenari temporali: payback, TCO 10 anni, cash flow analysis

✓ ACCURATEZZA: ✅ CONFERMATA
- Cifre verificate con fornitori e enti erogatori incentivi
- Calcoli TCO basati su consumi storici + proiezioni energetiche
- Benchmark against installazioni comparabili nel territorio

✓ CHIAREZZA: ✅ OTTIMIZZATA
- Terminology tecnica spiegata, tabelle comparative chiare
- Executive summary con raccomandazione evidenziata
- Appendice con dettagli calcoli per trasparenza

✓ PROFESSIONALITÀ: ✅ GARANTITA
- Analisi neutrale basata su dati oggettivi
- Metodologia conforme standard valutativi settore
- Dichiarazione conflitti interesse e assumptions

✓ FATTIBILITÀ: ✅ VERIFICATA
- Timeline implementazione realistic e dettagliata
- Budget verificato con disponibilità finanziarie condominio
- Risk mitigation plan per opzione raccomandata

**REPORT FINALE VALIDATO:**
Raccomandazione Caldaia Condensazione con confidence level 92%.
Expected savings: €82.000 su 10 anni, payback 3.2 anni.
Implementation ready: contratti, permits, financing pre-arranged.`,
          processingSteps: 5,
          reasoning: 'Validato'
        }
      }
    };

    // Restituisce il risultato specifico o un fallback generico
    return allResults[scenario.id]?.[technique.id] || {
      quality: 85,
      highlights: ['Analisi approfondita', 'Approccio sistematico', 'Risultati ottimizzati'],
      output: `**ANALISI COMPLETATA CON ${technique.name.toUpperCase()}**

La tecnica ${technique.name} è stata applicata con successo al scenario "${scenario.title}".

**APPROCCIO UTILIZZATO:**
${technique.approach}

**RISULTATO OTTIMIZZATO:**
Soluzione strutturata che affronta il problema "${scenario.challenge}" 
utilizzando la metodologia ${technique.name} per garantire:

- Analisi approfondita del contesto specifico
- Applicazione sistematica della tecnica selezionata  
- Output ottimizzato per il caso d'uso professionale
- Considerazione degli aspetti pratici e implementativi

**CONTESTO ANALIZZATO:**
${scenario.context}

**RACCOMANDAZIONI:**
La soluzione proposta integra le specificità del settore condominiale
con l'approccio metodologico della tecnica ${technique.name}.`,
      processingSteps: 3,
      reasoning: 'Strutturato'
    };
  };

  const resetWorkshop = () => {
    setSelectedScenario(null);
    setSelectedTechnique(null);
    setResults([]);
    setCurrentStep(1);
    setCustomInput('');
  };

  if (!state.activeWorkshop || state.activeWorkshop !== 'prompt-optimizer') {
    return null;
  }

  return (
    <div className="workshop-overlay">
      <div className="workshop-container">
        <div className="workshop-header">
          <div>
            <h2>🧠 Prompt Optimizer Lab</h2>
            <p>Tecniche avanzate per problemi complessi</p>
          </div>
          <button onClick={closeWorkshop} className="workshop-close">✕</button>
        </div>

        <div className="workshop-content-optimizer">
          {/* SIDEBAR NAVIGATION */}
          <div className="optimizer-sidebar">
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-info">
                  <span className="step-title">Scenario</span>
                  <span className="step-desc">Scegli caso d'uso</span>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-info">
                  <span className="step-title">Tecnica</span>
                  <span className="step-desc">Metodo avanzato</span>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-info">
                  <span className="step-title">Preview</span>
                  <span className="step-desc">Controllo finale</span>
                </div>
              </div>
              
              <div className={`progress-step ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-info">
                  <span className="step-title">Risultati</span>
                  <span className="step-desc">Output ottimizzato</span>
                </div>
              </div>
            </div>

            {/* CURRENT SELECTION INFO */}
            <div className="current-selection">
              {selectedScenario && (
                <div className="selection-item">
                  <div className="selection-label">📋 Scenario:</div>
                  <div className="selection-value">{selectedScenario.title}</div>
                </div>
              )}
              
              {selectedTechnique && (
                <div className="selection-item">
                  <div className="selection-label">⚡ Tecnica:</div>
                  <div className="selection-value">{selectedTechnique.name}</div>
                </div>
              )}
              
              {results && (
                <div className="selection-item">
                  <div className="selection-label">📊 Qualità:</div>
                  <div className="selection-value" style={{color: results.quality >= 90 ? '#059669' : '#d97706'}}>
                    {results.quality}%
                  </div>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
              <button 
                onClick={resetWorkshop}
                className="btn-reset-quick"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="optimizer-main">
            {/* STEP 1: Selezione Scenario */}
            {currentStep === 1 && (
              <div className="main-step">
                <div className="main-step-header">
                  <h3>🎯 Seleziona Scenario Complesso</h3>
                  <p>Scegli una situazione professionale che richiede analisi approfondita</p>
                </div>
                
                <div className="scenarios-grid">
                  {complexScenarios.map(scenario => (
                    <div key={scenario.id} className="scenario-card">
                      <h4>{scenario.title}</h4>
                      <p>{scenario.description}</p>
                      <div className="scenario-details">
                        <div className="detail-item">
                          <strong>Contesto:</strong>
                          <span>{scenario.context.substring(0, 120)}...</span>
                        </div>
                        <div className="detail-item">
                          <strong>Challenge:</strong>
                          <span>{scenario.challenge}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => selectScenario(scenario)}
                        className="btn-select-scenario"
                      >
                        Seleziona Scenario
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Selezione Tecnica */}
            {currentStep === 2 && selectedScenario && (
              <div className="main-step">
                <div className="main-step-header">
                  <h3>⚡ Scegli Tecnica Avanzata</h3>
                  <p>Quale approccio vuoi testare per: <strong>{selectedScenario.title}</strong></p>
                </div>
                
                <div className="techniques-grid">
                  {advancedTechniques.map(technique => (
                    <div key={technique.id} className="technique-card">
                      <h4>{technique.name}</h4>
                      <p>{technique.description}</p>
                      <div className="technique-details">
                        <div className="approach">
                          <strong>Approccio:</strong> {technique.approach}
                        </div>
                        <div className="use-case">
                          <strong>Ideale per:</strong> {technique.useCase}
                        </div>
                      </div>
                      <button 
                        onClick={() => selectTechnique(technique)}
                        className="btn-select-technique"
                      >
                        Usa Questa Tecnica
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="step-navigation">
                  <button onClick={() => setCurrentStep(1)} className="btn-nav-back">
                    ← Cambia Scenario
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Preview e Lancio */}
            {currentStep === 3 && selectedScenario && selectedTechnique && (
              <div className="main-step">
                <div className="main-step-header">
                  <h3>🔬 Preview Prompt Ottimizzato</h3>
                  <p>Tecnica: <strong>{selectedTechnique.name}</strong> applicata a <strong>{selectedScenario.title}</strong></p>
                </div>
                
                <div className="preview-layout">
                  <div className="prompt-preview-advanced">
                    <pre>{generateAdvancedPrompt(selectedScenario, selectedTechnique)}</pre>
                  </div>

                  <div className="customization-panel">
                    <div className="custom-input-section">
                      <label>🎯 Personalizzazioni/Note aggiuntive (opzionale):</label>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="es. Focus particolare su aspetti legali, tono più formale, budget massimo €X..."
                        rows="4"
                      />
                    </div>
                    
                    <div className="launch-panel">
                      <button 
                        onClick={simulateAdvancedProcessing}
                        disabled={isProcessing}
                        className="btn-launch-optimizer"
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner"></span>
                            Elaborazione Avanzata...
                          </>
                        ) : (
                          '🚀 Lancia Ottimizzazione'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="step-navigation">
                  <button onClick={() => setCurrentStep(2)} className="btn-nav-back">
                    ← Cambia Tecnica
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Risultati */}
            {currentStep === 4 && results && (
              <div className="main-step">
                <div className="main-step-header">
                  <h3>📊 Risultati Ottimizzazione</h3>
                  <p>Analisi completata con tecnica: <strong>{selectedTechnique.name}</strong></p>
                </div>
                
                <div className="results-layout">
                  <div className="results-sidebar">
                    <div className="quality-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Qualità Output:</span>
                        <span className="metric-value" style={{color: results.quality >= 90 ? '#059669' : results.quality >= 80 ? '#d97706' : '#dc2626'}}>
                          {results.quality}%
                        </span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Step Processati:</span>
                        <span className="metric-value">{results.processingSteps}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Tipo Ragionamento:</span>
                        <span className="metric-value">{results.reasoning}</span>
                      </div>
                    </div>

                    <div className="highlights-section">
                      <h4>✨ Punti di Forza:</h4>
                      <div className="highlights-list">
                        {results.highlights.map((highlight, index) => (
                          <div key={index} className="highlight-item">
                            <span className="highlight-icon">✓</span>
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        onClick={() => navigator.clipboard.writeText(results.output)}
                        className="btn-copy-result"
                      >
                        📋 Copia
                      </button>
                      <button 
                        onClick={() => setCurrentStep(3)}
                        className="btn-refine"
                      >
                        🔧 Raffina
                      </button>
                      <button 
                        onClick={resetWorkshop}
                        className="btn-new-optimization"
                      >
                        🆕 Nuovo
                      </button>
                    </div>
                  </div>

                  <div className="results-main">
                    <div className="output-section">
                      <h4>📄 Output Ottimizzato:</h4>
                      <div className="optimized-output">
                        <pre>{results.output}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptOptimizer;