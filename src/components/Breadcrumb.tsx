import React from 'react';
import { Box, Text } from 'ink';
import type { View, TriEvent, EventProgram, AthleteDetail } from '../api/types.js';
import { truncate } from '../utils/format.js';

interface BreadcrumbProps {
  view: View;
  event?: TriEvent | null;
  program?: EventProgram | null;
  athlete?: AthleteDetail | null;
}

interface Crumb {
  label: string;
  active: boolean;
}

export function Breadcrumb({ view, event, program, athlete }: BreadcrumbProps) {
  const crumbs: Crumb[] = [];

  // Always start with Rankings
  crumbs.push({
    label: 'Rankings',
    active: view === 'rankings',
  });

  // Event context
  if (event && (view === 'event-programs' || view === 'race-results' || (view === 'athlete' && program))) {
    crumbs.push({
      label: truncate(event.event_title, 20),
      active: view === 'event-programs',
    });
  }

  // Program context
  if (program && (view === 'race-results' || (view === 'athlete' && program))) {
    crumbs.push({
      label: truncate(program.prog_name, 15),
      active: view === 'race-results',
    });
  }

  // Athlete context
  if (athlete && view === 'athlete') {
    crumbs.push({
      label: truncate(athlete.athlete_title || 'Athlete', 20),
      active: true,
    });
  }

  return (
    <Box>
      {crumbs.map((crumb, idx) => (
        <Text key={idx}>
          {idx > 0 && <Text dimColor> › </Text>}
          <Text color={crumb.active ? 'cyan' : undefined} dimColor={!crumb.active} bold={crumb.active}>
            {crumb.label}
          </Text>
        </Text>
      ))}
    </Box>
  );
}
