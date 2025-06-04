// Contenuti del seminario e assessment
export const assessmentQuestions = [
  {
    id: 'ai_usage',
    title: 'Utilizzo attuale dell\'IA',
    subtitle: 'Quanto spesso usi strumenti di IA nel tuo lavoro?',
    type: 'scale',
    options: [
      { value: 1, label: 'Mai', description: 'Non ho mai usato IA per lavoro' },
      { value: 2, label: 'Raramente', description: 'Qualche volta per curiosità' },
      { value: 3, label: 'Occasionalmente', description: 'Una volta al mese' },
      { value: 4, label: 'Regolarmente', description: 'Alcune volte a settimana' },
      { value: 5, label: 'Quotidianamente', description: 'Parte del mio workflow' }
    ]
  },
  {
    id: 'tools_familiarity',
    title: 'Familiarità con strumenti IA',
    subtitle: 'Con quali strumenti hai esperienza?',
    type: 'multiple',
    options: [
      { value: 'chatgpt', label: 'ChatGPT', points: 2 },
      { value: 'claude', label: 'Claude (Anthropic)', points: 2 },
      { value: 'gemini', label: 'Google Gemini/Bard', points: 2 },
      { value: 'copilot', label: 'Microsoft Copilot', points: 3 },
      { value: 'specialized', label: 'Strumenti IA specializzati per immobiliare', points: 4 },
      { value: 'none', label: 'Nessuno', points: 0 }
    ]
  },
  {
    id: 'prompt_skills',
    title: 'Competenze di Prompt Engineering',
    subtitle: 'Come descriveresti la tua abilità nel "dialogare" con l\'IA?',
    type: 'scale',
    options: [
      { value: 1, label: 'Principiante', description: 'Faccio domande semplici' },
      { value: 2, label: 'Base', description: 'So chiedere cose specifiche' },
      { value: 3, label: 'Intermedio', description: 'Uso contesto e ruoli' },
      { value: 4, label: 'Avanzato', description: 'Tecniche strutturate' },
      { value: 5, label: 'Esperto', description: 'Prompt complessi e iterativi' }
    ]
  },
  {
    id: 'business_goals',
    title: 'Obiettivi professionali con l\'IA',
    subtitle: 'Cosa vorresti ottenere dall\'IA nel tuo lavoro?',
    type: 'multiple',
    options: [
      { value: 'efficiency', label: 'Maggiore efficienza operativa', points: 2 },
      { value: 'quality', label: 'Migliorare qualità documenti', points: 2 },
      { value: 'communication', label: 'Comunicazione più efficace', points: 2 },
      { value: 'analysis', label: 'Analisi dati e reporting', points: 3 },
      { value: 'innovation', label: 'Servizi innovativi ai clienti', points: 4 },
      { value: 'competitive', label: 'Vantaggio competitivo', points: 4 }
    ]
  },
  {
    id: 'tech_comfort',
    title: 'Comfort tecnologico generale',
    subtitle: 'Come ti senti con le nuove tecnologie?',
    type: 'scale',
    options: [
      { value: 1, label: 'Intimorito', description: 'Preferisco metodi tradizionali' },
      { value: 2, label: 'Cauto', description: 'Adotto dopo che altri hanno testato' },
      { value: 3, label: 'Neutrale', description: 'Aperto se vedo benefici chiari' },
      { value: 4, label: 'Entusiasta', description: 'Mi piace sperimentare' },
      { value: 5, label: 'Early Adopter', description: 'Sempre tra i primi a provare' }
    ]
  },
  {
    id: 'concerns',
    title: 'Preoccupazioni principali',
    subtitle: 'Cosa ti preoccupa di più nell\'uso dell\'IA?',
    type: 'multiple',
    options: [
      { value: 'privacy', label: 'Privacy e protezione dati', points: -1 },
      { value: 'accuracy', label: 'Accuratezza delle risposte', points: -1 },
      { value: 'legal', label: 'Responsabilità legale', points: -2 },
      { value: 'cost', label: 'Costi di implementazione', points: -1 },
      { value: 'learning', label: 'Curva di apprendimento', points: -1 },
      { value: 'replacement', label: 'Paura di essere sostituito', points: -2 },
      { value: 'none', label: 'Nessuna preoccupazione particolare', points: 2 }
    ]
  }
];

