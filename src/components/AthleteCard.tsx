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
  const displayName = compact ? truncate(name, 20) : name;

  const rankColor = rank ? getPositionColor(rank) : 'white';

  return (
    <Box>
      <Text>
        {isSelected ? (
          <Text color="cyan" bold>{'▸ '}</Text>
        ) : (
          <Text>{'  '}</Text>
        )}
        {rank && (
          <Text color={rankColor}>
            {`#${rank.toString().padStart(2, ' ')} `}
          </Text>
        )}
        <Text bold={isSelected}>{displayName}</Text>
        {flag && <Text> {flag}</Text>}
      </Text>
    </Box>
  );
}
