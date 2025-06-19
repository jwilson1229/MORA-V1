import React from 'react';
import moraIcon from '../assets/mora.png';
import userIcon from '../assets/user.png';
import './SpeakerIcons.css';

type Props = {
  isMoraSpeaking: boolean;
};

export const SpeakerIcons: React.FC<Props> = ({ isMoraSpeaking }) => {
  return (
    <div className="speaker-container">
      <img
        src={userIcon}
        alt="User"
        className={`speaker-icon ${!isMoraSpeaking ? 'active' : ''}`}
      />
      <img
        src={moraIcon}
        alt="MORA"
        className={`speaker-icon ${isMoraSpeaking ? 'active' : ''}`}
      />
    </div>
  );
};
