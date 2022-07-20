import React from 'react'

interface Props {
  onClick: () => void;
  text: string;
  className?: string;
}

export default function Button(props:Props): JSX.Element {
  const { text, onClick, className } = props;
  return (
    <button className={ className } type="button" onClick={ onClick }>
      { text }
    </button>
  )
}
