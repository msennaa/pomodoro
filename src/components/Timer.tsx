import React from 'react'
import { secondsToMinutes } from '../utils/secondsToMinutes';

interface Props {
  mainTime: number;
}

export default function Timer(props:Props): JSX.Element {
  const { mainTime } = props;

  return (
    <div className="timer">
      { secondsToMinutes(mainTime) }
    </div>
  )
}
