import React from 'react';
import { Box, Text } from 'ink';
import { getLogoColors } from '../utils/theme.js';

// Block-style TRI logo
// Colors auto-flip based on terminal theme (dark/light)
export function Header() {
  const colors = getLogoColors();

  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Box flexDirection="column">
        <Text>
          <Text color={colors.primary} bold>█████</Text>
          <Text color={colors.shadow}>▄</Text>
          <Text> </Text>
          <Text color={colors.primary} bold>████</Text>
          <Text color={colors.shadow}>▄</Text>
          <Text>  </Text>
          <Text color={colors.primary} bold>█</Text>
        </Text>
        <Text>
          <Text color={colors.primary} bold>  █  </Text>
          <Text color={colors.shadow}>█</Text>
          <Text> </Text>
          <Text color={colors.primary} bold>█   █</Text>
          <Text> </Text>
          <Text> </Text>
          <Text color={colors.primary} bold> █</Text>
        </Text>
        <Text>
          <Text color={colors.primary} bold>  █  </Text>
          <Text> </Text>
          <Text> </Text>
          <Text color={colors.primary} bold>████</Text>
          <Text color={colors.shadow}>▀</Text>
          <Text>  </Text>
          <Text color={colors.primary} bold> █</Text>
        </Text>
        <Text>
          <Text color={colors.primary} bold>  █  </Text>
          <Text> </Text>
          <Text> </Text>
          <Text color={colors.primary} bold>█  █</Text>
          <Text> </Text>
          <Text>  </Text>
          <Text color={colors.primary} bold> █</Text>
        </Text>
        <Text>
          <Text color={colors.primary} bold>  █  </Text>
          <Text> </Text>
          <Text> </Text>
          <Text color={colors.primary} bold>█   █</Text>
          <Text> </Text>
          <Text> </Text>
          <Text color={colors.primary} bold>▄█▄</Text>
        </Text>
      </Box>
    </Box>
  );
}
