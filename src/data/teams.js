// src/data/teams.js

// Explicit franchise sequence requested by the project owner. Keeping this as
// data avoids accidental UI changes caused by object insertion order.
export const TEAM_ORDER = [
  'hawks', 'celtics', 'nets', 'hornets', 'bulls', 'cavaliers',
  'mavericks', 'nuggets', 'pistons', 'warriors', 'rockets', 'pacers',
  'clippers', 'lakers', 'grizzlies', 'heat', 'bucks', 'timberwolves',
  'pelicans', 'knicks', 'thunder', 'magic', 'sixers', 'suns',
  'trailblazers', 'kings', 'spurs', 'raptors', 'jazz', 'wizards',
  'freeagent',
];

export const TEAM_ABBR = {
  hawks: 'ATL', celtics: 'BOS', nets: 'BKN', hornets: 'CHA', bulls: 'CHI', cavaliers: 'CLE',
  mavericks: 'DAL', nuggets: 'DEN', pistons: 'DET', warriors: 'GSW', rockets: 'HOU', pacers: 'IND',
  clippers: 'LAC', lakers: 'LAL', grizzlies: 'MEM', heat: 'MIA', bucks: 'MIL', timberwolves: 'MIN',
  pelicans: 'NOP', knicks: 'NYK', thunder: 'OKC', magic: 'ORL', sixers: 'PHI', suns: 'PHX',
  trailblazers: 'POR', kings: 'SAC', spurs: 'SAS', raptors: 'TOR', jazz: 'UTA', wizards: 'WAS',
  freeagent: 'FA',
};

export const TEAM_NAME = {
  hawks: 'Atlanta Hawks', celtics: 'Boston Celtics', nets: 'Brooklyn Nets', hornets: 'Charlotte Hornets',
  bulls: 'Chicago Bulls', cavaliers: 'Cleveland Cavaliers', mavericks: 'Dallas Mavericks', nuggets: 'Denver Nuggets',
  pistons: 'Detroit Pistons', warriors: 'Golden State Warriors', rockets: 'Houston Rockets', pacers: 'Indiana Pacers',
  clippers: 'Los Angeles Clippers', lakers: 'Los Angeles Lakers', grizzlies: 'Memphis Grizzlies', heat: 'Miami Heat',
  bucks: 'Milwaukee Bucks', timberwolves: 'Minnesota Timberwolves', pelicans: 'New Orleans Pelicans',
  knicks: 'New York Knicks', thunder: 'Oklahoma City Thunder', magic: 'Orlando Magic', sixers: 'Philadelphia 76ers',
  suns: 'Phoenix Suns', trailblazers: 'Portland Trail Blazers', kings: 'Sacramento Kings', spurs: 'San Antonio Spurs',
  raptors: 'Toronto Raptors', jazz: 'Utah Jazz', wizards: 'Washington Wizards', freeagent: 'Free Agents',
};


export const TEAM_SORT_NAME = {
  hawks: 'Hawks',
  celtics: 'Celtics',
  nets: 'Nets',
  hornets: 'Hornets',
  bulls: 'Bulls',
  cavaliers: 'Cavaliers',
  mavericks: 'Mavericks',
  nuggets: 'Nuggets',
  pistons: 'Pistons',
  warriors: 'Warriors',
  rockets: 'Rockets',
  pacers: 'Pacers',
  clippers: 'Clippers',
  lakers: 'Lakers',
  grizzlies: 'Grizzlies',
  heat: 'Heat',
  bucks: 'Bucks',
  timberwolves: 'Timberwolves',
  pelicans: 'Pelicans',
  knicks: 'Knicks',
  thunder: 'Thunder',
  magic: 'Magic',
  sixers: '76ers',
  suns: 'Suns',
  trailblazers: 'Trail Blazers',
  kings: 'Kings',
  spurs: 'Spurs',
  raptors: 'Raptors',
  jazz: 'Jazz',
  wizards: 'Wizards',
  freeagent: 'Free Agents',
};

export const FRANCHISE_SLUGS = TEAM_ORDER.filter((slug) => slug !== 'freeagent');

export function randomFranchise(exclude = []) {
  const excluded = new Set(exclude);
  const pool = FRANCHISE_SLUGS.filter((slug) => !excluded.has(slug));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Primary team colors (match the CSS --team-color values). */
export const TEAM_COLOR = {
  hawks: '#ab112a', celtics: '#0a7035', nets: '#909090', hornets: '#00788c', bulls: '#CE1141',
  cavaliers: '#860038', mavericks: '#1482cb', nuggets: '#fec524', pistons: '#8e0d23', warriors: '#FFC72C',
  rockets: '#CE1141', pacers: '#FDBB30', clippers: '#4891CE', lakers: '#552583', grizzlies: '#6189B9',
  heat: '#98002E', bucks: '#EEE1C6', timberwolves: '#78BE20', pelicans: '#b48c42', knicks: '#F58426',
  thunder: '#007AC1', magic: '#0077c0', sixers: '#006BB6 ', suns: '#E56020', trailblazers: '#E03A3E',
  kings: '#5A2D81', spurs: '#C4CED4', raptors: '#C5050C', jazz: '#7A3A9A', wizards: '#E31837',
  freeagent: 'gray',
};
