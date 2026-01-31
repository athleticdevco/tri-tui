import React from 'react';
import { Box, Text } from 'ink';
import type { TriEvent, EventProgram, RaceResultEntry } from '../api/types.js';
import { formatDate, truncate } from '../utils/format.js';
import { getPositionColor } from '../utils/colors.js';
import { Spinner } from './Spinner.js';

interface RaceResultsViewProps {
  event: TriEvent | null;
  program: EventProgram | null;
  results: RaceResultEntry[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
  visibleCount?: number;
}

function formatTime(time: string | undefined): string {
  if (!time) return '--:--:--';
  // Clean up time format - some come as "HH:MM:SS", some as "MM:SS"
  return time;
}

function padPosition(pos: number | string): string {
  const posStr = String(pos);
  return posStr.padStart(3, ' ');
}

export function RaceResultsView({
  event,
  program,
  results,
  selectedIndex,
  isLoading,
  error,
  visibleCount = 15,
}: RaceResultsViewProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={2}>
        <Spinner label="Loading results..." />
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

  // Calculate visible window around selected index
  const startIndex = Math.max(0, selectedIndex - Math.floor(visibleCount / 2));
  const endIndex = Math.min(results.length, startIndex + visibleCount);
  const visibleResults = results.slice(startIndex, endIndex);

  return (
    <Box flexDirection="column" marginY={1}>
      {/* Event/Program Header */}
      <Box flexDirection="column" marginBottom={1}>
        {event && (
          <Text bold color="cyan">{event.event_title}</Text>
        )}
        {program && (
          <Text color="yellow">{program.prog_name}</Text>
        )}
        {event?.event_date && (
          <Text dimColor>{formatDate(event.event_date)}</Text>
        )}
      </Box>

      {/* Column Headers - fixed width columns for alignment */}
      <Box marginBottom={1}>
        <Text dimColor>
          {'  '}
          {'Pos'}
          {'  '}
          {'Athlete'.padEnd(20)}
          {' '}
          {'NOC'}
          {'  '}
          {'Total'.padEnd(9)}
          {'Swim'.padEnd(9)}
          {'Bike'.padEnd(9)}
          {'Run'}
        </Text>
      </Box>

      {/* Results */}
      {results.length === 0 ? (
        <Text dimColor>No results available</Text>
      ) : (
        <Box flexDirection="column">
          {visibleResults.map((result, idx) => {
            const actualIndex = startIndex + idx;
            const isSelected = actualIndex === selectedIndex;
            const pos = typeof result.position === 'number' ? result.position : parseInt(String(result.position), 10) || 0;
            const posColor = getPositionColor(pos);
            // Use NOC code (3 chars) for consistent alignment in tabular view
            const noc = (result.athlete_noc || '').padEnd(3).slice(0, 3);

            return (
              <Box key={`${result.athlete_id}-${actualIndex}`}>
                <Text>
                  {isSelected ? (
                    <Text color="cyan" bold>{'> '}</Text>
                  ) : (
                    <Text>{'  '}</Text>
                  )}
                  <Text color={posColor} bold={pos <= 3}>
                    {padPosition(result.position)}
                  </Text>
                  {'  '}
                  <Text bold={isSelected} color={isSelected ? 'cyan' : 'white'}>
                    {truncate(result.athlete_title, 20).padEnd(20)}
                  </Text>
                  {' '}
                  <Text dimColor>{noc}</Text>
                  {'  '}
                  <Text color={isSelected ? 'cyan' : 'white'}>
                    {formatTime(result.total_time).padEnd(9)}
                  </Text>
                  <Text color="cyan">{formatTime(result.swim_time).padEnd(9)}</Text>
                  <Text color="yellow">{formatTime(result.bike_time).padEnd(9)}</Text>
                  <Text color="red">{formatTime(result.run_time)}</Text>
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Pagination indicator */}
      {results.length > visibleCount && (
        <Box marginTop={1}>
          <Text dimColor>
            Showing {startIndex + 1}-{endIndex} of {results.length}
            {endIndex < results.length && ' \u2193'}
            {startIndex > 0 && ' \u2191'}
          </Text>
        </Box>
      )}
    </Box>
  );
}
