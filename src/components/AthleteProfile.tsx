import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail } from '../api/types.js';
import { nocToFlag } from '../utils/flags.js';
import { calculateAge, formatYear } from '../utils/format.js';
import { getPositionSymbol, getPositionColor } from '../utils/colors.js';
import { Spinner } from './Spinner.js';

interface AthleteProfileProps {
  athlete: AthleteDetail | null;
  isLoading: boolean;
  rank?: number;
}

export function AthleteProfile({ athlete, isLoading, rank }: AthleteProfileProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={2}>
        <Spinner label="Loading athlete..." />
      </Box>
    );
  }

  if (!athlete) {
    return (
      <Box marginY={1}>
        <Text color="red">Could not load athlete profile.</Text>
      </Box>
    );
  }

  const name = athlete.athlete_full_name || athlete.athlete_title;
  const flag = nocToFlag(athlete.athlete_noc);
  const age = calculateAge(athlete.athlete_yob);
  const results = athlete.latest_results?.slice(0, 6) || [];

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          {rank && (
            <Text color={getPositionColor(rank)}>
              {getPositionSymbol(rank)}{' '}
            </Text>
          )}
          <Text bold color="cyan">
            {name}
          </Text>
          {flag && <Text> {flag}</Text>}
        </Box>
        <Text dimColor>{athlete.athlete_country_name}</Text>
      </Box>

      {/* Stats */}
      <Box
        flexDirection="row"
        gap={4}
        marginBottom={1}
        paddingY={1}
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
      >
        {age && (
          <Box flexDirection="column">
            <Text dimColor>Age</Text>
            <Text bold>{age}</Text>
          </Box>
        )}
        {athlete.race_wins !== undefined && athlete.race_wins > 0 && (
          <Box flexDirection="column">
            <Text dimColor>Wins</Text>
            <Text bold color="yellow">{athlete.race_wins}</Text>
          </Box>
        )}
        {athlete.race_podiums !== undefined && athlete.race_podiums > 0 && (
          <Box flexDirection="column">
            <Text dimColor>Podiums</Text>
            <Text bold>{athlete.race_podiums}</Text>
          </Box>
        )}
      </Box>

      {/* Recent Results */}
      {results.length > 0 && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold>Recent Results</Text>
          </Box>
          <Box flexDirection="column">
            {results.map((result, index) => {
              const position = parseInt(String(result.position), 10);
              const posColor = position <= 3 ? getPositionColor(position) : 'white';
              return (
                <Box key={index} gap={2}>
                  <Text color={posColor}>
                    {position > 0 ? `#${position.toString().padStart(2, ' ')}` : '  —'}
                  </Text>
                  <Text>
                    {result.event_title}
                  </Text>
                  <Text dimColor>
                    {formatYear(result.event_date)}
                  </Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {results.length === 0 && (
        <Text dimColor>No recent results available.</Text>
      )}
    </Box>
  );
}
