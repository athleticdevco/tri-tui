// Career statistics calculations

import type { RaceResult, AthleteDetail } from '../api/types.js';

export interface CareerStats {
  totalRaces: number;
  bestFinish: number | null;
  avgPosition: number | null;
  winCount: number;
  winRate: number | null;
  podiumRate: number | null;
}

export interface SplitStrength {
  swim: number;  // 0-100 scale
  bike: number;
  run: number;
}

function parseTime(timeStr: string | undefined): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }
  return null;
}

export function calculateCareerStats(results: RaceResult[]): CareerStats {
  if (!results || results.length === 0) {
    return {
      totalRaces: 0,
      bestFinish: null,
      avgPosition: null,
      winCount: 0,
      winRate: null,
      podiumRate: null,
    };
  }

  const positions = results
    .map(r => typeof r.position === 'number' ? r.position : parseInt(String(r.position), 10))
    .filter(p => !isNaN(p) && p > 0);

  const totalRaces = positions.length;
  const bestFinish = positions.length > 0 ? Math.min(...positions) : null;
  const avgPosition = positions.length > 0 
    ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10 
    : null;
  const winCount = positions.filter(p => p === 1).length;
  const podiumCount = positions.filter(p => p <= 3).length;
  const winRate = totalRaces > 0 ? Math.round((winCount / totalRaces) * 100) : null;
  const podiumRate = totalRaces > 0 ? Math.round((podiumCount / totalRaces) * 100) : null;

  return {
    totalRaces,
    bestFinish,
    avgPosition,
    winCount,
    winRate,
    podiumRate,
  };
}

export function calculateSplitStrength(results: RaceResult[]): SplitStrength | null {
  if (!results || results.length === 0) return null;

  // Collect all valid split ratios
  const swimRatios: number[] = [];
  const bikeRatios: number[] = [];
  const runRatios: number[] = [];

  for (const result of results) {
    const total = parseTime(result.total_time);
    const swim = parseTime(result.swim_time);
    const bike = parseTime(result.bike_time);
    const run = parseTime(result.run_time);

    if (total && total > 0) {
      // Calculate what percentage of total time each discipline takes
      // Lower percentage = stronger (faster relative to their total)
      if (swim) swimRatios.push(swim / total);
      if (bike) bikeRatios.push(bike / total);
      if (run) runRatios.push(run / total);
    }
  }

  if (swimRatios.length === 0 && bikeRatios.length === 0 && runRatios.length === 0) {
    return null;
  }

  // Average ratios
  const avgSwim = swimRatios.length > 0 ? swimRatios.reduce((a, b) => a + b, 0) / swimRatios.length : 0.15;
  const avgBike = bikeRatios.length > 0 ? bikeRatios.reduce((a, b) => a + b, 0) / bikeRatios.length : 0.50;
  const avgRun = runRatios.length > 0 ? runRatios.reduce((a, b) => a + b, 0) / runRatios.length : 0.30;

  // Typical Olympic distance ratios: swim ~15%, bike ~50%, run ~30%
  // Deviation from typical = strength indicator
  // If their swim is lower % than typical, they're a stronger swimmer
  const typicalSwim = 0.15;
  const typicalBike = 0.52;
  const typicalRun = 0.30;

  // Convert to strength score (0-100)
  // Positive deviation from typical means weakness, negative means strength
  const swimStrength = Math.max(0, Math.min(100, 50 + (typicalSwim - avgSwim) * 500));
  const bikeStrength = Math.max(0, Math.min(100, 50 + (typicalBike - avgBike) * 200));
  const runStrength = Math.max(0, Math.min(100, 50 + (typicalRun - avgRun) * 300));

  return {
    swim: Math.round(swimStrength),
    bike: Math.round(bikeStrength),
    run: Math.round(runStrength),
  };
}

export function getStrengthLabel(value: number): { label: string; color: string } {
  if (value >= 80) return { label: 'Excellent', color: 'green' };
  if (value >= 60) return { label: 'Strong', color: 'cyan' };
  if (value >= 40) return { label: 'Average', color: 'yellow' };
  if (value >= 20) return { label: 'Developing', color: 'red' };
  return { label: 'Weak', color: 'red' };
}

export interface ComparisonResult {
  field: string;
  athlete1Value: string | number;
  athlete2Value: string | number;
  winner: 1 | 2 | 0; // 0 = tie
}

export function compareAthletes(
  athlete1: AthleteDetail,
  athlete2: AthleteDetail
): ComparisonResult[] {
  const stats1 = calculateCareerStats(athlete1.latest_results || []);
  const stats2 = calculateCareerStats(athlete2.latest_results || []);

  const results: ComparisonResult[] = [];

  // Wins (higher is better)
  results.push({
    field: 'Wins',
    athlete1Value: athlete1.race_wins || stats1.winCount,
    athlete2Value: athlete2.race_wins || stats2.winCount,
    winner: (athlete1.race_wins || stats1.winCount) > (athlete2.race_wins || stats2.winCount) ? 1 :
            (athlete1.race_wins || stats1.winCount) < (athlete2.race_wins || stats2.winCount) ? 2 : 0,
  });

  // Podiums (higher is better)
  results.push({
    field: 'Podiums',
    athlete1Value: athlete1.race_podiums || 0,
    athlete2Value: athlete2.race_podiums || 0,
    winner: (athlete1.race_podiums || 0) > (athlete2.race_podiums || 0) ? 1 :
            (athlete1.race_podiums || 0) < (athlete2.race_podiums || 0) ? 2 : 0,
  });

  // Best Finish (lower is better)
  if (stats1.bestFinish !== null || stats2.bestFinish !== null) {
    const v1 = stats1.bestFinish ?? 999;
    const v2 = stats2.bestFinish ?? 999;
    results.push({
      field: 'Best Finish',
      athlete1Value: stats1.bestFinish !== null ? `#${stats1.bestFinish}` : '-',
      athlete2Value: stats2.bestFinish !== null ? `#${stats2.bestFinish}` : '-',
      winner: v1 < v2 ? 1 : v1 > v2 ? 2 : 0,
    });
  }

  // Avg Position (lower is better)
  if (stats1.avgPosition !== null || stats2.avgPosition !== null) {
    const v1 = stats1.avgPosition ?? 999;
    const v2 = stats2.avgPosition ?? 999;
    results.push({
      field: 'Avg Position',
      athlete1Value: stats1.avgPosition !== null ? stats1.avgPosition.toFixed(1) : '-',
      athlete2Value: stats2.avgPosition !== null ? stats2.avgPosition.toFixed(1) : '-',
      winner: v1 < v2 ? 1 : v1 > v2 ? 2 : 0,
    });
  }

  // Win Rate (higher is better)
  if (stats1.winRate !== null || stats2.winRate !== null) {
    results.push({
      field: 'Win Rate',
      athlete1Value: stats1.winRate !== null ? `${stats1.winRate}%` : '-',
      athlete2Value: stats2.winRate !== null ? `${stats2.winRate}%` : '-',
      winner: (stats1.winRate || 0) > (stats2.winRate || 0) ? 1 :
              (stats1.winRate || 0) < (stats2.winRate || 0) ? 2 : 0,
    });
  }

  // Total Races (higher shows more experience)
  results.push({
    field: 'Total Races',
    athlete1Value: stats1.totalRaces,
    athlete2Value: stats2.totalRaces,
    winner: stats1.totalRaces > stats2.totalRaces ? 1 :
            stats1.totalRaces < stats2.totalRaces ? 2 : 0,
  });

  return results;
}
