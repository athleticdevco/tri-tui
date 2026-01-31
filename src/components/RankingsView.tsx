import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail, Column } from '../api/types.js';
import { AthleteCard } from './AthleteCard.js';
import { Spinner } from './Spinner.js';

interface RankingsViewProps {
  men: AthleteDetail[];
  women: AthleteDetail[];
  isLoading: boolean;
  error?: string | null;
  activeColumn: Column;
  selectedIndex: number;
}

export function RankingsView({
  men,
  women,
  isLoading,
  error,
  activeColumn,
  selectedIndex,
}: RankingsViewProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={1}>
        <Spinner label="Loading rankings..." />
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

  return (
    <Box flexDirection="row" gap={2}>
      {/* Men's column */}
      {/* Width: selector(2) + rank(3) + name(18) + flag(3) = 26 */}
      <Box flexDirection="column">
        <Text bold color={activeColumn === 'men' ? 'cyan' : 'gray'}>
          {'MEN'.padEnd(26)}
        </Text>
        <Text dimColor>{'─'.repeat(26)}</Text>
        {men.map((athlete, index) => (
          <AthleteCard
            key={athlete.athlete_id}
            athlete={athlete}
            rank={index + 1}
            isSelected={activeColumn === 'men' && index === selectedIndex}
            compact
          />
        ))}
      </Box>

      {/* Divider */}
      <Box flexDirection="column">
        <Text dimColor>│</Text>
        <Text dimColor>│</Text>
        {men.map((_, i) => (
          <Text key={i} dimColor>│</Text>
        ))}
      </Box>

      {/* Women's column */}
      {/* Width: selector(2) + rank(3) + name(18) + flag(3) = 26 */}
      <Box flexDirection="column">
        <Text bold color={activeColumn === 'women' ? 'cyan' : 'gray'}>
          {'WOMEN'.padEnd(26)}
        </Text>
        <Text dimColor>{'─'.repeat(26)}</Text>
        {women.map((athlete, index) => (
          <AthleteCard
            key={athlete.athlete_id}
            athlete={athlete}
            rank={index + 1}
            isSelected={activeColumn === 'women' && index === selectedIndex}
            compact
          />
        ))}
      </Box>
    </Box>
  );
}
