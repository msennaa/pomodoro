import React from 'react';
import PomodoroTimer from './components/PomodoroTimer';

export default function App() {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTime={ 3000 }
        shortRestTime={ 600 }
        longRestTime={ 2700  }
        cycles={ 3 }
      />
    </div>
  )
}
