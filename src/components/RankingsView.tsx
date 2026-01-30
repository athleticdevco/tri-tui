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
      <Box justifyContent="center" marginY={2}>
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
    <Box flexDirection="row" gap={4}>
      {/* Men's column */}
      <Box flexDirection="column" flexGrow={1}>
        <Box marginBottom={1}>
          <Text bold color={activeColumn === 'men' ? 'cyan' : 'white'}>
            MEN
          </Text>
          {activeColumn === 'men' && <Text color="cyan"> ◀</Text>}
        </Box>
        <Box
          flexDirection="column"
          borderStyle={activeColumn === 'men' ? 'single' : undefined}
          borderColor="cyan"
          paddingX={activeColumn === 'men' ? 1 : 0}
        >
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
      </Box>

      {/* Women's column */}
      <Box flexDirection="column" flexGrow={1}>
        <Box marginBottom={1}>
          {activeColumn === 'women' && <Text color="cyan">▶ </Text>}
          <Text bold color={activeColumn === 'women' ? 'cyan' : 'white'}>
            WOMEN
          </Text>
        </Box>
        <Box
          flexDirection="column"
          borderStyle={activeColumn === 'women' ? 'single' : undefined}
          borderColor="cyan"
          paddingX={activeColumn === 'women' ? 1 : 0}
        >
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
    </Box>
  );
}
