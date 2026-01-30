import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { Spinner } from './Spinner.js';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  isFocused?: boolean;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  isLoading = false,
  isFocused = false,
  placeholder = 'Search athletes...',
}: SearchInputProps) {
  return (
    <Box marginBottom={1}>
      <Text color={isFocused ? 'cyan' : 'gray'}>{'> '}</Text>
      {isFocused ? (
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <Text dimColor>
          {value || placeholder} <Text color="gray">[/]</Text>
        </Text>
      )}
      {isLoading && (
        <Box marginLeft={1}>
          <Spinner label="" />
        </Box>
      )}
    </Box>
  );
}
