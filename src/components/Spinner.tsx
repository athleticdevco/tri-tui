import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

interface SpinnerProps {
  label?: string;
}

// Discipline configuration
const DISCIPLINES = [
  { name: 'swim', color: 'cyan', char: '≈' },
  { name: 'bike', color: 'yellow', char: '═' },
  { name: 'run', color: 'red', char: '─' },
] as const;

const SEGMENT_WIDTH = 4;
const TOTAL_WIDTH = SEGMENT_WIDTH * 3;

export function Spinner({ label = 'Loading...' }: SpinnerProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Build the progress bar segments
  const segments = DISCIPLINES.map((discipline, idx) => {
    const isActive = idx === phase;
    const segment = (isActive ? discipline.char : '░').repeat(SEGMENT_WIDTH);

    return (
      <Text key={discipline.name} color={isActive ? discipline.color : undefined} dimColor={!isActive}>
        {segment}
      </Text>
    );
  });

  return (
    <Text>
      {segments}
      {'  '}
      <Text dimColor>{label}</Text>
    </Text>
  );
}
