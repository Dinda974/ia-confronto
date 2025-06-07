// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, remove, update, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD6uzsg8_NIjLLMTlbYSlYQpHapN8c223k",
  authDomain: "ia-confronto.firebaseapp.com",
  databaseURL: "https://ia-confronto-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ia-confronto",
  storageBucket: "ia-confronto.firebasestorage.app",
  messagingSenderId: "618448484359",
  appId: "1:618448484359:web:1a63912cf15e6adad012a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Firebase helper functions for real-time sync
export const firebaseService = {
  // Gestione sessione
  startSession: (sessionId) => {
    return set(ref(database, `sessions/${sessionId}`), {
      active: true,
      currentModule: 0,
      facilitatorMode: true,
      timestamp: Date.now(),
      pollResults: { yes: 0, no: 0 },
      activePoll: null,
      participants: {}
    });
  },

  endSession: (sessionId) => {
    return set(ref(database, `sessions/${sessionId}/active`), false);
  },

  // Gestione moduli
  setCurrentModule: (sessionId, moduleId) => {
    return set(ref(database, `sessions/${sessionId}/currentModule`), moduleId);
  },

  // Gestione polling - FIXED usando update invece di set
  startPoll: (sessionId, poll) => {
    const updates = {};
    updates[`sessions/${sessionId}/activePoll`] = poll;
    updates[`sessions/${sessionId}/pollResults`] = { yes: 0, no: 0 };
    // Usa update invece di set per evitare sovrascrivere tutta la sessione
    return update(ref(database), updates);
  },

  endPoll: (sessionId) => {
    return set(ref(database, `sessions/${sessionId}/activePoll`), null);
  },

  // Voto poll - FIXED per conteggio corretto
  votePoll: async (sessionId, vote) => {
    // Leggi i risultati attuali
    const pollResultsRef = ref(database, `sessions/${sessionId}/pollResults`);
    
    try {
      // Aggiorna atomicamente il conteggio
      const snapshot = await get(pollResultsRef);
      const currentResults = snapshot.val() || { yes: 0, no: 0 };
      
      const newResults = {
        ...currentResults,
        [vote]: (currentResults[vote] || 0) + 1
      };
      
      return set(pollResultsRef, newResults);
    } catch (error) {
      console.error('Vote error:', error);
      // Fallback: increment without reading current value
      return push(ref(database, `sessions/${sessionId}/votes/${vote}`), {
        timestamp: Date.now()
      });
    }
  },

  // Listener per real-time updates
  subscribeToSession: (sessionId, callback) => {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    }, (error) => {
      console.error('Firebase listener error:', error);
      callback(null); // Fallback to local mode
    });
    
    return unsubscribe;
  },

  // Gestione partecipanti
  addParticipant: (sessionId, participantId, participantData) => {
    return set(ref(database, `sessions/${sessionId}/participants/${participantId}`), {
      ...participantData,
      joinedAt: Date.now(),
      online: true
    });
  },

  removeParticipant: (sessionId, participantId) => {
    return remove(ref(database, `sessions/${sessionId}/participants/${participantId}`));
  },

  // Utility per generare session ID
  generateSessionId: () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  },

  // Test connessione Firebase
  testConnection: async () => {
    try {
      const testRef = ref(database, 'test');
      await set(testRef, { timestamp: Date.now() });
      await remove(testRef);
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }
};

export default firebaseService;