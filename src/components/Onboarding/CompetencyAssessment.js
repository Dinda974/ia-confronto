import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../Shared/Button';
import { assessmentQuestions } from '../../data/content';

function CompetencyAssessment() {
  const { state, dispatch } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // AGGIUNGI questo useEffect dopo gli useState esistenti
useEffect(() => {
  // Scroll to top ad ogni cambio domanda
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [currentQuestion]);

  const question = assessmentQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === assessmentQuestions.length - 1;
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Salva nel context
    dispatch({
      type: 'SET_ASSESSMENT_ANSWER',
      payload: { questionId, answer }
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calcola il punteggio finale
      dispatch({ type: 'CALCULATE_READINESS_SCORE' });
      dispatch({ type: 'SET_STEP', payload: 'score' });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const isAnswered = answers[question.id];
  const canProceed = isAnswered !== undefined;

  return (
    <div className="assessment-screen fade-in">
      <div className="card card-large">
        <div className="assessment-header">          {/* ← AGGIUNGI questo div */}
          <h2>{question.title}</h2>
          <p className="question-subtitle">{question.subtitle}</p>
        </div>                                       {/* ← AGGIUNGI chiusura div */}

        <div className="question-content">
          {question.type === 'scale' && (
            <ScaleQuestion 
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
            />
          )}
          
          {question.type === 'multiple' && (
            <MultipleQuestion 
              question={question}
              value={answers[question.id] || []}
              onChange={(value) => handleAnswer(question.id, value)}
            />
          )}
        </div>

        <div className="assessment-actions">
          <div className="action-buttons">
            {currentQuestion > 0 && (
              <Button 
                variant="secondary" 
                onClick={handlePrevious}
              >
                ← Precedente
              </Button>
            )}
            
            <div className="spacer" />
            
            <Button 
              variant="primary" 
              onClick={handleNext}
              disabled={!canProceed}
              size="large"
            >
              {isLastQuestion ? 'Calcola il mio Punteggio! 🎯' : 'Prossima →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente per domande a scala
function ScaleQuestion({ question, value, onChange }) {
  return (
    <div className="scale-question">
      <div className="scale-options">
        {question.options.map((option) => (
          <div 
            key={option.value}
            className={`scale-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            <div className="scale-number">{option.value}</div>
            <div className="scale-label">{option.label}</div>
            <div className="scale-description">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente per domande multiple
function MultipleQuestion({ question, value, onChange }) {
  const handleOptionToggle = (optionValue) => {
    const isNoneOption = optionValue === 'none';
    const hasNone = value.includes('none');
    
    let newValue;
    
    if (isNoneOption) {
      // Se clicco "Nessuno", deseleziona tutto il resto
      newValue = hasNone ? [] : ['none'];
    } else {
      // Se clicco un'opzione normale
      if (hasNone) {
        // Se c'era "Nessuno", rimuovilo e aggiungi questa opzione
        newValue = [optionValue];
      } else {
        // Toggle normale
        newValue = value.includes(optionValue)
          ? value.filter(v => v !== optionValue)
          : [...value, optionValue];
      }
    }
    
    onChange(newValue);
  };

  return (
    <div className="multiple-question">
      <div className="multiple-options">
        {question.options.map((option) => (
          <div 
            key={option.value}
            className={`multiple-option ${value.includes(option.value) ? 'selected' : ''}`}
            onClick={() => handleOptionToggle(option.value)}
          >
            <div className="option-checkbox">
              {value.includes(option.value) && <span>✓</span>}
            </div>
            <div className="option-content">
              <div className="option-label">{option.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="multiple-hint">
        💡 Puoi selezionare più opzioni (tranne "Nessuno")
      </div>
    </div>
  );
}

export default CompetencyAssessment;