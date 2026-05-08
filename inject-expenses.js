// Paste this entire script into the browser console while on the trip app page.
// It will find the Tokyo trip, find the "Nir & Shay" person, and add all expenses.

(function() {
  // ── helpers ──────────────────────────────────────────────────────────────
  function dd(str) {
    // Convert DD/MM/YYYY or D/M/YYYY to YYYY-MM-DD; return '' if empty
    if (!str || !str.trim()) return '';
    const parts = str.trim().split('/');
    if (parts.length !== 3) return '';
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  function catMap(c) {
    const m = {
      'meals': 'food',
      'transportation': 'transport',
      'accommodation': 'hotel',
      'activity': 'activity',
      'miscellaneous/incidental': 'other',
      'shopping': 'other',
    };
    return m[(c||'').toLowerCase()] || 'other';
  }

  // ── raw expense data ──────────────────────────────────────────────────────
  // [date DD/MM/YYYY, amount (number), currency, appCategory, desc]
  const RAW = [
    ['27/04/2026', 94.00,    'GBP', 'miscellaneous/incidental', 'Osaka tickets'],
    ['11/01/2026', 1352.99,  'GBP', 'transportation',           'Flights – ref 40-780017146 PIN 9507'],
    ['02/05/2026', 185460,   'JPY', 'transportation',           'Car rental – res 26010500283 (return 10/05 Nikko)'],
    ['11/01/2026', 3195.00,  'GBP', 'accommodation',            ''],
    ['25/04/2026', 10110,    'JPY', 'miscellaneous/incidental', ''],
    ['25/04/2026', 20220,    'JPY', 'miscellaneous/incidental', ''],
    ['26/04/2026', 12309,    'JPY', 'meals',                    ''],
    ['28/04/2026', 38,       'JPY', 'meals',                    ''],
    ['24/04/2026', 15.50,    'GBP', 'transportation',           ''],
    ['25/04/2026', 9.95,     'GBP', 'transportation',           ''],
    ['25/04/2026', 150,      'JPY', 'transportation',           ''],
    ['26/04/2026', 530,      'JPY', 'transportation',           ''],
    ['26/04/2026', 800,      'JPY', 'transportation',           ''],
    ['26/04/2026', 520,      'JPY', 'transportation',           ''],
    ['26/04/2026', 2000,     'JPY', 'transportation',           ''],
    ['28/04/2026', 500,      'JPY', 'transportation',           ''],
    ['29/04/2026', 100,      'JPY', 'transportation',           ''],
    ['29/04/2026', 7.14,     'GBP', 'miscellaneous/incidental', ''],
    ['29/04/2026', 56.62,    'GBP', 'accommodation',            ''],
    ['29/04/2026', 12.60,    'GBP', 'shopping',                 ''],
    ['29/04/2026', 38.02,    'GBP', 'meals',                    ''],
    ['29/04/2026', 22.28,    'GBP', 'meals',                    ''],
    ['30/04/2026', 9.98,     'GBP', 'meals',                    ''],
    ['27/04/2026', 3640,     'JPY', 'meals',                    ''],
    ['27/04/2026', 520,      'JPY', 'meals',                    ''],
    ['26/04/2026', 11600,    'JPY', 'meals',                    ''],
    ['26/04/2026', 606,      'JPY', 'miscellaneous/incidental', ''],
    ['26/04/2026', 500,      'JPY', 'miscellaneous/incidental', ''],
    ['30/04/2026', 9.98,     'GBP', 'meals',                    ''],
    ['29/04/2026', 121.37,   'GBP', 'shopping',                 ''],
    ['28/04/2026', 19.49,    'GBP', 'accommodation',            ''],
    ['01/05/2026', 2000,     'JPY', 'meals',                    ''],
    ['01/05/2026', 420,      'JPY', 'meals',                    ''],
    ['01/05/2026', 406,      'JPY', 'meals',                    ''],
    ['01/05/2026', 4720,     'JPY', 'meals',                    ''],
    ['01/05/2026', 20062,    'JPY', 'shopping',                 ''],
    ['01/05/2026', 1246,     'JPY', 'meals',                    ''],
    ['01/05/2026', 40000,    'JPY', 'shopping',                 ''],
    ['01/05/2026', 9.10,     'GBP', 'shopping',                 ''],
    ['01/05/2026', 33000,    'JPY', 'shopping',                 ''],
    ['02/05/2026', 30000,    'JPY', 'miscellaneous/incidental', ''],
    ['02/05/2026', 2000,     'JPY', 'transportation',           ''],
    ['02/05/2026', 8040,     'JPY', 'meals',                    ''],
    ['02/05/2026', 720,      'JPY', 'meals',                    ''],
    ['03/05/2026', 1400,     'JPY', 'meals',                    ''],
    ['03/05/2026', 4580,     'JPY', 'shopping',                 ''],
    ['03/05/2026', 6600,     'JPY', 'meals',                    ''],
    ['03/05/2026', 770,      'JPY', 'shopping',                 ''],
    ['03/05/2026', 1800,     'JPY', 'transportation',           ''],
    ['03/05/2026', 3210,     'JPY', 'transportation',           ''],
    ['03/05/2026', 1240,     'JPY', 'transportation',           ''],
    ['03/05/2026', 8510,     'JPY', 'meals',                    ''],
    ['03/05/2026', 660,      'JPY', 'shopping',                 ''],
    ['04/05/2026', 2300,     'JPY', 'meals',                    ''],
    ['04/05/2026', 550,      'JPY', 'meals',                    ''],
    ['04/05/2026', 4192,     'JPY', 'meals',                    ''],
    ['05/05/2026', 5600,     'JPY', 'transportation',           ''],
    ['05/05/2026', 7.10,     'GBP', 'meals',                    ''],
    ['05/05/2026', 600,      'JPY', 'transportation',           ''],
    ['05/05/2026', 3750,     'JPY', 'meals',                    ''],
    ['05/05/2026', 3533,     'JPY', 'meals',                    ''],
    ['06/05/2026', 6700,     'JPY', 'miscellaneous/incidental', ''],
    ['06/05/2026', 2860,     'JPY', 'transportation',           ''],
    ['06/05/2026', 10046,    'JPY', 'transportation',           ''],
    ['07/05/2026', 997,      'JPY', 'meals',                    ''],
    ['07/05/2026', 1930,     'JPY', 'transportation',           ''],
    ['07/05/2026', 1800,     'JPY', 'meals',                    ''],
    ['',           5600,     'JPY', 'meals',                    ''],
    ['',           2639,     'JPY', 'meals',                    ''],
  ];

  // ── find trip ─────────────────────────────────────────────────────────────
  const stored = JSON.parse(localStorage.getItem('trips') || '[]');
  const trip = stored.find(t =>
    (t.dest || t.name || t.title || '').toLowerCase().includes('tokyo') ||
    (t.dest || t.name || t.title || '').toLowerCase().includes('japan')
  );
  if (!trip) {
    alert('Could not find a Tokyo/Japan trip. Make sure you are on the app page with that trip saved.');
    return;
  }
  console.log('Found trip:', trip.dest || trip.name, '| id:', trip.id);

  // ── find person ───────────────────────────────────────────────────────────
  const people = trip.people || [];
  const payer = people.find(p =>
    p.name.toLowerCase().includes('nir') ||
    p.name.toLowerCase().includes('shay') ||
    p.name.toLowerCase().replace(/\s/g,'').includes('nir&shay') ||
    p.name.toLowerCase().replace(/\s/g,'').includes('nir+shay')
  ) || people[0];
  if (!payer) {
    alert('No people found in trip. Add "Nir & Shay" as a person first, then re-run this script.');
    return;
  }
  console.log('Payer found:', payer.name, '| id:', payer.id);

  const allPeopleIds = people.map(p => p.id);

  // ── build expenses ────────────────────────────────────────────────────────
  if (!trip.expenses) trip.expenses = [];
  let added = 0;
  let ts = Date.now();

  for (const [rawDate, amount, cur, rawCat, desc] of RAW) {
    if (!amount || amount === 0) continue; // skip zero-amount rows
    trip.expenses.push({
      id: String(ts++),
      desc: desc || '',
      amount: amount,
      currency: cur,
      paidBy: payer.id,
      date: dd(rawDate),
      category: catMap(rawCat),
      splitAmong: allPeopleIds,
    });
    added++;
  }

  console.log(`Added ${added} expenses to "${trip.dest || trip.name}".`);

  // ── persist ───────────────────────────────────────────────────────────────
  // Update the trips array in memory and localStorage
  const idx = stored.findIndex(t => t.id === trip.id);
  if (idx !== -1) stored[idx] = trip;
  localStorage.setItem('trips', JSON.stringify(stored));

  // Sync to Firebase if available
  if (typeof tripsRef !== 'undefined') {
    tripsRef.child(trip.id).set(trip)
      .then(() => console.log('Synced to Firebase ✓'))
      .catch(e => console.warn('Firebase sync failed:', e));
  }

  // Re-render if renderExpenses is available
  if (typeof renderExpenses === 'function') {
    // Reload trips array in app memory
    if (typeof trips !== 'undefined') {
      const appIdx = trips.findIndex(t => t.id === trip.id);
      if (appIdx !== -1) trips[appIdx] = trip;
      else trips.push(trip);
    }
    renderExpenses();
    if (typeof renderOverview === 'function') renderOverview();
    console.log('UI refreshed ✓');
  } else {
    alert(`${added} expenses added! Reload the page to see them.`);
  }
})();
