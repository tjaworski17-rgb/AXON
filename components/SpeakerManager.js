import { useState, useEffect } from 'react';
import { Users, Edit3, Save, X, UserPlus } from 'lucide-react';

export default function SpeakerManager({ speakers, onSpeakerUpdate, transcripts }) {
  const [speakerNames, setSpeakerNames] = useState({});
  const [speakerRoles, setSpeakerRoles] = useState({});
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempRole, setTempRole] = useState('');

  // Predefined roles for quick selection
  const predefinedRoles = [
    'Coach',
    'Klient',
    'Manager',
    'Lider zespołu',
    'Konsultant',
    'Dyrektor',
    'Specjalista',
    'Analityk',
    'Moderator',
    'Uczestnik'
  ];

  // Speaker colors for consistent identification
  const getSpeakerColor = (speakerId) => {
    const colors = [
      '#3b82f6', // Blue
      '#ef4444', // Red  
      '#10b981', // Green
      '#f59e0b', // Amber
      '#8b5cf6', // Purple
      '#f97316', // Orange
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#ec4899', // Pink
      '#6b7280'  // Gray
    ];
    return colors[speakerId % colors.length];
  };

  // Initialize speaker data when speakers change
  useEffect(() => {
    speakers.forEach(speakerId => {
      if (!speakerNames[speakerId]) {
        setSpeakerNames(prev => ({
          ...prev,
          [speakerId]: `Osoba ${speakerId + 1}`
        }));
      }
      if (!speakerRoles[speakerId]) {
        setSpeakerRoles(prev => ({
          ...prev,
          [speakerId]: 'Uczestnik'
        }));
      }
    });
  }, [speakers, speakerNames, speakerRoles]);

  // Calculate speaker statistics
  const getSpeakerStats = (speakerId) => {
    let wordCount = 0;
    let utteranceCount = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;

    transcripts.forEach(transcript => {
      if (transcript.speakers && transcript.speakers.includes(speakerId)) {
        utteranceCount++;
        totalConfidence += transcript.confidence || 0;
        confidenceCount++;
        
        if (transcript.words) {
          wordCount += transcript.words.filter(word => word.speaker === speakerId).length;
        } else {
          // Estimate word count from transcript text
          wordCount += transcript.text.split(' ').length;
        }
      }
    });

    return {
      wordCount,
      utteranceCount,
      avgConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0
    };
  };

  const startEditing = (speakerId) => {
    setEditingSpeaker(speakerId);
    setTempName(speakerNames[speakerId] || `Osoba ${speakerId + 1}`);
    setTempRole(speakerRoles[speakerId] || 'Uczestnik');
  };

  const saveEditing = () => {
    if (editingSpeaker !== null) {
      const newSpeakerNames = {
        ...speakerNames,
        [editingSpeaker]: tempName
      };
      const newSpeakerRoles = {
        ...speakerRoles,
        [editingSpeaker]: tempRole
      };
      
      setSpeakerNames(newSpeakerNames);
      setSpeakerRoles(newSpeakerRoles);
      
      // Notify parent component
      if (onSpeakerUpdate) {
        onSpeakerUpdate({
          speakerId: editingSpeaker,
          name: tempName,
          role: tempRole,
          color: getSpeakerColor(editingSpeaker)
        });
      }
      
      setEditingSpeaker(null);
      setTempName('');
      setTempRole('');
    }
  };

  const cancelEditing = () => {
    setEditingSpeaker(null);
    setTempName('');
    setTempRole('');
  };

  if (speakers.length === 0) {
    return (
      <div className="speaker-manager empty">
        <div className="empty-state">
          <Users size={32} className="empty-icon" />
          <p>Brak wykrytych mówców</p>
          <small>Mówcy pojawią się automatycznie podczas transkrypcji</small>
        </div>
        
        <style jsx>{`
          .speaker-manager.empty {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          
          .empty-state {
            text-align: center;
            color: #6b7280;
          }
          
          .empty-icon {
            color: #9ca3af;
            margin-bottom: 0.5rem;
          }
          
          .empty-state p {
            margin: 0 0 0.25rem 0;
            font-weight: 500;
          }
          
          .empty-state small {
            font-size: 0.85rem;
            opacity: 0.8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="speaker-manager">
      <div className="manager-header">
        <div className="header-content">
          <Users size={24} className="header-icon" />
          <h3>Zarządzanie mówcami</h3>
          <span className="speaker-count">{speakers.length} {speakers.length === 1 ? 'osoba' : 'osoby'}</span>
        </div>
      </div>

      <div className="speakers-list">
        {Array.from(speakers).sort((a, b) => a - b).map(speakerId => {
          const stats = getSpeakerStats(speakerId);
          const isEditing = editingSpeaker === speakerId;
          
          return (
            <div key={speakerId} className="speaker-card">
              <div className="speaker-header">
                <div 
                  className="speaker-avatar"
                  style={{ backgroundColor: getSpeakerColor(speakerId) }}
                >
                  {(speakerNames[speakerId] || `Osoba ${speakerId + 1}`).charAt(0).toUpperCase()}
                </div>
                
                <div className="speaker-info">
                  {isEditing ? (
                    <div className="editing-form">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="name-input"
                        placeholder="Imię mówcy"
                      />
                      <select
                        value={tempRole}
                        onChange={(e) => setTempRole(e.target.value)}
                        className="role-select"
                      >
                        {predefinedRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="speaker-details">
                      <h4 className="speaker-name">
                        {speakerNames[speakerId] || `Osoba ${speakerId + 1}`}
                      </h4>
                      <p className="speaker-role">
                        {speakerRoles[speakerId] || 'Uczestnik'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="speaker-actions">
                  {isEditing ? (
                    <>
                      <button onClick={saveEditing} className="save-button">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEditing} className="cancel-button">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEditing(speakerId)} className="edit-button">
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="speaker-stats">
                <div className="stat">
                  <span className="stat-label">Wypowiedzi:</span>
                  <span className="stat-value">{stats.utteranceCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Słowa:</span>
                  <span className="stat-value">{stats.wordCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pewność:</span>
                  <span className="stat-value">{Math.round(stats.avgConfidence * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .speaker-manager {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .manager-header {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-icon {
          color: #6b7280;
        }

        .header-content h3 {
          margin: 0;
          color: #374151;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .speaker-count {
          margin-left: auto;
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .speakers-list {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .speaker-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.2s ease;
        }

        .speaker-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .speaker-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .speaker-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .speaker-info {
          flex: 1;
        }

        .speaker-details h4 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
          font-size: 1rem;
          font-weight: 600;
        }

        .speaker-details p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .editing-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .name-input, .role-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .name-input:focus, .role-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .speaker-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-button, .save-button, .cancel-button {
          padding: 0.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-button {
          background: #f3f4f6;
          color: #6b7280;
        }

        .edit-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .save-button {
          background: #10b981;
          color: white;
        }

        .save-button:hover {
          background: #059669;
        }

        .cancel-button {
          background: #ef4444;
          color: white;
        }

        .cancel-button:hover {
          background: #dc2626;
        }

        .speaker-stats {
          display: flex;
          gap: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 0.9rem;
          color: #1f2937;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .manager-header {
            padding: 1rem;
          }
          
          .speakers-list {
            padding: 0.75rem;
          }
          
          .speaker-card {
            padding: 0.75rem;
          }
          
          .speaker-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .speaker-stats {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
