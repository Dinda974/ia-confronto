// Utility per gestire il localStorage in modo sicuro

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Errore nel leggere dal localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Errore nel salvare nel localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Errore nel rimuovere dal localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Errore nel pulire il localStorage:', error);
      return false;
    }
  }
};

// Salvataggio automatico del progresso
export const saveProgress = (state) => {
  storage.set('ia-confronto-progress', {
    userProfile: state.userProfile,
    progress: state.progress,
    currentStep: state.currentStep,
    assessmentAnswers: state.assessmentAnswers,
    timestamp: new Date().toISOString()
  });
};

// Caricamento del progresso salvato
export const loadProgress = () => {
  return storage.get('ia-confronto-progress', null);
};