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
  facilitatorMode: false,
  sessionActive: false
  // Polling system
  activePoll: null,
  pollResults: {}
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

    case 'SET_CURRENT_MODULE':
  return { ...state, currentModule: action.payload };

    case 'START_SESSION':
      return { 
        ...state, 
        sessionActive: true,
        currentModule: 1
      };

    case 'END_SESSION':
      return { 
        ...state, 
        sessionActive: false,
        currentModule: 0
      };
    case 'START_POLL':
      return {
        ...state,
        activePoll: action.payload,
        pollResults: {}
      };

    case 'END_POLL':
      return {
        ...state,
        activePoll: null
      };

    case 'SUBMIT_POLL_RESPONSE':
      const newResults = { ...state.pollResults };
      const response = action.payload;
      newResults[response] = (newResults[response] || 0) + 1;
      return {
        ...state,
        pollResults: newResults
      };

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

export const actionTypes = {
  SET_STEP: 'SET_STEP',
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE', 
  SET_ASSESSMENT_ANSWER: 'SET_ASSESSMENT_ANSWER',
  CALCULATE_READINESS_SCORE: 'CALCULATE_READINESS_SCORE',
  SET_BUDDY: 'SET_BUDDY',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  TOGGLE_FACILITATOR_MODE: 'TOGGLE_FACILITATOR_MODE',
  SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
  START_SESSION: 'START_SESSION',
  END_SESSION: 'END_SESSION',
  // NUOVI per polling
  START_POLL: 'START_POLL',
  END_POLL: 'END_POLL',
  SUBMIT_POLL_RESPONSE: 'SUBMIT_POLL_RESPONSE'
};

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
