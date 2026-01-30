// Convert NOC (National Olympic Committee) codes to emoji flags

const NOC_TO_ISO: Record<string, string> = {
  // Common triathlon countries
  GBR: 'GB',
  USA: 'US',
  AUS: 'AU',
  NZL: 'NZ',
  FRA: 'FR',
  GER: 'DE',
  ESP: 'ES',
  ITA: 'IT',
  SUI: 'CH',
  BEL: 'BE',
  NED: 'NL',
  POR: 'PT',
  CAN: 'CA',
  MEX: 'MX',
  BRA: 'BR',
  ARG: 'AR',
  CHI: 'CL',
  COL: 'CO',
  JPN: 'JP',
  CHN: 'CN',
  KOR: 'KR',
  RSA: 'ZA',
  NOR: 'NO',
  SWE: 'SE',
  DEN: 'DK',
  AUT: 'AT',
  IRL: 'IE',
  HUN: 'HU',
  POL: 'PL',
  CZE: 'CZ',
  HKG: 'HK',
  SGP: 'SG',
  ISR: 'IL',
  UKR: 'UA',
  RUS: 'RU',
  BER: 'BM',
  BAR: 'BB',
};

export function nocToFlag(noc: string): string {
  const iso = NOC_TO_ISO[noc.toUpperCase()] || noc;

  // Convert ISO code to regional indicator symbols (emoji flags)
  if (iso.length !== 2) return '';

  const offset = 127397; // Regional indicator offset
  return String.fromCodePoint(
    iso.charCodeAt(0) + offset,
    iso.charCodeAt(1) + offset
  );
}

export function getCountryDisplay(noc: string, countryName?: string): string {
  const flag = nocToFlag(noc);
  return flag ? `${flag} ${countryName || noc}` : countryName || noc;
}
