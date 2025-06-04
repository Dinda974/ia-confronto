import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../Shared/Button';

function WelcomeScreen() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Salva i dati del profilo utente
    dispatch({ 
      type: 'UPDATE_USER_PROFILE', 
      payload: formData 
    });
    
    // Passa al prossimo step
    dispatch({ 
      type: 'SET_STEP', 
      payload: 'assessment' 
    });
  };

  const isFormValid = formData.name && formData.email && formData.role && formData.experience;

  return (
    <div className="welcome-screen fade-in">
      <div className="card card-large">
        <div className="welcome-header">
          <h1>🚀 Benvenuti al Seminario!</h1>
          <p className="welcome-subtitle">
            Dall'Euforia alla Strategia: L'Evoluzione dell'IA nell'Amministrazione Condominiale
          </p>
          <div className="welcome-description">
            <p>
              Oggi esploreremo insieme come l'Intelligenza Artificiale sta trasformando 
              il settore dell'amministrazione condominiale. Dalle competenze avanzate 
              alle implicazioni normative, dalla risoluzione di problemi reali alla 
              visione strategica del futuro.
            </p>
            <div className="features-preview">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Assessment personalizzato</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤝</span>
                <span>Networking intelligente</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛠️</span>
                <span>Workshop interattivi</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Risorse scaricabili</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <h3>Iniziamo con le presentazioni</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nome e Cognome *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Es. Mario Rossi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="mario.rossi@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Ruolo Professionale *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleziona il tuo ruolo</option>
              <option value="amministratore-senior">Amministratore Senior (10+ anni)</option>
              <option value="amministratore-junior">Amministratore Junior (2-10 anni)</option>
              <option value="amministratore-neo">Neo Amministratore (0-2 anni)</option>
              <option value="collaboratore">Collaboratore/Dipendente Studio</option>
              <option value="aspirante">Aspirante Amministratore</option>
              <option value="altro">Altro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Esperienza con l'IA *</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleziona il tuo livello</option>
              <option value="beginner">Principiante - Ho sentito parlare di ChatGPT</option>
              <option value="basic">Base - Ho provato qualche volta ChatGPT</option>
              <option value="intermediate">Intermedio - Uso IA occasionalmente per lavoro</option>
              <option value="advanced">Avanzato - Uso IA regolarmente e conosco diversi strumenti</option>
              <option value="expert">Esperto - Integro IA nei miei workflow quotidiani</option>
            </select>
          </div>

          <div className="form-actions">
            <Button 
              type="submit" 
              variant="primary" 
              size="large"
              disabled={!isFormValid}
            >
              Inizia il tuo Assessment IA 🎯
            </Button>
          </div>
        </form>

        <div className="welcome-footer">
          <p className="privacy-note">
            <strong>Privacy:</strong> I tuoi dati restano sul tuo dispositivo e sono utilizzati 
            solo per personalizzare l'esperienza del seminario. Conformità GDPR garantita.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;