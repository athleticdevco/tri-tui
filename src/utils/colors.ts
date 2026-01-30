// Color utilities for position highlighting

export function getPositionColor(position: number): string {
  switch (position) {
    case 1:
      return 'yellow'; // Gold
    case 2:
      return 'gray'; // Silver
    case 3:
      return '#cd7f32'; // Bronze (brownish)
    default:
      return 'white';
  }
}

export function getPositionSymbol(position: number): string {
  switch (position) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${position}`;
  }
}

export function formatRank(rank: number): string {
  return `#${rank}`;
}
