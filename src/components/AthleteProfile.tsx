import React from 'react';
import { Box, Text } from 'ink';
import type { AthleteDetail } from '../api/types.js';
import { nocToFlag } from '../utils/flags.js';
import { calculateAge, formatYear } from '../utils/format.js';
import { getPositionSymbol, getPositionColor } from '../utils/colors.js';
import { calculateCareerStats, calculateSplitStrength, calculateForm, calculateConsistency, calculateSeasonBreakdown } from '../utils/stats.js';
import { SplitChart } from './SplitChart.js';
import { Spinner } from './Spinner.js';

interface AthleteProfileProps {
  athlete: AthleteDetail | null;
  isLoading: boolean;
  rank?: number;
  selectedResultIndex: number;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

export function AthleteProfile({ athlete, isLoading, rank, selectedResultIndex }: AthleteProfileProps) {
  if (isLoading) {
    return (
      <Box justifyContent="center" marginY={2}>
        <Spinner label="Loading athlete..." />
      </Box>
    );
  }

  if (!athlete) {
    return (
      <Box marginY={1}>
        <Text color="red">Could not load athlete profile.</Text>
      </Box>
    );
  }

  const name = athlete.athlete_full_name || athlete.athlete_title;
  const flag = nocToFlag(athlete.athlete_noc);
  const age = calculateAge(athlete.athlete_yob);
  const allResults = athlete.latest_results || [];
  
  // Calculate career stats and split strength
  const careerStats = calculateCareerStats(allResults);
  const splitStrength = calculateSplitStrength(allResults);
  const form = calculateForm(allResults);
  const consistency = calculateConsistency(allResults);
  const seasons = calculateSeasonBreakdown(allResults);

  // Scrolling window logic - show up to 10 results at a time
  const visibleCount = 10;
  const totalResults = allResults.length;
  const maxResults = 15;
  const results = allResults.slice(0, maxResults);

  // Calculate visible window centered on selection
  const halfVisible = Math.floor(visibleCount / 2);
  let startIndex = Math.max(0, selectedResultIndex - halfVisible);
  const endIndex = Math.min(results.length, startIndex + visibleCount);
  // Adjust start if we're near the end
  if (endIndex - startIndex < visibleCount && results.length >= visibleCount) {
    startIndex = Math.max(0, endIndex - visibleCount);
  }
  const visibleResults = results.slice(startIndex, endIndex);

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          {rank && (
            <Text color={getPositionColor(rank)}>
              {getPositionSymbol(rank)}{' '}
            </Text>
          )}
          <Text bold color="cyan">
            {name}
          </Text>
          {flag && <Text> {flag}</Text>}
        </Box>
        <Text dimColor>{athlete.athlete_country_name}</Text>
      </Box>

      {/* Stats */}
      <Box
        flexDirection="row"
        gap={3}
        marginBottom={1}
        paddingY={1}
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
      >
        {age && (
          <Box flexDirection="column">
            <Text dimColor>Age</Text>
            <Text bold>{age}</Text>
          </Box>
        )}
        <Box flexDirection="column">
          <Text dimColor>Races</Text>
          <Text bold>{careerStats.totalRaces}</Text>
        </Box>
        {(athlete.race_wins !== undefined && athlete.race_wins > 0) || careerStats.winCount > 0 ? (
          <Box flexDirection="column">
            <Text dimColor>Wins</Text>
            <Text bold color="yellow">{athlete.race_wins || careerStats.winCount}</Text>
          </Box>
        ) : null}
        {(athlete.race_podiums !== undefined && athlete.race_podiums > 0) && (
          <Box flexDirection="column">
            <Text dimColor>Podiums</Text>
            <Text bold color="cyan">{athlete.race_podiums}</Text>
          </Box>
        )}
        {careerStats.bestFinish && (
          <Box flexDirection="column">
            <Text dimColor>Best</Text>
            <Text bold color={getPositionColor(careerStats.bestFinish)}>#{careerStats.bestFinish}</Text>
          </Box>
        )}
        {careerStats.avgPosition && (
          <Box flexDirection="column">
            <Text dimColor>Avg Pos</Text>
            <Text bold>{careerStats.avgPosition}</Text>
          </Box>
        )}
        {careerStats.winRate !== null && careerStats.winRate > 0 && (
          <Box flexDirection="column">
            <Text dimColor>Win Rate</Text>
            <Text bold color="green">{careerStats.winRate}%</Text>
          </Box>
        )}
        {form && (
          <Box flexDirection="column">
            <Text dimColor>Form</Text>
            <Text bold color={form.color}>{form.symbol}</Text>
          </Box>
        )}
      </Box>

      {/* Split Strength Chart */}
      <Box marginBottom={1}>
        <SplitChart strength={splitStrength} />
      </Box>

      {/* Consistency Stats */}
      {consistency && (
        <Box marginBottom={1} flexDirection="column">
          <Text bold dimColor>Consistency</Text>
          <Box gap={3}>
            <Box flexDirection="column">
              <Text dimColor>Finish Rate</Text>
              <Text bold>{consistency.finishRate}%</Text>
            </Box>
            <Box flexDirection="column">
              <Text dimColor>Streak</Text>
              <Text bold>{consistency.currentStreak}</Text>
            </Box>
            <Box flexDirection="column">
              <Text dimColor>Rating</Text>
              <Text bold color={consistency.color}>{consistency.rating}</Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* Season Summary */}
      {seasons.length > 1 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold dimColor>Season Summary</Text>
          <Box flexDirection="column">
            {seasons.slice(0, 3).map(s => (
              <Box key={s.year} gap={2}>
                <Text>{s.year}</Text>
                <Text dimColor>{s.races} races</Text>
                {s.wins > 0 && <Text color="yellow">{s.wins}W</Text>}
                {s.podiums > 0 && <Text color="cyan">{s.podiums}P</Text>}
                {s.avgPosition && <Text dimColor>avg #{s.avgPosition}</Text>}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Recent Results */}
      {results.length > 0 && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold>Recent Results</Text>
            <Text dimColor>  (Enter to view splits)</Text>
          </Box>

          <Box flexDirection="column">
            {visibleResults.map((result, visibleIdx) => {
              const actualIndex = startIndex + visibleIdx;
              const isSelected = actualIndex === selectedResultIndex;
              const position = parseInt(String(result.position), 10);
              const posColor = position <= 3 ? getPositionColor(position) : 'white';
              const posStr = position > 0 ? `#${position.toString().padStart(2, ' ')}` : '  —';

              return (
                <Box key={actualIndex}>
                  <Text>
                    {isSelected ? <Text color="cyan" bold>{'> '}</Text> : <Text>{'  '}</Text>}
                    <Text color={posColor}>{posStr}</Text>
                    {'  '}
                    <Text bold={isSelected}>{truncate(result.event_title, 32).padEnd(32)}</Text>
                    {'  '}
                    <Text dimColor>{formatYear(result.event_date)}</Text>
                    {result.total_time && (
                      <Text>{'  '}{result.total_time}</Text>
                    )}
                  </Text>
                </Box>
              );
            })}
          </Box>

          {/* Scroll indicator */}
          {results.length > visibleCount && (
            <Box marginTop={1}>
              <Text dimColor>
                Showing {startIndex + 1}-{endIndex} of {Math.min(totalResults, maxResults)}
                {startIndex > 0 ? ' ↑' : ''}
                {endIndex < results.length ? ' ↓' : ''}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {results.length === 0 && (
        <Text dimColor>No recent results available.</Text>
      )}
    </Box>
  );
}
