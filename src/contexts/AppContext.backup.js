import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadProgress, saveProgress } from '../utils/storage';

const AppContext = createContext();

const initialState = {
  currentStep: 'welcome',
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
  
  // Seminario live
  sessionId: null,
  sessionActive: false,
  currentModule: 0,
  facilitatorMode: false,
  isConnected: false,
  participants: {},
  
  // Polling system
  activePoll: null,
  pollResults: { yes: 0, no: 0 },
  hasVoted: false,

  // Workshop system
  activeWorkshop: null,
  workshopData: {
    raceBuilder: {
      ruolo: '',
      azione: '',
      contesto: '',
      esempio: ''
    },
    promptOptimizer: {
      selectedScenario: null,
      selectedTechnique: null,
      customInput: '',
      results: null
    },
    biasSimulator: {
      step: 1,
      selectedScenario: null,
      userInput: '',
      simulationResults: null,
      biasDetected: [],
      checklistCompleted: false
    },
    roiPlanner: {
      step: 1,
      businessProfile: {},
      selectedTools: [],
      timeline: '12months',
      investmentLevel: 'starter',
      calculations: null,
      reportGenerated: false
    }
  }
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
        sessionActive: true
      };

    case 'END_SESSION':
      return { 
        ...state, 
        sessionActive: false,
        currentModule: 0
      };

    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };

    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };

    case 'UPDATE_PARTICIPANTS':
      return { ...state, participants: action.payload };

    case 'START_POLL':
      return {
        ...state,
        activePoll: action.payload,
        pollResults: { yes: 0, no: 0 },
        hasVoted: false
      };

    case 'END_POLL':
      return {
        ...state,
        activePoll: null,
        pollResults: { yes: 0, no: 0 },
        hasVoted: false
      };

    case 'UPDATE_POLL_RESULTS':
      return { ...state, pollResults: action.payload };

    case 'SET_HAS_VOTED':
      return { ...state, hasVoted: true };

    case 'SUBMIT_POLL_RESPONSE':
      const newResults = { ...state.pollResults };
      const response = action.payload;
      newResults[response] = (newResults[response] || 0) + 1;
      return {
        ...state,
        pollResults: newResults
      };

    case 'SYNC_FROM_FIREBASE':
      return state; // NO-OP for now

    case 'OPEN_WORKSHOP':
      return {
        ...state,
        activeWorkshop: action.payload
      };

    case 'CLOSE_WORKSHOP':
      return {
        ...state,
        activeWorkshop: null
      };

    case 'UPDATE_WORKSHOP_DATA':
      return {
        ...state,
        workshopData: {
          ...state.workshopData,
          [action.payload.workshop]: {
            ...state.workshopData[action.payload.workshop],
            ...action.payload.data
          }
        }
      };

    case 'RESET_WORKSHOP_DATA':
      return {
        ...state,
        workshopData: {
          ...state.workshopData,
          [action.payload]: initialState.workshopData[action.payload]
        }
      };

    default:
      return state;
  }
}

function calculateReadinessScore(answers) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  const assessmentQuestions = [
    {
      id: 'ai_usage',
      type: 'scale',
      maxScore: 5
    },
    {
      id: 'tools_familiarity', 
      type: 'multiple',
      options: [
        { value: 'chatgpt', points: 2 },
        { value: 'claude', points: 2 },
        { value: 'gemini', points: 2 },
        { value: 'copilot', points: 3 },
        { value: 'specialized', points: 4 },
        { value: 'none', points: 0 }
      ]
    },
    {
      id: 'prompt_skills',
      type: 'scale', 
      maxScore: 5
    },
    {
      id: 'business_goals',
      type: 'multiple',
      options: [
        { value: 'efficiency', points: 2 },
        { value: 'quality', points: 2 },
        { value: 'communication', points: 2 },
        { value: 'analysis', points: 3 },
        { value: 'innovation', points: 4 },
        { value: 'competitive', points: 4 }
      ]
    },
    {
      id: 'tech_comfort',
      type: 'scale',
      maxScore: 5
    },
    {
      id: 'concerns',
      type: 'multiple',
      options: [
        { value: 'privacy', points: -1 },
        { value: 'accuracy', points: -1 },
        { value: 'legal', points: -2 },
        { value: 'cost', points: -1 },
        { value: 'learning', points: -1 },
        { value: 'replacement', points: -2 },
        { value: 'none', points: 2 }
      ]
    }
  ];
  
  assessmentQuestions.forEach(question => {
    const answer = answers[question.id];
    
    if (question.type === 'scale') {
      if (typeof answer === 'number') {
        totalScore += answer;
        maxPossibleScore += question.maxScore;
      }
    } else if (question.type === 'multiple') {
      if (Array.isArray(answer)) {
        answer.forEach(selectedValue => {
          const option = question.options.find(opt => opt.value === selectedValue);
          if (option) {
            totalScore += option.points;
          }
        });
      }
      const maxPoints = question.options
        .filter(opt => opt.points > 0)
        .reduce((sum, opt) => sum + opt.points, 0);
      maxPossibleScore += maxPoints;
    }
  });
  
  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load localStorage only once on app start
  useEffect(() => {
    if (isInitialized) return;
    
    const savedState = loadProgress();
    if (savedState) {
      Object.keys(savedState).forEach(key => {
        if (key === 'userProfile') {
          dispatch({ type: 'UPDATE_USER_PROFILE', payload: savedState[key] });
        } else if (key === 'currentStep') {
          dispatch({ type: 'SET_STEP', payload: savedState[key] });
        } else if (key === 'assessmentAnswers') {
          dispatch({ type: 'SET_ASSESSMENT_ANSWER', payload: savedState[key] });
        } else if (key === 'facilitatorMode' && savedState[key]) {
          dispatch({ type: 'TOGGLE_FACILITATOR_MODE' });
        }
      });
    }

    // Generate session ID
    const sessionId = 'LOCAL_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
    
    setIsInitialized(true);
  }, [isInitialized]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initialization
    
    const stateToSave = {
      currentStep: state.currentStep,
      userProfile: state.userProfile,
      assessmentAnswers: state.assessmentAnswers,
      facilitatorMode: state.facilitatorMode,
      progress: state.progress
    };
    saveProgress(stateToSave);
  }, [isInitialized, state.currentStep, state.userProfile, state.assessmentAnswers, state.facilitatorMode, state.progress]);

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
  SET_SESSION_ID: 'SET_SESSION_ID',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  UPDATE_PARTICIPANTS: 'UPDATE_PARTICIPANTS',
  START_POLL: 'START_POLL',
  END_POLL: 'END_POLL',
  UPDATE_POLL_RESULTS: 'UPDATE_POLL_RESULTS',
  SET_HAS_VOTED: 'SET_HAS_VOTED',
  SUBMIT_POLL_RESPONSE: 'SUBMIT_POLL_RESPONSE',
  SYNC_FROM_FIREBASE: 'SYNC_FROM_FIREBASE',
  OPEN_WORKSHOP: 'OPEN_WORKSHOP',
  CLOSE_WORKSHOP: 'CLOSE_WORKSHOP', 
  UPDATE_WORKSHOP_DATA: 'UPDATE_WORKSHOP_DATA',
  RESET_WORKSHOP_DATA: 'RESET_WORKSHOP_DATA'
};