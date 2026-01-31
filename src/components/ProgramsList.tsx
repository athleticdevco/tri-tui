import React from 'react';
import { Box, Text } from 'ink';
import type { TriEvent, EventProgram } from '../api/types.js';
import { formatDate, truncate } from '../utils/format.js';
import { Spinner } from './Spinner.js';

interface ProgramsListProps {
  event: TriEvent | null;
  programs: EventProgram[];
  selectedIndex: number;
  isLoading: boolean;
  error?: string | null;
}

export function ProgramsList({
  event,
  programs,
  selectedIndex,
  isLoading,
  error,
}: ProgramsListProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={2}>
        <Spinner label="Loading programs..." />
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
    <Box flexDirection="column" marginY={1}>
      {/* Event Header */}
      {event && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">{event.event_title}</Text>
          {event.event_date && (
            <Text dimColor>{formatDate(event.event_date)}</Text>
          )}
          {event.event_venue && (
            <Text dimColor>{event.event_venue}</Text>
          )}
        </Box>
      )}

      {/* Programs List */}
      <Text dimColor>Programs ({programs.length})</Text>
      <Box flexDirection="column" marginTop={1}>
        {programs.length === 0 ? (
          <Text dimColor>No programs with results available</Text>
        ) : (
          programs.map((program, index) => (
            <Box key={program.prog_id}>
              <Text>
                {index === selectedIndex ? (
                  <Text color="cyan" bold>{'> '}</Text>
                ) : (
                  <Text>{'  '}</Text>
                )}
                <Text bold={index === selectedIndex} color={index === selectedIndex ? 'cyan' : 'white'}>
                  {truncate(program.prog_name, 40)}
                </Text>
                {program.prog_date && (
                  <Text dimColor> {formatDate(program.prog_date)}</Text>
                )}
                {program.results_status === 'published' && (
                  <Text color="green"> [Results]</Text>
                )}
              </Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
