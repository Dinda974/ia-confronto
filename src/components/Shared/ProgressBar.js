import React from 'react';
import { useApp } from '../../contexts/AppContext';

function ProgressBar() {
  const { state } = useApp();

  const steps = [
    { key: 'welcome', label: 'Benvenuto', icon: '👋' },
    { key: 'assessment', label: 'Assessment', icon: '📊' },
    { key: 'score', label: 'Punteggio', icon: '🎯' },
    { key: 'buddy', label: 'Networking', icon: '🤝' },
    { key: 'modules', label: 'Moduli', icon: '🚀' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === state.currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`progress-step ${
              index <= currentStepIndex ? 'completed' : ''
            } ${
              index === currentStepIndex ? 'current' : ''
            }`}
          >
            <div className="step-icon">{step.icon}</div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;