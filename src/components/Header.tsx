import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'TRI STATS' }: HeaderProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      marginBottom={1}
    >
      <Box justifyContent="center">
        <Text bold color="cyan">
          {title}
        </Text>
        <Text dimColor> - WTCS Rankings</Text>
      </Box>
    </Box>
  );
}