export const modules = [
  {
    id: 'module1',
    title: 'Dall\'Euforia alla Strategia',
    subtitle: 'L\'Evoluzione dell\'IA nell\'Amministrazione Condominiale',
    duration: '75 min',
    topics: [
      'Dal "Se" al "Come" Strategico',
      'Aggiornamenti Express: Le Rivoluzioni degli Ultimi Mesi',
      'L\'IA Oltre l\'Automazione: Impatto Strategico',
      'Workshop Flash: Framework RACE per Prompt Efficaci'
    ]
  },
  {
    id: 'module2',
    title: 'L\'Amministratore Aumentato',
    subtitle: 'Nuove Competenze e Prompt Engineering Avanzato',
    duration: '90 min',
    topics: [
      'Dall\'Operatività alla Strategia',
      'Il Fattore Umano Insostituibile',
      'Prompt Engineering Avanzato',
      'Laboratorio Pratico: Costruisci il Tuo Prompt Perfetto'
    ]
  },
  {
    id: 'module3',
    title: 'Navigare il Labirinto dell\'IA',
    subtitle: 'Etica, Normativa e Sicurezza',
    duration: '75 min',
    topics: [
      'Data Governance per l\'IA in Condominio',
      'Privacy by Design e by Default',
      'AI Act Europeo e DDL S.1146',
      'Bias Algoritmici e Cybersecurity'
    ]
  },
  {
    id: 'module4',
    title: 'Implementare l\'IA con Saggezza',
    subtitle: 'Gestire il Cambiamento e Visione Futura',
    duration: '60 min',
    topics: [
      'Guida Pratica alla Selezione di Soluzioni IA',
      'Change Management',
      'Tendenze Emergenti',
      'Costruire il "Condominio del Futuro"'
    ]
  }
];

export const readinessLevels = [
  {
    min: 0,
    max: 25,
    level: 'Principiante Assoluto',
    color: '#f56565',
    description: 'Sei all\'inizio del tuo viaggio con l\'IA. Oggi imparerai le basi!',
    recommendations: [
      'Focus su strumenti gratuiti e semplici',
      'Inizia con casi d\'uso basilari',
      'Priorità su formazione e supporto'
    ]
  },
  {
    min: 26,
    max: 50,
    level: 'Esploratore Cauto',
    color: '#ed8936',
    description: 'Hai curiosità ma serve fiducia. Perfetto per un approccio graduale!',
    recommendations: [
      'Testa strumenti in ambiente sicuro',
      'Concentrati su ROI misurabili',
      'Sviluppa competenze step-by-step'
    ]
  },
  {
    min: 51,
    max: 70,
    level: 'Adottatore Strategico',
    color: '#38a169',
    description: 'Hai buone basi e visione. Pronto per implementazioni serie!',
    recommendations: [
      'Integra IA nei workflow esistenti',
      'Sperimenta con strumenti avanzati',
      'Diventa punto di riferimento nel team'
    ]
  },
  {
    min: 71,
    max: 85,
    level: 'Innovatore Avanzato',
    color: '#3182ce',
    description: 'Sei già avanti! Oggi porterai le tue competenze al livello successivo.',
    recommendations: [
      'Focus su casi d\'uso complessi',
      'Sperimenta con automazioni avanzate',
      'Considera ruolo di mentor per altri'
    ]
  },
  {
    min: 86,
    max: 100,
    level: 'Pioneer dell\'IA',
    color: '#805ad5',
    description: 'Sei un leader tecnologico! Oggi affineremo la strategia per il dominio del mercato.',
    recommendations: [
      'Sviluppa soluzioni proprietarie',
      'Punta su competitive advantage',
      'Considera thought leadership settoriale'
    ]
  }
];