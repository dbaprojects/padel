// Load padelplayers.xlsx into Padel Supabase players table
// Run: SUPABASE_SERVICE_ROLE_KEY=... node db/load-players.js

const XLSX = require('../../Squash/node_modules/xlsx');
const { createClient } = require('../../Squash/node_modules/@supabase/supabase-js');

const SUPABASE_URL = 'https://zrwpjecfswmyqbtaujnb.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function normalizePhone(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('44') || digits.startsWith('852')) return digits;
  return '65' + digits;
}

// Players to set as admin (matched by normalised full name)
const ADMINS = new Set(['jamie salamon']);
// Players to set as super_admin
const SUPER_ADMINS = new Set(['david barkess']);

async function main() {
  // Clear dependent tables first, then players
  console.log('Clearing tables...');
  for (const table of ['signups', 'events', 'handicap_history', 'audit_log', 'players']) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) { console.error(`Delete ${table} error:`, error.message); process.exit(1); }
    console.log(` Cleared ${table}`);
  }

  const wb = XLSX.readFile('./padelplayers.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const players = rows.map(r => {
    const fullName = String(r.Player || '').trim();
    const parts = fullName.split(/\s+/);
    const first_name = parts[0] || fullName;
    const last_name = parts.slice(1).join(' ') || '';
    const phone = normalizePhone(r.Tel);
    const key = fullName.toLowerCase();
    return {
      first_name,
      last_name,
      phone,
      email: null,
      current_handicap: 0,
      active: true,
      pending: false,
      is_admin: ADMINS.has(key) || SUPER_ADMINS.has(key),
      is_super_admin: SUPER_ADMINS.has(key),
    };
  }).filter(p => p.first_name);

  // Add David Barkess if not already in the sheet
  const dbKey = 'david barkess';
  if (!players.find(p => `${p.first_name} ${p.last_name}`.toLowerCase() === dbKey)) {
    players.push({
      first_name: 'David',
      last_name: 'Barkess',
      phone: '6588768221',
      email: null,
      current_handicap: 0,
      active: true,
      pending: false,
      is_admin: true,
      is_super_admin: true,
    });
  }

  console.log(`\nInserting ${players.length} players...`);
  players.forEach(p => {
    const role = p.is_super_admin ? ' [super_admin]' : p.is_admin ? ' [admin]' : '';
    console.log(` ${p.first_name} ${p.last_name} → ${p.phone}${role}`);
  });

  const { error } = await supabase.from('players').insert(players);
  if (error) { console.error('Insert error:', error.message); process.exit(1); }

  console.log('\nDone.');
}

main();
