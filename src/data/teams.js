// src/data/teams.js
export const TEAM_ABBR = {
  hawks: 'ATL', celtics: 'BOS', nets: 'BKN', hornets: 'CHA', bulls: 'CHI', cavaliers: 'CLE',
  mavericks: 'DAL', nuggets: 'DEN', pistons: 'DET', warriors: 'GSW', rockets: 'HOU', pacers: 'IND',
  clippers: 'LAC', lakers: 'LAL', grizzlies: 'MEM', heat: 'MIA', bucks: 'MIL', timberwolves: 'MIN',
  pelicans: 'NOP', knicks: 'NYK', thunder: 'OKC', magic: 'ORL', sixers: 'PHI', suns: 'PHX',
  trailblazers: 'POR', kings: 'SAC', spurs: 'SAS', raptors: 'TOR', jazz: 'UTA', wizards: 'WAS',
  freeagent: 'FA'
};

export const TEAM_NAME = {
  hawks: 'Atlanta Hawks', celtics: 'Boston Celtics', nets: 'Brooklyn Nets', hornets: 'Charlotte Hornets',
  bulls: 'Chicago Bulls', cavaliers: 'Cleveland Cavaliers', mavericks: 'Dallas Mavericks', nuggets: 'Denver Nuggets',
  pistons: 'Detroit Pistons', warriors: 'Golden State Warriors', rockets: 'Houston Rockets', pacers: 'Indiana Pacers',
  clippers: 'LA Clippers', lakers: 'Los Angeles Lakers', grizzlies: 'Memphis Grizzlies', heat: 'Miami Heat',
  bucks: 'Milwaukee Bucks', timberwolves: 'Minnesota Timberwolves', pelicans: 'New Orleans Pelicans',
  knicks: 'New York Knicks', thunder: 'Oklahoma City Thunder', magic: 'Orlando Magic', sixers: 'Philadelphia 76ers',
  suns: 'Phoenix Suns', trailblazers: 'Portland Trail Blazers', kings: 'Sacramento Kings', spurs: 'San Antonio Spurs',
  raptors: 'Toronto Raptors', jazz: 'Utah Jazz', wizards: 'Washington Wizards', freeagent: 'Free Agent'
};

export const FRANCHISE_SLUGS = Object.keys(TEAM_ABBR).filter(k => k !== 'freeagent');

export function randomFranchise(exclude) {
  const pool = FRANCHISE_SLUGS.filter(s => !exclude?.includes(s));
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Primary team colors (match your CSS --team-color values) */
export const TEAM_COLOR = {
  sixers: '#ED174C',
  cavaliers: '#7c0c3b',
  hawks: '#ab112a',
  celtics: '#0a7035',
  nets: '#393d3fff',
  hornets: '#00788c',
  bulls: '#CE1141',
  mavericks: '#1482cb',
  nuggets: '#FEC524',
  pistons: '#8e0d23',
  warriors: '#FFC72C',
  rockets: '#CE1141',
  pacers: '#FDBB30',
  clippers: '#1D428A',
  lakers: '#552583',
  grizzlies: '#5D76A9',
  heat: '#98002E',
  bucks: '#00471B',
  timberwolves: '#79C019',
  pelicans: '#b48c42',
  knicks: '#F58426',
  thunder: '#3722bb',
  magic: '#0077c0',
  suns: '#E56020',
  trailblazers: '#E03A3E',
  kings: '#5A2D81',
  spurs: '#C4CED4',
  raptors: '#C5050C',
  jazz: '#7A3A9A',
  wizards: '#E31837',
  freeagent: 'gray'
};
