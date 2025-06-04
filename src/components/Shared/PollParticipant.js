import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

function PollParticipant() {
  const { state, dispatch } = useApp();
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Se non c'è un poll attivo, non mostrare nulla
  if (!state.activePoll) {
    return null;
  }

  const handleSubmit = () => {
    if (selectedResponse === null || hasSubmitted) return;

    // Invia la risposta
    dispatch({
      type: 'SUBMIT_POLL_RESPONSE',
      payload: selectedResponse
    });

    setHasSubmitted(true);
  };

  return (
    <div className="poll-overlay">
      <div className="poll-container">
        <div className="poll-header">
          <h3>📊 Poll Live</h3>
        </div>

        <div className="poll-question">
          <h4>{state.activePoll.question}</h4>
        </div>

        {!hasSubmitted ? (
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

        {!hasSubmitted && selectedResponse && (
          <div className="poll-actions">
            <button className="btn-primary" onClick={handleSubmit}>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default PollParticipant;