import React from 'react';
import { Box, Text } from 'ink';
import type { TriEvent } from '../api/types.js';
import { formatDate, truncate } from '../utils/format.js';
import { nocToFlag } from '../utils/flags.js';

interface EventCardProps {
  event: TriEvent;
  isSelected?: boolean;
  compact?: boolean;
}

export function EventCard({
  event,
  isSelected = false,
  compact = false,
}: EventCardProps) {
  const title = compact ? truncate(event.event_title, 35) : event.event_title;
  const date = event.event_date ? formatDate(event.event_date) : '';
  const flag = event.event_country_noc ? nocToFlag(event.event_country_noc) : '';

  return (
    <Box>
      <Text>
        {isSelected ? (
          <Text color="cyan" bold>{'> '}</Text>
        ) : (
          <Text>{'  '}</Text>
        )}
        <Text bold={isSelected} color={isSelected ? 'cyan' : 'white'}>
          {title}
        </Text>
        {flag && <Text> {flag}</Text>}
        {date && <Text dimColor> {date}</Text>}
      </Text>
    </Box>
  );
}
