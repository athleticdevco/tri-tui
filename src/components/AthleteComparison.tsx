import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail } from '../api/types.js';
import { nocToFlag } from '../utils/flags.js';
import { compareAthletes, calculateSplitStrength, getStrengthLabel } from '../utils/stats.js';
import { Spinner } from './Spinner.js';

interface AthleteComparisonProps {
  athlete1: AthleteDetail | null;
  athlete2: AthleteDetail | null;
  isLoading: boolean;
  error?: string | null;
}

function ComparisonBar({ value1, value2, width = 10 }: { value1: number; value2: number; width?: number }) {
  const total = value1 + value2;
  if (total === 0) return <Text dimColor>{'─'.repeat(width * 2 + 3)}</Text>;
  
  const left = Math.round((value1 / total) * width);
  const right = width - left;
  
  return (
    <>
      <Text color="cyan">{'█'.repeat(left)}{'░'.repeat(width - left)}</Text>
      <Text dimColor>{' │ '}</Text>
      <Text color="magenta">{'░'.repeat(width - right)}{'█'.repeat(right)}</Text>
    </>
  );
}

export function AthleteComparison({
  athlete1,
  athlete2,
  isLoading,
  error,
}: AthleteComparisonProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={2}>
        <Spinner label="Loading comparison..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box marginY={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  if (!athlete1 || !athlete2) {
    return (
      <Box marginY={1}>
        <Text dimColor>Select two athletes to compare</Text>
      </Box>
    );
  }

  const comparisons = compareAthletes(athlete1, athlete2);
  const strength1 = calculateSplitStrength(athlete1.latest_results || []);
  const strength2 = calculateSplitStrength(athlete2.latest_results || []);

  const name1 = athlete1.athlete_full_name || athlete1.athlete_title;
  const name2 = athlete2.athlete_full_name || athlete2.athlete_title;
  const flag1 = nocToFlag(athlete1.athlete_noc);
  const flag2 = nocToFlag(athlete2.athlete_noc);

  const colWidth = 18;

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box marginBottom={1} justifyContent="space-between">
        <Box flexDirection="column" width={colWidth}>
          <Text bold color="cyan">{name1.slice(0, colWidth - 2)}</Text>
          <Text>{flag1} {athlete1.athlete_noc}</Text>
        </Box>
        <Box>
          <Text bold dimColor>  VS  </Text>
        </Box>
        <Box flexDirection="column" width={colWidth}>
          <Text bold color="magenta">{name2.slice(0, colWidth - 2)}</Text>
          <Text>{flag2} {athlete2.athlete_noc}</Text>
        </Box>
      </Box>

      <Text dimColor>{'━'.repeat(colWidth * 2 + 8)}</Text>

      {/* Stats Comparison */}
      <Box flexDirection="column" marginY={1}>
        <Text bold>Career Stats</Text>
        {comparisons.map((comp, idx) => (
          <Box key={idx} justifyContent="space-between">
            <Text 
              color={comp.winner === 1 ? 'green' : comp.winner === 0 ? 'white' : 'white'}
              bold={comp.winner === 1}
            >
              {String(comp.athlete1Value).padStart(colWidth - 2)}
            </Text>
            <Text dimColor>{`  ${comp.field.padStart(12).padEnd(12)}  `}</Text>
            <Text 
              color={comp.winner === 2 ? 'green' : comp.winner === 0 ? 'white' : 'white'}
              bold={comp.winner === 2}
            >
              {String(comp.athlete2Value).padEnd(colWidth - 2)}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Split Strength Comparison */}
      {(strength1 || strength2) && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Discipline Strength</Text>
          <Text dimColor>{'─'.repeat(colWidth * 2 + 8)}</Text>
          
          {/* Swim */}
          <Box>
            <Box width={colWidth}>
              {strength1 && (
                <Text color={getStrengthLabel(strength1.swim).color}>
                  {`${strength1.swim}%`.padStart(colWidth - 2)}
                </Text>
              )}
            </Box>
            <Text color="cyan">{`  ${'Swim'.padStart(6).padEnd(12)}  `}</Text>
            <Box width={colWidth}>
              {strength2 && (
                <Text color={getStrengthLabel(strength2.swim).color}>
                  {`${strength2.swim}%`}
                </Text>
              )}
            </Box>
          </Box>

          {/* Bike */}
          <Box>
            <Box width={colWidth}>
              {strength1 && (
                <Text color={getStrengthLabel(strength1.bike).color}>
                  {`${strength1.bike}%`.padStart(colWidth - 2)}
                </Text>
              )}
            </Box>
            <Text color="yellow">{`  ${'Bike'.padStart(6).padEnd(12)}  `}</Text>
            <Box width={colWidth}>
              {strength2 && (
                <Text color={getStrengthLabel(strength2.bike).color}>
                  {`${strength2.bike}%`}
                </Text>
              )}
            </Box>
          </Box>

          {/* Run */}
          <Box>
            <Box width={colWidth}>
              {strength1 && (
                <Text color={getStrengthLabel(strength1.run).color}>
                  {`${strength1.run}%`.padStart(colWidth - 2)}
                </Text>
              )}
            </Box>
            <Text color="red">{`  ${'Run'.padStart(6).padEnd(12)}  `}</Text>
            <Box width={colWidth}>
              {strength2 && (
                <Text color={getStrengthLabel(strength2.run).color}>
                  {`${strength2.run}%`}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Visual bar comparison */}
      {strength1 && strength2 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold dimColor>Head to Head</Text>
          <Box>
            <Text dimColor>Swim  </Text>
            <ComparisonBar value1={strength1.swim} value2={strength2.swim} />
          </Box>
          <Box>
            <Text dimColor>Bike  </Text>
            <ComparisonBar value1={strength1.bike} value2={strength2.bike} />
          </Box>
          <Box>
            <Text dimColor>Run   </Text>
            <ComparisonBar value1={strength1.run} value2={strength2.run} />
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>Press Esc to exit comparison</Text>
      </Box>
    </Box>
  );
}
