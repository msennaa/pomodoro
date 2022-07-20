import React, { useCallback, useEffect, useState } from 'react'
import { useInterval } from '../hooks/use-interval';
import { secondsToTimes } from '../utils/secondsToTime';
import Button from './Button';
import Timer from './Timer';

const bellStart = require('../sounds/bell-start.mp3');
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);


interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export default function PomodoroTimer(props: Props): JSX.Element {
  const { pomodoroTime, longRestTime, shortRestTime, cycles } = props;
  const [mainTime, setMainTime] = useState(pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoro, setNumberOfPomodoro] = useState(0);

  useInterval(() => {
    setMainTime(mainTime - 1);
    if (working) setFullWorkingTime(fullWorkingTime + 1);
  }, timeCounting ? 1000 : null);

  const configWorking = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(pomodoroTime);
    audioStartWorking.play();
  },[setTimeCounting, setWorking, setResting, setMainTime, pomodoroTime]);

  const configRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (long) {
      setMainTime(longRestTime) 
    } else {
      setMainTime(shortRestTime)
    }

    audioStopWorking.play();
  },[setTimeCounting, setWorking, setResting, setMainTime, longRestTime, shortRestTime])

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configRest(false);
      setCyclesQtdManager(new Array(cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoro(numberOfPomodoro + 1);
    if (resting) configWorking();

  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoro,
    configRest,
    configWorking,
    setCyclesQtdManager,
    cycles,
    completedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Você está: { working ? 'trabalhando' : 'descansando' }</h2>
      <Timer mainTime={ mainTime } />
      <div className="controls">
        <Button text="Work" onClick={ () => configWorking() } />
        <Button
          className={ !working && !resting ? 'hidden' : '' } 
          text={ timeCounting ? 'Pause' : 'Play' }
          onClick={ () => setTimeCounting(!timeCounting) }
        />
        <Button text="Rest" onClick={ () => configRest(false) } />
      </div>
      <div className="details">
        <p>Ciclos concluídos: { completedCycles }</p>
        <p>Horas trabalhadas: { secondsToTimes(fullWorkingTime) }</p>
        <p>Pomodoros concluídos: { numberOfPomodoro }</p>
      </div>
    </div>
  )
}
