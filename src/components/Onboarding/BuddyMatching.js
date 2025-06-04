import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../Shared/Button';

function BuddyMatching() {
  const { state, dispatch } = useApp();
  const [isMatching, setIsMatching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [buddy, setBuddy] = useState(null);

  // Simula il processo di matching
  useEffect(() => {
    const startMatching = () => {
      setIsMatching(true);
      
      // Simula ricerca buddy (3 secondi)
      setTimeout(() => {
        const matchedBuddy = findCompatibleBuddy(state.userProfile, state.assessmentAnswers);
        setBuddy(matchedBuddy);
        setMatchFound(true);
        setIsMatching(false);
        
        // Salva nel context
        dispatch({ type: 'SET_BUDDY', payload: matchedBuddy });
      }, 3000);
    };

    // Auto-start matching dopo 1 secondo
    const timer = setTimeout(startMatching, 1000);
    return () => clearTimeout(timer);
  }, [state.userProfile, state.assessmentAnswers, dispatch]);

  const handleContinue = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const handleSkip = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const handleFindAnother = () => {
    setMatchFound(false);
    setIsMatching(true);
    
    setTimeout(() => {
      const newBuddy = findCompatibleBuddy(state.userProfile, state.assessmentAnswers, true);
      setBuddy(newBuddy);
      setMatchFound(true);
      setIsMatching(false);
      dispatch({ type: 'SET_BUDDY', payload: newBuddy });
    }, 2000);
  };

  return (
    <div className="buddy-matching-screen fade-in">
      <div className="card card-large">
        
        <div className="buddy-header">
          <div className="buddy-icon">🤝</div>
          <h1>Trova il tuo Accountability Partner</h1>
          <p className="buddy-subtitle">
            Stiamo cercando il compagno perfetto per il tuo percorso IA! 
            Un partner con obiettivi simili può aumentare del 65% la probabilità di successo.
          </p>
        </div>

        {/* Stato: Ricerca in corso */}
        {isMatching && !matchFound && (
          <div className="matching-process">
            <div className="matching-animation">
              <div className="search-circle">
                <div className="search-dot"></div>
                <div className="search-dot"></div>
                <div className="search-dot"></div>
              </div>
            </div>
            
            <h3>🔍 Ricerca in corso...</h3>
            <p>Stiamo analizzando profili compatibili con le tue competenze e obiettivi</p>
            
            <div className="matching-criteria">
              <div className="criteria-item">
                <span className="criteria-icon">🎯</span>
                <span>Livello di esperienza simile</span>
              </div>
              <div className="criteria-item">
                <span className="criteria-icon">🏢</span>
                <span>Ruolo professionale compatibile</span>
              </div>
              <div className="criteria-item">
                <span className="criteria-icon">📚</span>
                <span>Obiettivi di apprendimento allineati</span>
              </div>
            </div>
          </div>
        )}

        {/* Stato: Match trovato */}
        {matchFound && buddy && (
          <div className="buddy-result">
            <div className="match-celebration">
              <div className="celebration-stars">✨ MATCH PERFETTO! ✨</div>
            </div>
            
            <div className="buddy-card">
              <div className="buddy-avatar">
                <span className="avatar-icon">{buddy.avatar}</span>
                <div className="compatibility-badge">{buddy.compatibility}% compatibile</div>
              </div>
              
              <div className="buddy-info">
                <h3>{buddy.name}</h3>
                <p className="buddy-role">{buddy.role}</p>
                <p className="buddy-description">{buddy.description}</p>
                
                <div className="compatibility-details">
                  <h4>🎯 Cosa vi accomuna:</h4>
                  <div className="common-traits">
                    {buddy.commonTraits.map((trait, index) => (
                      <div key={index} className="trait-item">
                        <span className="trait-icon">✓</span>
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="buddy-goals">
                  <h4>🚀 I suoi obiettivi:</h4>
                  <p>"{buddy.goals}"</p>
                </div>
              </div>
            </div>
            
            <div className="partnership-benefits">
              <h3>💡 Come il vostro partnership vi aiuterà:</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <span className="benefit-icon">📅</span>
                  <div>
                    <strong>Check-in settimanali</strong>
                    <p>Condividete progressi e sfide</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎓</span>
                  <div>
                    <strong>Apprendimento reciproco</strong>
                    <p>Scambiate trucchi e soluzioni</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🏆</span>
                  <div>
                    <strong>Motivazione costante</strong>
                    <p>Celebrate insieme i successi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="buddy-actions">
          {!matchFound ? (
            <div className="waiting-actions">
              <Button 
                variant="outline" 
                onClick={handleSkip}
              >
                ⏭️ Salta per ora
              </Button>
            </div>
          ) : (
            <div className="match-actions">
              <Button 
                variant="outline" 
                onClick={handleFindAnother}
              >
                🔄 Cerca un altro partner
              </Button>
              
              <Button 
                variant="primary" 
                size="large"
                onClick={handleContinue}
              >
                Perfetto! Iniziamo il Seminario 🚀
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Utility function per trovare buddy compatibili
function findCompatibleBuddy(userProfile, assessmentAnswers, findAnother = false) {
  // Database simulato di partecipanti
  const possibleBuddies = [
    {
      name: "Laura Verdi",
      role: "Amministratore Senior",
      avatar: "👩‍💼",
      description: "15 anni di esperienza, appassionata di innovazione tecnologica",
      compatibility: 92,
      commonTraits: [
        "Stesso livello di esperienza IA",
        "Focus su efficienza operativa", 
        "Interesse per automazione"
      ],
      goals: "Integrare IA per ridurre tempo amministrativo e migliorare servizio clienti"
    },
    {
      name: "Marco Bianchi",
      role: "Amministratore Junior",
      avatar: "👨‍💼",
      description: "5 anni di esperienza, curioso delle nuove tecnologie",
      compatibility: 87,
      commonTraits: [
        "Approccio cauto ma interessato",
        "Focus su apprendimento graduale",
        "Attenzione agli aspetti legali"
      ],
      goals: "Acquisire competenze IA per crescita professionale e competitività"
    },
    {
      name: "Anna Rossi",
      role: "Collaboratore Studio",
      avatar: "👩‍💻",
      description: "Giovane professionista, entusiasta dell'innovazione",
      compatibility: 89,
      commonTraits: [
        "Early adopter di tecnologie",
        "Interesse per prompt engineering",
        "Visione strategica del business"
      ],
      goals: "Diventare esperta IA per supportare team e clienti più efficacemente"
    },
    {
      name: "Giuseppe Neri",
      role: "Amministratore Senior",
      avatar: "👨‍🎓",
      description: "20 anni di esperienza, leader nell'innovazione settoriale",
      compatibility: 94,
      commonTraits: [
        "Visione strategica avanzata",
        "Competenze tecniche solide",
        "Focus su competitive advantage"
      ],
      goals: "Sviluppare thought leadership e soluzioni IA proprietarie"
    },
    {
      name: "Francesca Blu",
      role: "Neo Amministratore",
      avatar: "👩‍🎓",
      description: "Appena entrata nel settore, molto motivata ad apprendere",
      compatibility: 85,
      commonTraits: [
        "Motivazione alta all'apprendimento",
        "Approccio strutturato",
        "Interesse per best practice"
      ],
      goals: "Costruire solide fondamenta IA per iniziare al meglio la carriera"
    }
  ];

  // Algoritmo semplice di matching basato su profilo utente
  const userExperience = userProfile.experience || 'beginner';
  const userRole = userProfile.role || '';
  
  let compatibleBuddies = possibleBuddies;
  
  // Filter based on experience level
  if (userExperience === 'beginner' || userExperience === 'basic') {
    compatibleBuddies = possibleBuddies.filter(b => 
      b.name.includes('Marco') || b.name.includes('Francesca') || b.name.includes('Anna')
    );
  } else if (userExperience === 'intermediate') {
    compatibleBuddies = possibleBuddies.filter(b => 
      b.name.includes('Laura') || b.name.includes('Anna') || b.name.includes('Marco')
    );
  } else {
    compatibleBuddies = possibleBuddies.filter(b => 
      b.name.includes('Giuseppe') || b.name.includes('Laura')
    );
  }
  
  // Se è la seconda ricerca, escludi il primo risultato
  if (findAnother && compatibleBuddies.length > 1) {
    compatibleBuddies = compatibleBuddies.slice(1);
  }
  
  // Ritorna un buddy casuale dal pool compatibile
  return compatibleBuddies[Math.floor(Math.random() * compatibleBuddies.length)] || possibleBuddies[0];
}

export default BuddyMatching;