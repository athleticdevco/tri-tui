import React from 'react';
import { Box, Text } from 'ink';
import type { SplitStrength } from '../utils/stats.js';
import { getStrengthLabel } from '../utils/stats.js';

interface SplitChartProps {
  strength: SplitStrength | null;
  barWidth?: number;
}

function renderBar(value: number, width: number, color: string): React.ReactNode {
  const filledCount = Math.round((value / 100) * width);
  const emptyCount = width - filledCount;
  
  const filled = '█'.repeat(filledCount);
  const empty = '░'.repeat(emptyCount);

  return (
    <>
      <Text color={color}>{filled}</Text>
      <Text dimColor>{empty}</Text>
    </>
  );
}

export function SplitChart({ strength, barWidth = 12 }: SplitChartProps) {
  if (!strength) {
    return (
      <Box flexDirection="column">
        <Text bold dimColor>Discipline Strength</Text>
        <Text dimColor>No split data available</Text>
      </Box>
    );
  }

  const swimInfo = getStrengthLabel(strength.swim);
  const bikeInfo = getStrengthLabel(strength.bike);
  const runInfo = getStrengthLabel(strength.run);

  return (
    <Box flexDirection="column">
      <Text bold>Discipline Strength</Text>
      <Text dimColor>{'━'.repeat(barWidth + 16)}</Text>
      
      <Box>
        <Text color="cyan">{'Swim  '}</Text>
        {renderBar(strength.swim, barWidth, swimInfo.color)}
        <Text color={swimInfo.color}>{`  ${swimInfo.label}`}</Text>
      </Box>
      
      <Box>
        <Text color="yellow">{'Bike  '}</Text>
        {renderBar(strength.bike, barWidth, bikeInfo.color)}
        <Text color={bikeInfo.color}>{`  ${bikeInfo.label}`}</Text>
      </Box>
      
      <Box>
        <Text color="red">{'Run   '}</Text>
        {renderBar(strength.run, barWidth, runInfo.color)}
        <Text color={runInfo.color}>{`  ${runInfo.label}`}</Text>
      </Box>
    </Box>
  );
}
