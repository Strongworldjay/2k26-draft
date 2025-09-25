// src/data/teams.js
export const TEAM_ABBR = {
  hawks: 'ATL', celtics: 'BOS', nets: 'BKN', hornets: 'CHA', bulls: 'CHI', cavaliers: 'CLE',
  mavericks: 'DAL', nuggets: 'DEN', pistons: 'DET', warriors: 'GSW', rockets: 'HOU', pacers: 'IND',
  clippers: 'LAC', lakers: 'LAL', grizzlies: 'MEM', heat: 'MIA', bucks: 'MIL', timberwolves: 'MIN',
  pelicans: 'NOP', knicks: 'NYK', thunder: 'OKC', magic: 'ORL', sixers: 'PHI', suns: 'PHX',
  trailblazers: 'POR', kings: 'SAC', spurs: 'SAS', raptors: 'TOR', jazz: 'UTA', wizards: 'WAS',
  freeagent: 'FA'
};

// Pretty names (for headings)
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
