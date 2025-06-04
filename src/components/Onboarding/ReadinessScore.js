import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../Shared/Button';
import { readinessLevels } from '../../data/content';

function ReadinessScore() {
  const { state, dispatch } = useApp();
  const [animateScore, setAnimateScore] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const score = state.userProfile.readinessScore || 0;
  const userLevel = readinessLevels.find(level => 
    score >= level.min && score <= level.max
  ) || readinessLevels[0];

  useEffect(() => {
    // Animazione del punteggio
    setTimeout(() => setAnimateScore(true), 500);
    
    // Animazione incrementale del numero
    let start = 0;
    const increment = score / 30;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [score]);

  const handleContinue = () => {
    dispatch({ type: 'SET_STEP', payload: 'buddy' });
  };

  const handleRetakeAssessment = () => {
    dispatch({ type: 'SET_STEP', payload: 'assessment' });
  };

  return (
    <div className="readiness-score-screen fade-in">
      <div className="card card-large">
        
        {/* Header con celebrazione */}
        <div className="score-header">
          <div className="celebration-icon">🎯</div>
          <h1>Il Tuo Punteggio IA Readiness</h1>
          <p className="score-subtitle">
            Abbiamo analizzato le tue risposte e calcolato il tuo livello di preparazione all'IA
          </p>
        </div>

        {/* Score Display principale */}
        <div className="score-display">
          <div className="score-circle-container">
            <svg className="score-circle" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={userLevel.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={animateScore ? 
                  `${2 * Math.PI * 80 * (1 - score / 100)}` : 
                  `${2 * Math.PI * 80}`
                }
                className="score-progress"
                style={{ 
                  transition: 'stroke-dashoffset 2s ease-in-out',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '100px 100px'
                }}
              />
            </svg>
            
            <div className="score-content">
              <div className="score-number">{currentScore}</div>
              <div className="score-label">/ 100</div>
            </div>
          </div>

          <div className="level-info">
            <div 
              className="level-badge"
              style={{ backgroundColor: userLevel.color }}
            >
              {userLevel.level}
            </div>
            <p className="level-description">{userLevel.description}</p>
          </div>
        </div>

        {/* Breakdown delle competenze */}
        <div className="competency-breakdown">
          <h3>Analisi delle tue competenze</h3>
          <div className="breakdown-grid">
            <CompetencyItem 
              title="Esperienza IA"
              score={getComponentScore(state.assessmentAnswers, 'ai_usage')}
              description="Uso pratico degli strumenti"
            />
            <CompetencyItem 
              title="Conoscenza Strumenti"
              score={getComponentScore(state.assessmentAnswers, 'tools_familiarity')}
              description="Familiarità con piattaforme IA"
            />
            <CompetencyItem 
              title="Prompt Skills"
              score={getComponentScore(state.assessmentAnswers, 'prompt_skills')}
              description="Capacità di dialogare con IA"
            />
            <CompetencyItem 
              title="Visione Business"
              score={getComponentScore(state.assessmentAnswers, 'business_goals')}
              description="Obiettivi strategici chiari"
            />
            <CompetencyItem 
              title="Comfort Tech"
              score={getComponentScore(state.assessmentAnswers, 'tech_comfort')}
              description="Apertura alle innovazioni"
            />
            <CompetencyItem 
              title="Gestione Rischi"
              score={getComponentScore(state.assessmentAnswers, 'concerns', true)}
              description="Consapevolezza e preparazione"
            />
          </div>
        </div>

        {/* Raccomandazioni personalizzate */}
        <div className="recommendations">
          <h3>🎯 Le tue raccomandazioni personalizzate</h3>
          <div className="recommendations-list">
            {userLevel.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-icon">✓</div>
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight basato sul profilo */}
        <div className="personal-insights">
          <h3>💡 Insight personalizzati</h3>
          <div className="insights-grid">
            <InsightCard 
              icon="🚀"
              title="Il tuo prossimo step"
              content={getNextStepRecommendation(userLevel, state.userProfile)}
            />
            <InsightCard 
              icon="⚡"
              title="Quick Win"
              content={getQuickWinRecommendation(state.assessmentAnswers)}
            />
            <InsightCard 
              icon="🎓"
              title="Focus formativo"
              content={getTrainingFocus(state.assessmentAnswers)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="score-actions">
          <div className="action-buttons">
            <Button 
              variant="outline" 
              onClick={handleRetakeAssessment}
            >
              🔄 Rifai Assessment
            </Button>
            
            <Button 
              variant="primary" 
              size="large"
              onClick={handleContinue}
            >
              Continua il Setup 🤝
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Componente per singola competenza
function CompetencyItem({ title, score, description }) {
  const [animateBar, setAnimateBar] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateBar(true), 800);
  }, []);

  return (
    <div className="competency-item">
      <div className="competency-header">
        <span className="competency-title">{title}</span>
        <span className="competency-score">{score}%</span>
      </div>
      <div className="competency-bar">
        <div 
          className="competency-fill"
          style={{ 
            width: animateBar ? `${score}%` : '0%',
            backgroundColor: getScoreColor(score)
          }}
        />
      </div>
      <div className="competency-description">{description}</div>
    </div>
  );
}

// Componente per insight cards
function InsightCard({ icon, title, content }) {
  return (
    <div className="insight-card">
      <div className="insight-icon">{icon}</div>
      <div className="insight-content">
        <h4>{title}</h4>
        <p>{content}</p>
      </div>
    </div>
  );
}

// Utility functions
function getComponentScore(answers, questionId, reverse = false) {
  const answer = answers[questionId];
  if (!answer) return 0;
  
  if (Array.isArray(answer)) {
    // Multiple choice - calcola basato sui punti
    const totalPoints = answer.length * 2; // Assuming max 2 points per option
    return Math.min(100, (totalPoints / 8) * 100); // Normalize to 100
  } else {
    // Scale question
    const score = reverse ? (6 - answer) : answer;
    return (score / 5) * 100;
  }
}

function getScoreColor(score) {
  if (score >= 80) return '#38a169';
  if (score >= 60) return '#3182ce';
  if (score >= 40) return '#ed8936';
  return '#f56565';
}

function getNextStepRecommendation(userLevel, userProfile) {
  const role = userProfile.role || '';
  
  if (userLevel.level.includes('Principiante')) {
    return `Come ${role}, inizia con ChatGPT gratuito per email e comunicazioni semplici. Dedica 30 minuti al giorno per familiarizzare.`;
  }
  if (userLevel.level.includes('Cauto')) {
    return `È il momento di integrare l'IA nel tuo workflow settimanale. Prova prompt strutturati per verbali e analisi documenti.`;
  }
  if (userLevel.level.includes('Strategico')) {
    return `Passa a strumenti premium e sperimenta con automazioni. Considera di diventare il referente IA del tuo studio.`;
  }
  if (userLevel.level.includes('Avanzato')) {
    return `Focus su casi d'uso complessi e mentoring. Sviluppa competenze in ambiti specialistici come analisi predittiva.`;
  }
  return `Considera sviluppo di soluzioni proprietarie e thought leadership nel settore. Il mercato ha bisogno di innovatori come te.`;
}

function getQuickWinRecommendation(answers) {
  const promptSkills = answers.prompt_skills || 1;
  
  if (promptSkills <= 2) {
    return "Impara il framework RACE per prompt strutturati. Risultati migliori in 5 minuti.";
  }
  if (promptSkills <= 3) {
    return "Sperimenta con ruoli specifici nei prompt: 'Sei un amministratore esperto...'";
  }
  return "Testa tecniche avanzate come chain-of-thought per problemi complessi.";
}

function getTrainingFocus(answers) {
  const techComfort = answers.tech_comfort || 1;
  const concerns = answers.concerns || [];
  
  if (concerns.includes('legal')) {
    return "Priorità su aspetti normativi: GDPR, AI Act e responsabilità professionali.";
  }
  if (techComfort <= 2) {
    return "Focus su basics e hands-on practice. Approccio graduale e supportato.";
  }
  if (concerns.includes('accuracy')) {
    return "Tecniche di validazione output e prompt engineering per maggiore precisione.";
  }
  return "Competenze avanzate in automazione e integrazione con tools esistenti.";
}

export default ReadinessScore;