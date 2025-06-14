import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { loadProgress, saveProgress } from '../utils/storage';
import { firebaseService } from '../utils/firebase';

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
      const newFacilitatorMode = !state.facilitatorMode;
      console.log('🎛️ Facilitator mode:', newFacilitatorMode);
      return { ...state, facilitatorMode: newFacilitatorMode };

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

    // 🔥 NUOVO: Sync Firebase senza loop
    case 'SYNC_FROM_FIREBASE':
      const { currentModule, sessionActive, activePoll, pollResults, participants } = action.payload;
      return {
        ...state,
        currentModule: currentModule !== undefined ? currentModule : state.currentModule,
        sessionActive: sessionActive !== undefined ? sessionActive : state.sessionActive,
        activePoll: activePoll !== undefined ? activePoll : state.activePoll,
        pollResults: pollResults || state.pollResults,
        participants: participants || state.participants
      };

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
  
  // 🔥 ANTI-LOOP: useRef per tracciare Firebase listener
  const firebaseListenerRef = useRef(null);
  const isFirebaseInitializedRef = useRef(false);

  // 🔥 STEP 1: Load localStorage only once (UNCHANGED - already safe)
  useEffect(() => {
    if (isInitialized) return;
  
    console.log('🔄 Loading saved state...');
  
    const savedState = loadProgress();
    console.log('💾 Saved state:', savedState);
  
    if (savedState) {
    // Process each saved field
      if (savedState.userProfile) {
        dispatch({ type: 'UPDATE_USER_PROFILE', payload: savedState.userProfile });
      }
      if (savedState.currentStep) {
        dispatch({ type: 'SET_STEP', payload: savedState.currentStep });
      }
      if (savedState.assessmentAnswers) {
      // Fix: Need to dispatch each answer individually
        Object.keys(savedState.assessmentAnswers).forEach(questionId => {
          dispatch({ 
            type: 'SET_ASSESSMENT_ANSWER', 
            payload: { 
              questionId, 
              answer: savedState.assessmentAnswers[questionId] 
            } 
          });
        });
      }
      if (savedState.facilitatorMode === true) {
        console.log('🎛️ Restoring facilitator mode');
        dispatch({ type: 'TOGGLE_FACILITATOR_MODE' });
      }
      if (savedState.progress) {
      // We don't have a direct action for this, but it's handled in the save effect
      }
    }

  // Generate session ID
  
  const getSessionId = () => {
  // 1. Check URL params first (for participants joining via link)
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');
  
    if (urlSessionId) {
      console.log('🔗 Joining session from URL:', urlSessionId);
      return urlSessionId;
    }
  
  // 2. Check localStorage (for returning users)
    const savedSessionId = localStorage.getItem('ia-confronto-sessionId');
    if (savedSessionId) {
      console.log('💾 Reusing saved session:', savedSessionId);
      return savedSessionId;
    }
  
  // 3. Generate new session (for facilitators)
    const newSessionId = firebaseService.generateSessionId();
    console.log('🆕 Generated new session:', newSessionId);
    localStorage.setItem('ia-confronto-sessionId', newSessionId);
    return newSessionId;
  };

  const sessionId = getSessionId();
  dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
  
  setIsInitialized(true);
  console.log('✅ Initialization complete');
}, [isInitialized]);

  // 🔥 STEP 2: Firebase initialization (AFTER localStorage)
  useEffect(() => {
    if (!isInitialized || isFirebaseInitializedRef.current || !state.sessionId) return;

    console.log('🔥 Initializing Firebase for session:', state.sessionId);
    
    const initializeFirebase = async () => {
      try {
        // Test Firebase connection
        const isConnected = await firebaseService.testConnection();
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: isConnected });
        
        if (isConnected) {
          console.log('✅ Firebase connected');
          
          // Setup Firebase listener
          const unsubscribe = firebaseService.subscribeToSession(state.sessionId, (sessionData) => {
            if (sessionData) {
              console.log('📡 Firebase data received:', sessionData);
              
              // Sync only specific fields to avoid loops
              dispatch({ 
                type: 'SYNC_FROM_FIREBASE', 
                payload: {
                  currentModule: sessionData.currentModule,
                  sessionActive: sessionData.active,
                  activePoll: sessionData.activePoll,
                  pollResults: sessionData.pollResults,
                  participants: sessionData.participants
                }
              });
            }
          });
          
          firebaseListenerRef.current = unsubscribe;
        } else {
          console.log('⚠️ Firebase connection failed, using local mode');
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      }
    };

    initializeFirebase();
    isFirebaseInitializedRef.current = true;

    // Cleanup function
    return () => {
      if (firebaseListenerRef.current) {
        console.log('🧹 Cleaning up Firebase listener');
        firebaseListenerRef.current();
        firebaseListenerRef.current = null;
      }
    };
  }, [isInitialized, state.sessionId]);

  // 🔥 STEP 3: Save to localStorage (UNCHANGED - already safe)
  useEffect(() => {
    if (!isInitialized) return;
    
    const stateToSave = {
      currentStep: state.currentStep,
      userProfile: state.userProfile,
      assessmentAnswers: state.assessmentAnswers,
      facilitatorMode: state.facilitatorMode,
      progress: state.progress
    };
    saveProgress(stateToSave);
  }, [isInitialized, state.currentStep, state.userProfile, state.assessmentAnswers, state.facilitatorMode, state.progress]);

  // 🔥 ENHANCED DISPATCH with Firebase sync
  const enhancedDispatch = React.useCallback(async (action) => {
    console.log('🚀 Dispatch action:', action.type);
    
    // Always dispatch locally first
    dispatch(action);

    // Firebase sync for specific actions (only if connected and facilitator)
    if (state.isConnected && state.facilitatorMode && state.sessionId) {
      try {
        switch (action.type) {
          case 'START_SESSION':
            await firebaseService.startSession(state.sessionId);
            console.log('📡 Session started in Firebase');
            break;
            
          case 'END_SESSION':
            await firebaseService.endSession(state.sessionId);
            console.log('📡 Session ended in Firebase');
            break;
            
          case 'SET_CURRENT_MODULE':
            await firebaseService.setCurrentModule(state.sessionId, action.payload);
            console.log('📡 Module synced to Firebase:', action.payload);
            break;
            
          case 'START_POLL':
            await firebaseService.startPoll(state.sessionId, action.payload);
            console.log('📡 Poll started in Firebase:', action.payload);
            break;
            
          case 'END_POLL':
            await firebaseService.endPoll(state.sessionId);
            console.log('📡 Poll ended in Firebase');
            break;
            
          default:
            // No Firebase action needed
            break;
        }
      } catch (error) {
        console.error('Firebase sync error:', error);
        // Continue with local operation
      }
    }
  }, [state.isConnected, state.facilitatorMode, state.sessionId]);

  // 🔥 VOTING function for participants
  const submitVote = React.useCallback(async (vote) => {
    if (state.hasVoted) return;

    // Local vote immediately
    dispatch({ type: 'SET_HAS_VOTED' });
    dispatch({ type: 'SUBMIT_POLL_RESPONSE', payload: vote });

    // Firebase vote if connected
    if (state.isConnected && state.sessionId) {
      try {
        await firebaseService.votePoll(state.sessionId, vote);
        console.log('📡 Vote submitted to Firebase:', vote);
      } catch (error) {
        console.error('Firebase vote error:', error);
      }
    }
  }, [state.hasVoted, state.isConnected, state.sessionId]);

  const contextValue = {
    state,
    dispatch: enhancedDispatch,
    submitVote,
    // Helper functions
    isFirebaseConnected: state.isConnected,
    connectionStatus: state.isConnected ? '🟢 Connesso' : '🟡 Locale'
  };

  return (
    <AppContext.Provider value={contextValue}>
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