import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import CompetencyAssessment from './components/Onboarding/CompetencyAssessment';
import ReadinessScore from './components/Onboarding/ReadinessScore';
import BuddyMatching from './components/Onboarding/BuddyMatching';
import ModuleOverview from './components/Shared/ModuleOverview';
import './styles/global.css';
import './styles/components.css';

function AppContent() {
  const { state } = useApp(); // REMOVED dispatch - not needed here

  // REMOVED USEEFFECT - localStorage loading is now handled in AppContext!
  // This was causing the infinite loop!

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'assessment':
        return <CompetencyAssessment />;
      case 'score':
        return <ReadinessScore />;
      case 'buddy':
        return <BuddyMatching />;
      case 'modules':
        return <ModuleOverview />;
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