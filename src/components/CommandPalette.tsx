import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail, TriEvent } from '../api/types.js';
import { nocToFlag } from '../utils/flags.js';
import { formatDate, truncate } from '../utils/format.js';
import { getPositionColor } from '../utils/colors.js';
import { Spinner } from './Spinner.js';

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
}

interface CommandPaletteProps {
  commands: Command[];
  filter: string;
  selectedIndex: number;
  // Preview data
  athletes?: AthleteDetail[];
  events?: TriEvent[];
  athletesLoading?: boolean;
  eventsLoading?: boolean;
}

export function CommandPalette({
  commands,
  filter,
  selectedIndex,
  athletes = [],
  events = [],
  athletesLoading = false,
  eventsLoading = false,
}: CommandPaletteProps) {
  // Filter commands based on input (excluding the leading /)
  const filterText = filter.startsWith('/') ? filter.slice(1).toLowerCase() : filter.toLowerCase();

  const filteredCommands = commands.filter(cmd => {
    const matchesName = cmd.name.toLowerCase().startsWith(filterText);
    const matchesAlias = cmd.aliases?.some(a => a.toLowerCase().startsWith(filterText));
    return matchesName || matchesAlias;
  });

  // Determine which preview to show based on selected command
  const selectedCommand = filteredCommands[selectedIndex];
  const showAthletesPreview = selectedCommand?.name === 'athletes';
  const showEventsPreview = selectedCommand?.name === 'events';

  if (filteredCommands.length === 0) {
    return (
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>No matching commands</Text>
      </Box>
    );
  }

  return (
    <Box marginTop={1} flexDirection="column">
      {/* Command list */}
      {filteredCommands.map((cmd, index) => {
        const isSelected = index === selectedIndex;
        const displayName = `/${cmd.name}`;

        return (
          <Box key={cmd.name}>
            <Text color={isSelected ? 'cyan' : 'gray'}>
              {displayName.padEnd(18)}
            </Text>
            <Text color={isSelected ? 'white' : 'gray'}>
              {cmd.description}
            </Text>
          </Box>
        );
      })}

      {/* Athletes preview */}
      {showAthletesPreview && (
        <Box marginTop={1} flexDirection="column">
          <Text dimColor bold>Top Ranked Athletes</Text>
          {athletesLoading ? (
            <Box marginTop={1}>
              <Spinner label="Loading..." />
            </Box>
          ) : (
            <Box marginTop={1} flexDirection="row" gap={4}>
              {/* Men column */}
              <Box flexDirection="column">
                <Text color="cyan" bold>MEN</Text>
                {athletes
                  .filter(a => a.athlete_gender === 'male')
                  .slice(0, 5)
                  .map((athlete, idx) => {
                    const flag = nocToFlag(athlete.athlete_noc);
                    const name = truncate(athlete.athlete_title, 18);
                    return (
                      <Box key={athlete.athlete_id}>
                        <Text color={getPositionColor(idx + 1)}>
                          {`#${(idx + 1).toString().padStart(2, ' ')} `}
                        </Text>
                        <Text>{name}</Text>
                        {flag && <Text> {flag}</Text>}
                      </Box>
                    );
                  })}
              </Box>
              {/* Women column */}
              <Box flexDirection="column">
                <Text color="cyan" bold>WOMEN</Text>
                {athletes
                  .filter(a => a.athlete_gender === 'female')
                  .slice(0, 5)
                  .map((athlete, idx) => {
                    const flag = nocToFlag(athlete.athlete_noc);
                    const name = truncate(athlete.athlete_title, 18);
                    return (
                      <Box key={athlete.athlete_id}>
                        <Text color={getPositionColor(idx + 1)}>
                          {`#${(idx + 1).toString().padStart(2, ' ')} `}
                        </Text>
                        <Text>{name}</Text>
                        {flag && <Text> {flag}</Text>}
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Events preview */}
      {showEventsPreview && (
        <Box marginTop={1} flexDirection="column">
          <Text dimColor bold>Recent Events</Text>
          {eventsLoading ? (
            <Box marginTop={1}>
              <Spinner label="Loading..." />
            </Box>
          ) : (
            <Box marginTop={1} flexDirection="column">
              {events.slice(0, 8).map((event) => {
                const flag = event.event_country_noc ? nocToFlag(event.event_country_noc) : '';
                const title = truncate(event.event_title, 40);
                const date = event.event_date ? formatDate(event.event_date) : '';

                return (
                  <Box key={event.event_id}>
                    <Text>{'  '}</Text>
                    <Text>{title}</Text>
                    {flag && <Text> {flag}</Text>}
                    {date && <Text dimColor> {date}</Text>}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

// Define available commands
export const COMMANDS: Command[] = [
  {
    name: 'athletes',
    aliases: ['a'],
    description: 'Search for athletes by name',
  },
  {
    name: 'events',
    aliases: ['e'],
    description: 'Search for events and race results',
  },
  {
    name: 'rankings',
    aliases: ['r'],
    description: 'Return to WTCS rankings view',
  },
  {
    name: 'help',
    aliases: ['?'],
    description: 'Show keyboard shortcuts and commands',
  },
];

// Helper to filter commands
export function filterCommands(commands: Command[], filter: string): Command[] {
  const filterText = filter.startsWith('/') ? filter.slice(1).toLowerCase() : filter.toLowerCase();

  if (!filterText) return commands;

  return commands.filter(cmd => {
    const matchesName = cmd.name.toLowerCase().startsWith(filterText);
    const matchesAlias = cmd.aliases?.some(a => a.toLowerCase().startsWith(filterText));
    return matchesName || matchesAlias;
  });
}

// Helper to execute a command
export function matchCommand(input: string, commands: Command[]): Command | null {
  const text = input.startsWith('/') ? input.slice(1).toLowerCase() : input.toLowerCase();

  return commands.find(cmd => {
    if (cmd.name.toLowerCase() === text) return true;
    if (cmd.aliases?.some(a => a.toLowerCase() === text)) return true;
    return false;
  }) || null;
}
