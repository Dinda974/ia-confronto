import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  currentStep: 'welcome', // welcome, assessment, score, buddy, modules
  currentModule: 0,
  userProfile: {
    name: '',
    email: '',
    experience: '',
    goals: [],
    readinessScore: 0
  },
  assessmentAnswers: {},
  buddy: null,
  progress: {
    onboardingComplete: false,
    modulesCompleted: [],
    achievements: []
  },
  facilitatorMode: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_USER_PROFILE':
      return { 
        ...state, 
        userProfile: { ...state.userProfile, ...action.payload } 
      };
    
    case 'SET_ASSESSMENT_ANSWER':
      return {
        ...state,
        assessmentAnswers: {
          ...state.assessmentAnswers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    
    case 'CALCULATE_READINESS_SCORE':
      const score = calculateReadinessScore(state.assessmentAnswers);
      return {
        ...state,
        userProfile: { ...state.userProfile, readinessScore: score }
      };
    
    case 'SET_BUDDY':
      return { ...state, buddy: action.payload };
    
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        progress: { ...state.progress, onboardingComplete: true },
        currentStep: 'modules'
      };
    
    case 'TOGGLE_FACILITATOR_MODE':
      return { ...state, facilitatorMode: !state.facilitatorMode };
    
    default:
      return state;
  }
}

function calculateReadinessScore(answers) {
  // Calcolo semplice del punteggio basato sulle risposte
  const scores = Object.values(answers).map(answer => {
    if (typeof answer === 'number') return answer;
    if (answer === 'high') return 5;
    if (answer === 'medium') return 3;
    if (answer === 'low') return 1;
    return 0;
  });
  
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.min(100, Math.round((total / (scores.length * 5)) * 100));
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve essere usato all\'interno di AppProvider');
  }
  return context;
}