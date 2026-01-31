import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Text, useApp, useInput, Static } from 'ink';
import type { View, Column, AthleteDetail, SearchContext } from './api/types.js';
import { getAthleteDetails } from './api/athletes.js';
import {
  useRankings,
  useSearch,
  useEventSearch,
  useEventPrograms,
  useRaceResults,
  useRecentEvents,
} from './hooks/index.js';
import {
  Header,
  StatusBar,
  SearchInput,
  SearchResults,
  RankingsView,
  AthleteProfile,
  AthleteComparison,
  EventSearchResults,
  ProgramsList,
  RaceResultsView,
  CommandPalette,
  COMMANDS,
  filterCommands,
  Breadcrumb,
} from './components/index.js';

export function App() {
  const { exit } = useApp();

  // View state
  const [view, setView] = useState<View>('rankings');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchContext, setSearchContext] = useState<SearchContext>('athletes');
  const [showHelp, setShowHelp] = useState(false);

  // Command palette state
  const [commandInput, setCommandInput] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const isCommandMode = isSearchFocused && commandInput.startsWith('/');

  // Rankings state
  const { rankings, isLoading: rankingsLoading, error: rankingsError, refresh } = useRankings();
  const [activeColumn, setActiveColumn] = useState<Column>('men');
  const [rankingIndex, setRankingIndex] = useState(0);

  // Recent events for command palette preview
  const { events: recentEvents, isLoading: recentEventsLoading } = useRecentEvents();

  // Athlete search state
  const { query, setQuery, results, isLoading: searchLoading, error: searchError, clearSearch } = useSearch();
  const [searchIndex, setSearchIndex] = useState(0);

  // Event search state
  const {
    query: eventQuery,
    setQuery: setEventQuery,
    results: eventResults,
    isLoading: eventSearchLoading,
    error: eventSearchError,
    clearSearch: clearEventSearch,
  } = useEventSearch();
  const [eventSearchIndex, setEventSearchIndex] = useState(0);

  // Event programs state
  const {
    event: selectedEvent,
    programs,
    isLoading: programsLoading,
    error: programsError,
    loadPrograms,
    clear: clearPrograms,
  } = useEventPrograms();
  const [programIndex, setProgramIndex] = useState(0);

  // Race results state
  const {
    event: resultsEvent,
    program: resultsProgram,
    results: raceResults,
    isLoading: resultsLoading,
    error: resultsError,
    loadResults,
    clear: clearResults,
  } = useRaceResults();
  const [resultIndex, setResultIndex] = useState(0);

  // Athlete detail state
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteDetail | null>(null);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [selectedRank, setSelectedRank] = useState<number | undefined>();
  const [athleteResultIndex, setAthleteResultIndex] = useState(0);

  // Comparison mode state
  const [compareAthlete, setCompareAthlete] = useState<AthleteDetail | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareSelectIndex, setCompareSelectIndex] = useState(0);

  // Track previous view for back navigation
  const previousViewRef = useRef<View>('rankings');

  // Get filtered commands for current input
  const filteredCommands = filterCommands(COMMANDS, commandInput);

  // Load athlete details
  const loadAthlete = useCallback(async (athleteId: number, rank?: number) => {
    previousViewRef.current = view;
    setAthleteLoading(true);
    setSelectedRank(rank);
    setAthleteResultIndex(0);  // Reset result selection when loading new athlete
    setView('athlete');
    const athlete = await getAthleteDetails(athleteId);
    setSelectedAthlete(athlete);
    setAthleteLoading(false);
  }, [view]);

  // Load comparison athlete
  const loadCompareAthlete = useCallback(async (athleteId: number) => {
    setCompareLoading(true);
    const athlete = await getAthleteDetails(athleteId);
    setCompareAthlete(athlete);
    setCompareLoading(false);
    setIsCompareMode(false); // Exit selection, show comparison
  }, []);

  // Execute a command by name
  const executeCommand = useCallback((commandName: string) => {
    setCommandInput('');
    setCommandIndex(0);

    switch (commandName) {
      case 'athletes':
        setSearchContext('athletes');
        // Stay in search mode, ready for athlete search
        break;
      case 'events':
        setSearchContext('events');
        // Stay in search mode, ready for event search
        break;
      case 'rankings':
        setView('rankings');
        setIsSearchFocused(false);
        clearSearch();
        clearEventSearch();
        clearPrograms();
        clearResults();
        break;
      case 'help':
        setShowHelp(true);
        setIsSearchFocused(false);
        break;
    }
  }, [clearSearch, clearEventSearch, clearPrograms, clearResults]);

  // Handle query changes
  const handleQueryChange = useCallback((value: string) => {
    // If starting with /, enter command mode
    if (value.startsWith('/')) {
      setCommandInput(value);
      setCommandIndex(0);
      // Clear the actual search queries
      setQuery('');
      setEventQuery('');
      return;
    }

    // Normal search
    setCommandInput('');
    if (searchContext === 'athletes') {
      setQuery(value);
    } else {
      setEventQuery(value);
    }
  }, [searchContext, setQuery, setEventQuery]);

  // Handle keyboard input
  useInput((input, key) => {
    // Hide help on any key
    if (showHelp && !key.escape) {
      setShowHelp(false);
      return;
    }

    // Global quit
    if (input === 'q' && !isSearchFocused) {
      exit();
      return;
    }

    // Search focus toggle with /
    if (input === '/' && !isSearchFocused && view === 'rankings') {
      setIsSearchFocused(true);
      setCommandInput('/');
      return;
    }

    // Command palette navigation
    if (isCommandMode && filteredCommands.length > 0) {
      if (key.downArrow || input === 'j') {
        setCommandIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        return;
      }
      if (key.upArrow || input === 'k') {
        setCommandIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const selectedCommand = filteredCommands[commandIndex];
        if (selectedCommand) {
          executeCommand(selectedCommand.name);
        }
        return;
      }
    }

    // Shift+Tab to cycle search context (when not in command mode)
    if (key.tab && key.shift && isSearchFocused && !isCommandMode) {
      setSearchContext(prev => prev === 'athletes' ? 'events' : 'athletes');
      // Clear the other search when switching
      if (searchContext === 'athletes') {
        clearSearch();
        setSearchIndex(0);
      } else {
        clearEventSearch();
        setEventSearchIndex(0);
      }
      return;
    }

    // Escape handling - multi-level back navigation
    if (key.escape) {
      if (showHelp) {
        setShowHelp(false);
        return;
      }
      if (isSearchFocused) {
        setIsSearchFocused(false);
        setCommandInput('');
        clearSearch();
        clearEventSearch();
        setSearchIndex(0);
        setEventSearchIndex(0);
        return;
      }
      if (view === 'athlete') {
        // First check if in compare selection mode
        if (isCompareMode) {
          setIsCompareMode(false);
          setCompareSelectIndex(0);
          return;
        }
        // Then check if viewing comparison
        if (compareAthlete) {
          setCompareAthlete(null);
          return;
        }
        // Go back to previous view
        const prevView = previousViewRef.current;
        if (prevView === 'race-results') {
          setView('race-results');
        } else {
          setView('rankings');
        }
        setSelectedAthlete(null);
        return;
      }
      if (view === 'race-results') {
        const prevView = previousViewRef.current;
        if (prevView === 'athlete') {
          setView('athlete');
        } else {
          setView('event-programs');
        }
        clearResults();
        setResultIndex(0);
        return;
      }
      if (view === 'event-programs') {
        setView('rankings');
        clearPrograms();
        setProgramIndex(0);
        return;
      }
      return;
    }

    // Refresh
    if (input === 'r' && !isSearchFocused && view === 'rankings') {
      refresh();
      return;
    }

    // Navigation when athlete search is focused with results (not in command mode)
    if (isSearchFocused && !isCommandMode && searchContext === 'athletes' && results.length > 0) {
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

    // Navigation when event search is focused with results or recent events (not in command mode)
    const effectiveEventList = eventResults.length > 0 ? eventResults : (!eventQuery ? recentEvents.slice(0, 5) : []);
    if (isSearchFocused && !isCommandMode && searchContext === 'events' && effectiveEventList.length > 0) {
      const maxIndex = effectiveEventList.length - 1;

      if (key.downArrow || input === 'j') {
        setEventSearchIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setEventSearchIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const event = effectiveEventList[eventSearchIndex];
        if (event) {
          setIsSearchFocused(false);
          loadPrograms(event.event_id, event);
          setView('event-programs');
          clearEventSearch();
          setEventSearchIndex(0);
          setProgramIndex(0);
        }
        return;
      }
    }

    // Event programs navigation
    if (view === 'event-programs' && !isSearchFocused && programs.length > 0) {
      const maxIndex = programs.length - 1;

      if (key.downArrow || input === 'j') {
        setProgramIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setProgramIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const program = programs[programIndex];
        if (program && selectedEvent) {
          loadResults(selectedEvent.event_id, program.prog_id, selectedEvent, program);
          setView('race-results');
          setResultIndex(0);
        }
        return;
      }
    }

    // Race results navigation
    if (view === 'race-results' && !isSearchFocused && raceResults.length > 0) {
      const maxIndex = raceResults.length - 1;

      if (key.downArrow || input === 'j') {
        setResultIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setResultIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const result = raceResults[resultIndex];
        if (result) {
          previousViewRef.current = 'race-results';
          loadAthlete(result.athlete_id);
        }
        return;
      }
    }

    // Compare mode athlete selection (escape handled in main escape block)
    if (view === 'athlete' && isCompareMode && rankings) {
      const currentList = activeColumn === 'men' ? rankings.men : rankings.women;
      const maxIndex = currentList.length - 1;

      if (key.downArrow || input === 'j') {
        setCompareSelectIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setCompareSelectIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.tab) {
        setActiveColumn(prev => prev === 'men' ? 'women' : 'men');
        setCompareSelectIndex(0);
        return;
      }
      if (key.return) {
        const athlete = currentList[compareSelectIndex];
        if (athlete && athlete.athlete_id !== selectedAthlete?.athlete_id) {
          loadCompareAthlete(athlete.athlete_id);
        }
        return;
      }
      return;
    }

    // Athlete profile navigation - navigate through results and drill down to races
    if (view === 'athlete' && !isSearchFocused && selectedAthlete?.latest_results?.length && !compareAthlete) {
      const maxIndex = Math.min((selectedAthlete.latest_results.length || 1) - 1, 14); // Cap at 15 results (0-14)

      // Enter compare mode with 'c'
      if (input === 'c' && rankings) {
        setIsCompareMode(true);
        setCompareSelectIndex(0);
        return;
      }

      if (key.downArrow || input === 'j') {
        setAthleteResultIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setAthleteResultIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.return) {
        const result = selectedAthlete.latest_results[athleteResultIndex];
        if (result?.event_id && result?.prog_id) {
          previousViewRef.current = 'athlete';
          loadResults(result.event_id, result.prog_id,
            {
              event_id: result.event_id,
              event_title: result.event_title,
              event_date: result.event_date,
              event_venue: null,
              event_country: null,
            },
            { prog_id: result.prog_id, prog_name: result.prog_name }
          );
          setView('race-results');
          setResultIndex(0);
        }
        return;
      }
    }

    // Rankings navigation
    if (view === 'rankings' && !isSearchFocused && rankings) {
      const currentList = activeColumn === 'men' ? rankings.men : rankings.women;
      const maxIndex = currentList.length - 1;

      if (key.downArrow || input === 'j') {
        setRankingIndex(prev => Math.min(prev + 1, maxIndex));
        return;
      }
      if (key.upArrow || input === 'k') {
        setRankingIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (key.tab && !key.shift) {
        setActiveColumn(prev => prev === 'men' ? 'women' : 'men');
        setRankingIndex(0);
        return;
      }
      if (key.return) {
        const athlete = currentList[rankingIndex];
        if (athlete) {
          loadAthlete(athlete.athlete_id, rankingIndex + 1);
        }
        return;
      }
    }
  });

  // Reset search indices when results change
  useEffect(() => {
    setSearchIndex(0);
  }, [results]);

  useEffect(() => {
    setEventSearchIndex(0);
  }, [eventResults]);

  // Reset command index when filtered commands change
  useEffect(() => {
    setCommandIndex(0);
  }, [commandInput]);

  // Get current query for display
  const displayQuery = isCommandMode
    ? commandInput
    : (searchContext === 'athletes' ? query : eventQuery);

  const currentSearchLoading = searchContext === 'athletes' ? searchLoading : eventSearchLoading;

  // Determine placeholder based on context
  const searchPlaceholder = searchContext === 'athletes'
    ? 'Search athletes... (type / for commands)'
    : 'Search events... (type / for commands)';

  // Combine athletes from rankings for command palette preview
  const previewAthletes = rankings
    ? [...rankings.men, ...rankings.women]
    : [];

  return (
    <Box flexDirection="column" padding={1}>
      {/* Logo renders once and stays at top */}
      <Static items={['header'] as const}>
        {(item) => <Header key={item} />}
      </Static>

      {/* Breadcrumb navigation */}
      {!showHelp && view !== 'rankings' && (
        <Box marginBottom={1}>
          <Breadcrumb
            view={view}
            event={selectedEvent || resultsEvent}
            program={resultsProgram}
            athlete={selectedAthlete}
          />
        </Box>
      )}

      {/* Help overlay */}
      {showHelp && (
        <Box flexDirection="column" marginY={1} borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>
          <Text bold color="cyan">Commands</Text>
          <Text dimColor>Press any key to close</Text>
          <Box marginTop={1} flexDirection="column">
            <Text><Text color="yellow">/athletes</Text>    Search for athletes by name</Text>
            <Text><Text color="yellow">/events</Text>      Search for events and race results</Text>
            <Text><Text color="yellow">/rankings</Text>    Return to WTCS rankings view</Text>
            <Text><Text color="yellow">/help</Text>        Show this help</Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text bold color="cyan">Navigation</Text>
            <Text><Text color="yellow">Shift+Tab</Text>  Cycle between Athletes/Events search</Text>
            <Text><Text color="yellow">Tab</Text>        Switch Men/Women rankings column</Text>
            <Text><Text color="yellow">Esc</Text>        Go back / Cancel search</Text>
            <Text><Text color="yellow">q</Text>          Quit</Text>
          </Box>
        </Box>
      )}

      {/* Search input - shown in rankings view or when focused */}
      {(view === 'rankings' || isSearchFocused) && !showHelp && (
        <SearchInput
          value={displayQuery}
          onChange={handleQueryChange}
          isLoading={!isCommandMode && currentSearchLoading}
          isFocused={isSearchFocused}
          placeholder={searchPlaceholder}
        />
      )}

      {/* Command palette */}
      {isCommandMode && !showHelp && (
        <CommandPalette
          commands={COMMANDS}
          filter={commandInput}
          selectedIndex={commandIndex}
          athletes={previewAthletes}
          athletesLoading={rankingsLoading}
          events={recentEvents}
          eventsLoading={recentEventsLoading}
        />
      )}

      {/* Athlete search results */}
      {isSearchFocused && !isCommandMode && searchContext === 'athletes' && results.length > 0 && !showHelp && (
        <SearchResults
          results={results}
          selectedIndex={searchIndex}
          error={searchError}
        />
      )}

      {/* Event search results */}
      {isSearchFocused && !isCommandMode && searchContext === 'events' && !showHelp && (
        <EventSearchResults
          results={eventResults}
          selectedIndex={eventSearchIndex}
          error={eventSearchError}
          recentEvents={recentEvents}
          recentEventsLoading={recentEventsLoading}
          showRecent={!eventQuery}
        />
      )}

      {/* Rankings view */}
      {!isSearchFocused && view === 'rankings' && !showHelp && (
        <>
          {rankings && (
            <RankingsView
              men={rankings.men}
              women={rankings.women}
              isLoading={rankingsLoading}
              error={rankingsError}
              activeColumn={activeColumn}
              selectedIndex={rankingIndex}
            />
          )}
          {rankingsLoading && !rankings && (
            <RankingsView
              men={[]}
              women={[]}
              isLoading={true}
              activeColumn={activeColumn}
              selectedIndex={0}
            />
          )}
        </>
      )}

      {/* Event programs view */}
      {!isSearchFocused && view === 'event-programs' && !showHelp && (
        <ProgramsList
          event={selectedEvent}
          programs={programs}
          selectedIndex={programIndex}
          isLoading={programsLoading}
          error={programsError}
        />
      )}

      {/* Race results view */}
      {!isSearchFocused && view === 'race-results' && !showHelp && (
        <RaceResultsView
          event={resultsEvent}
          program={resultsProgram}
          results={raceResults}
          selectedIndex={resultIndex}
          isLoading={resultsLoading}
          error={resultsError}
        />
      )}

      {/* Athlete profile view */}
      {view === 'athlete' && !showHelp && !compareAthlete && !isCompareMode && (
        <AthleteProfile
          athlete={selectedAthlete}
          isLoading={athleteLoading}
          rank={selectedRank}
          selectedResultIndex={athleteResultIndex}
        />
      )}

      {/* Compare mode: select second athlete */}
      {view === 'athlete' && !showHelp && isCompareMode && rankings && (
        <Box flexDirection="column">
          <Text bold color="cyan">Select athlete to compare with {selectedAthlete?.athlete_title}</Text>
          <Text dimColor>Tab to switch columns, Enter to select, Esc to cancel</Text>
          <Box marginTop={1}>
            <RankingsView
              men={rankings.men}
              women={rankings.women}
              isLoading={rankingsLoading}
              activeColumn={activeColumn}
              selectedIndex={compareSelectIndex}
            />
          </Box>
        </Box>
      )}

      {/* Athlete comparison view */}
      {view === 'athlete' && !showHelp && compareAthlete && !isCompareMode && (
        <AthleteComparison
          athlete1={selectedAthlete}
          athlete2={compareAthlete}
          isLoading={compareLoading}
        />
      )}

      {!showHelp && (
        <StatusBar
          view={view}
          isSearchFocused={isSearchFocused}
          searchContext={searchContext}
          isCommandMode={isCommandMode}
        />
      )}
    </Box>
  );
}
