import React from 'react';
import { Box, Text } from 'ink';
import type { TriEvent } from '../api/types.js';
import { EventCard } from './EventCard.js';
import { Spinner } from './Spinner.js';

interface EventSearchResultsProps {
  results: TriEvent[];
  selectedIndex: number;
  error?: string | null;
  recentEvents?: TriEvent[];
  recentEventsLoading?: boolean;
  showRecent?: boolean;
}

export function EventSearchResults({
  results,
  selectedIndex,
  error,
  recentEvents = [],
  recentEventsLoading = false,
  showRecent = false,
}: EventSearchResultsProps) {
  if (error) {
    return (
      <Box marginY={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  // Show recent events when no search query
  if (showRecent && results.length === 0) {
    if (recentEventsLoading) {
      return (
        <Box marginY={1}>
          <Spinner label="Loading recent events..." />
        </Box>
      );
    }

    if (recentEvents.length === 0) {
      return (
        <Box marginY={1}>
          <Text dimColor>Type to search events...</Text>
        </Box>
      );
    }

    return (
      <Box flexDirection="column" marginY={1}>
        <Text dimColor bold>Recent Events (select or type to search)</Text>
        <Box flexDirection="column" marginTop={1}>
          {recentEvents.slice(0, 5).map((event, index) => (
            <EventCard
              key={event.event_id}
              event={event}
              isSelected={index === selectedIndex}
              compact
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="column" marginY={1}>
      <Text dimColor>Events ({results.length})</Text>
      <Box flexDirection="column" marginTop={1}>
        {results.map((event, index) => (
          <EventCard
            key={event.event_id}
            event={event}
            isSelected={index === selectedIndex}
            compact
          />
        ))}
      </Box>
    </Box>
  );
}
