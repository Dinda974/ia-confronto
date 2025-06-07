import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { firebaseService } from '../../utils/firebase';

function PollParticipant() {
  const { state, dispatch } = useApp();
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(state.hasVoted);

  // 🔥 FIX: Reset state when poll changes or ends
  useEffect(() => {
    if (!state.activePoll) {
      setSelectedResponse(null);
      setHasSubmitted(false);
    } else {
      // Reset if new poll started
      setHasSubmitted(state.hasVoted);
    }
  }, [state.activePoll, state.hasVoted]);

  // Se non c'è un poll attivo, non mostrare nulla
  if (!state.activePoll) {
    return null;
  }

  // Se è facilitatore, non mostrare il poll
  if (state.facilitatorMode) {
    return null;
  }

  const handleSubmit = async () => {
    if (selectedResponse === null || hasSubmitted || state.hasVoted) return;

    try {
      // Vota su Firebase se connesso
      if (state.sessionId && state.isConnected) {
        await firebaseService.votePoll(state.sessionId, selectedResponse);
      } else {
        // Fallback locale se Firebase non disponibile
        dispatch({
          type: 'SUBMIT_POLL_RESPONSE',
          payload: selectedResponse
        });
      }
    
      dispatch({ type: 'SET_HAS_VOTED' });
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error voting:', error);
      // Fallback locale in caso di errore Firebase
      dispatch({
        type: 'SUBMIT_POLL_RESPONSE',
        payload: selectedResponse
      });
      dispatch({ type: 'SET_HAS_VOTED' });
      setHasSubmitted(true);
    }
  };

  // 🔥 FIX: Add close functionality for participants
  const handleClose = () => {
    // Reset local state
    setSelectedResponse(null);
    setHasSubmitted(false);
    
    // This will hide the component
    dispatch({ type: 'END_POLL' });
  };

  return (
    <div className="poll-overlay">
      <div className="poll-container">
        <div className="poll-header">
          <h3>📊 Poll Live</h3>
          <div className="poll-header-actions">
            <div className="connection-status">
              {state.isConnected ? (
                <span className="connected">🟢 Connesso</span>
              ) : (
                <span className="disconnected">🟡 Locale</span>
              )}
            </div>
            {/* 🔥 FIX: Add close button for participants */}
            <button className="poll-close-btn" onClick={handleClose}>
              ×
            </button>
          </div>
        </div>

        <div className="poll-question">
          <h4>{state.activePoll.question}</h4>
        </div>

        {!hasSubmitted && !state.hasVoted ? (
          <div className="poll-options">
            <button
              className={`poll-option ${selectedResponse === 'yes' ? 'selected' : ''}`}
              onClick={() => setSelectedResponse('yes')}
            >
              <span className="option-icon">✅</span>
              <span className="option-text">Sì</span>
            </button>
            <button
              className={`poll-option ${selectedResponse === 'no' ? 'selected' : ''}`}
              onClick={() => setSelectedResponse('no')}
            >
              <span className="option-icon">❌</span>
              <span className="option-text">No</span>
            </button>
          </div>
        ) : (
          <div className="poll-submitted">
            <span className="submitted-icon">✅</span>
            <span className="submitted-text">Risposta inviata!</span>
          </div>
        )}

        {!hasSubmitted && !state.hasVoted && selectedResponse && (
          <div className="poll-actions">
            <button className="btn-primary poll-submit-btn" onClick={handleSubmit}>
              ✨ Invia Risposta
            </button>
          </div>
        )}

        {hasSubmitted && (
          <div className="poll-results">
            <h5>📈 Risultati:</h5>
            <div className="results-display">
              <div className="result-item">
                <span>✅ Sì: {state.pollResults.yes || 0}</span>
              </div>
              <div className="result-item">
                <span>❌ No: {state.pollResults.no || 0}</span>
              </div>
            </div>
            {/* 🔥 FIX: Close button after voting */}
            <div className="poll-actions">
              <button className="btn-secondary" onClick={handleClose}>
                🚪 Chiudi Poll
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollParticipant;