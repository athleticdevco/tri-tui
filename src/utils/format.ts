// Formatting utilities

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function calculateAge(yearOfBirth: string | null): number | null {
  if (!yearOfBirth) return null;
  const currentYear = new Date().getFullYear();
  return currentYear - parseInt(yearOfBirth, 10);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}
