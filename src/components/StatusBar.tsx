import React from 'react';
import { Box, Text } from 'ink';
import type { View, SearchContext } from '../api/types.js';

interface StatusBarProps {
  view: View;
  isSearchFocused?: boolean;
  searchContext?: SearchContext;
  isCommandMode?: boolean;
}

export function StatusBar({ view, isSearchFocused, searchContext = 'athletes', isCommandMode = false }: StatusBarProps) {
  const hints: Record<View, string[]> = {
    rankings: ['[↑↓/jk] Navigate', '[Tab] Switch column', '[Enter] View', '[/] Commands', '[r] Refresh', '[q] Quit'],
    search: ['[↑↓] Navigate', '[Enter] Select', '[Esc] Cancel'],
    athlete: ['[↑↓/jk] Navigate results', '[Enter] View race', '[c] Compare', '[Esc] Back', '[q] Quit'],
    events: ['[↑↓] Navigate', '[Enter] Select', '[Shift+Tab] Athletes', '[Esc] Cancel'],
    'event-programs': ['[↑↓] Navigate', '[Enter] View results', '[Esc] Back', '[q] Quit'],
    'race-results': ['[↑↓] Navigate', '[Enter] View athlete', '[Esc] Back', '[q] Quit'],
  };

  let currentHints: string[];

  if (isCommandMode) {
    // Command palette mode
    currentHints = ['[↑↓] Navigate', '[Enter] Select command', '[Esc] Cancel'];
  } else if (isSearchFocused) {
    if (searchContext === 'events') {
      currentHints = ['[↑↓] Navigate', '[Enter] Select', '[Shift+Tab] Athletes', '[/] Commands', '[Esc] Cancel'];
    } else {
      currentHints = ['[↑↓] Navigate', '[Enter] Select', '[Shift+Tab] Events', '[/] Commands', '[Esc] Cancel'];
    }
  } else {
    currentHints = hints[view] || hints.rankings;
  }

  return (
    <Box marginTop={1} paddingX={1}>
      <Text dimColor>
        {currentHints.join('  ')}
      </Text>
    </Box>
  );
}
