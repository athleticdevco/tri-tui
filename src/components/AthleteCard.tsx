import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail } from '../api/types.js';
import { nocToFlag } from '../utils/flags.js';
import { getPositionColor } from '../utils/colors.js';
import { truncate } from '../utils/format.js';

interface AthleteCardProps {
  athlete: AthleteDetail;
  rank?: number;
  isSelected?: boolean;
  compact?: boolean;
}

export function AthleteCard({
  athlete,
  rank,
  isSelected = false,
  compact = false,
}: AthleteCardProps) {
  const flag = nocToFlag(athlete.athlete_noc);
  const name = athlete.athlete_full_name || athlete.athlete_title;
  const displayName = compact ? truncate(name, 18) : name;

  const rankColor = rank ? getPositionColor(rank) : 'white';

  return (
    <Box>
      {isSelected ? (
        <Text color="cyan" bold>{'› '}</Text>
      ) : (
        <Text dimColor>{'  '}</Text>
      )}
      {rank && (
        <Text color={rankColor} dimColor={!isSelected}>
          {`${rank.toString().padStart(2, ' ')} `}
        </Text>
      )}
      <Text bold={isSelected} color={isSelected ? 'white' : undefined} dimColor={!isSelected}>
        {displayName.padEnd(18)}
      </Text>
      {/* Use fixed width box for flag to ensure consistent alignment */}
      <Box width={3}>
        <Text dimColor={!isSelected}>{flag || ''}</Text>
      </Box>
    </Box>
  );
}
