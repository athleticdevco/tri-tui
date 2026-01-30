import React, { useState, useCallback, useEffect } from 'react';
import { Box, useApp, useInput } from 'ink';
import type { View, Column, AthleteDetail } from './api/types.js';
import { getAthleteDetails } from './api/athletes.js';
import { useRankings, useSearch } from './hooks/index.js';
import {
  Header,
  StatusBar,
  SearchInput,
  SearchResults,
  RankingsView,
  AthleteProfile,
} from './components/index.js';

export function App() {
  const { exit } = useApp();

  // View state
  const [view, setView] = useState<View>('rankings');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Rankings state
  const { rankings, isLoading: rankingsLoading, error: rankingsError, refresh } = useRankings();
  const [activeColumn, setActiveColumn] = useState<Column>('men');
  const [rankingIndex, setRankingIndex] = useState(0);

  // Search state
  const { query, setQuery, results, isLoading: searchLoading, error: searchError, clearSearch } = useSearch();
  const [searchIndex, setSearchIndex] = useState(0);

  // Athlete detail state
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteDetail | null>(null);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [selectedRank, setSelectedRank] = useState<number | undefined>();

  // Get current list length for navigation bounds
  const getCurrentListLength = useCallback(() => {
    if (isSearchFocused && results.length > 0) {
      return results.length;
    }
    if (view === 'rankings' && rankings) {
      return activeColumn === 'men' ? rankings.men.length : rankings.women.length;
    }
    return 0;
  }, [isSearchFocused, results, view, rankings, activeColumn]);

  // Load athlete details
  const loadAthlete = useCallback(async (athleteId: number, rank?: number) => {
    setAthleteLoading(true);
    setSelectedRank(rank);
    setView('athlete');
    const athlete = await getAthleteDetails(athleteId);
    setSelectedAthlete(athlete);
    setAthleteLoading(false);
  }, []);

  // Handle keyboard input
  useInput((input, key) => {
    // Global quit
    if (input === 'q' && !isSearchFocused) {
      exit();
      return;
    }

    // Search focus toggle
    if (input === '/' && !isSearchFocused && view !== 'athlete') {
      setIsSearchFocused(true);
      return;
    }

    // Escape handling
    if (key.escape) {
      if (isSearchFocused) {
        setIsSearchFocused(false);
        clearSearch();
        setSearchIndex(0);
      } else if (view === 'athlete') {
        setView('rankings');
        setSelectedAthlete(null);
      }
      return;
    }

    // Refresh
    if (input === 'r' && !isSearchFocused && view === 'rankings') {
      refresh();
      return;
    }

    // Navigation when search is focused with results
    if (isSearchFocused && results.length > 0) {
      const maxIndex = results.length - 1;

      if (key.downArrow || input === 'j') {
        setSearchIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setSearchIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const athlete = results[searchIndex];
        if (athlete) {
          setIsSearchFocused(false);
          loadAthlete(athlete.athlete_id);
          clearSearch();
          setSearchIndex(0);
        }
        return;
      }
    }

    // Rankings navigation
    if (view === 'rankings' && !isSearchFocused && rankings) {
      const maxIndex = getCurrentListLength() - 1;

      if (key.downArrow || input === 'j') {
        setRankingIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setRankingIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.tab) {
        setActiveColumn(prev => prev === 'men' ? 'women' : 'men');
        setRankingIndex(0);
        return;
      }
      if (key.return) {
        const list = activeColumn === 'men' ? rankings.men : rankings.women;
        const athlete = list[rankingIndex];
        if (athlete) {
          loadAthlete(athlete.athlete_id, rankingIndex + 1);
        }
        return;
      }
    }
  });

  // Reset search index when results change
  useEffect(() => {
    setSearchIndex(0);
  }, [results]);

  return (
    <Box flexDirection="column" padding={1}>
      <Header />

      <SearchInput
        value={query}
        onChange={setQuery}
        isLoading={searchLoading}
        isFocused={isSearchFocused}
      />

      {isSearchFocused && results.length > 0 && (
        <SearchResults
          results={results}
          selectedIndex={searchIndex}
          error={searchError}
        />
      )}

      {!isSearchFocused && view === 'rankings' && rankings && (
        <RankingsView
          men={rankings.men}
          women={rankings.women}
          isLoading={rankingsLoading}
          error={rankingsError}
          activeColumn={activeColumn}
          selectedIndex={rankingIndex}
        />
      )}

      {!isSearchFocused && view === 'rankings' && rankingsLoading && (
        <RankingsView
          men={[]}
          women={[]}
          isLoading={true}
          activeColumn={activeColumn}
          selectedIndex={0}
        />
      )}

      {view === 'athlete' && (
        <AthleteProfile
          athlete={selectedAthlete}
          isLoading={athleteLoading}
          rank={selectedRank}
        />
      )}

      <StatusBar view={view} isSearchFocused={isSearchFocused} />
    </Box>
  );
}
