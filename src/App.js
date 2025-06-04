import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import CompetencyAssessment from './components/Onboarding/CompetencyAssessment';
import ReadinessScore from './components/Onboarding/ReadinessScore'; // <- AGGIUNGI
import BuddyMatching from './components/Onboarding/BuddyMatching'; // <- AGGIUNGI
import { loadProgress } from './utils/storage';
import './styles/global.css';
import './styles/components.css';

function AppContent() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Carica il progresso salvato all'avvio
    const savedProgress = loadProgress();
    if (savedProgress) {
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: savedProgress.userProfile });
      dispatch({ type: 'SET_STEP', payload: savedProgress.currentStep });
      // Ripristina altre informazioni salvate
      if (savedProgress.assessmentAnswers) {
        Object.entries(savedProgress.assessmentAnswers).forEach(([questionId, answer]) => {
          dispatch({ 
            type: 'SET_ASSESSMENT_ANSWER', 
            payload: { questionId, answer } 
          });
        });
      }
    }
  }, [dispatch]);

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'assessment':
        return <CompetencyAssessment />; // <- invece del div placeholder
      case 'score':
        return <ReadinessScore />; // <- CAMBIA QUESTA RIGA
      case 'buddy':
        return <BuddyMatching />; // <- CAMBIA QUESTA RIGA
      case 'modules':
        return <div>Modules Component (prossimo step)</div>;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <Layout>
      {renderCurrentStep()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="app">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;