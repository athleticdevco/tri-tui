import React from 'react';
import { Box, Text } from 'ink';
import type { View } from '../api/types.js';

interface StatusBarProps {
  view: View;
  isSearchFocused?: boolean;
}

export function StatusBar({ view, isSearchFocused }: StatusBarProps) {
  const hints: Record<View, string[]> = {
    rankings: ['[↑↓/jk] Navigate', '[Tab] Switch column', '[Enter] View', '[/] Search', '[r] Refresh', '[q] Quit'],
    search: ['[↑↓] Navigate', '[Enter] Select', '[Esc] Cancel'],
    athlete: ['[Esc] Back', '[q] Quit'],
  };

  const currentHints = isSearchFocused
    ? hints.search
    : hints[view];

  return (
    <Box marginTop={1} paddingX={1}>
      <Text dimColor>
        {currentHints.join('  ')}
      </Text>
    </Box>
  );
}
