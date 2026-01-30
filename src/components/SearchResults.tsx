import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail } from '../api/types.js';
import { AthleteCard } from './AthleteCard.js';

interface SearchResultsProps {
  results: AthleteDetail[];
  selectedIndex: number;
  error?: string | null;
}

export function SearchResults({
  results,
  selectedIndex,
  error,
}: SearchResultsProps) {
  if (error) {
    return (
      <Box marginY={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column" marginY={1}>
      <Text dimColor>Search Results ({results.length})</Text>
      <Box flexDirection="column" marginTop={1}>
        {results.map((athlete, index) => (
          <AthleteCard
            key={athlete.athlete_id}
            athlete={athlete}
            isSelected={index === selectedIndex}
          />
        ))}
      </Box>
    </Box>
  );
}
