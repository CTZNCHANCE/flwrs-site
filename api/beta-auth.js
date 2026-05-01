// Edit RESOURCES below to manage what unlocked users see.
// Set BETA_PASSCODE in Vercel env vars (Project → Settings → Environment Variables).

const RESOURCES = [
  {
    category: 'Decks',
    items: [
      { title: 'FLWRS — Segment Pitch', context: 'Master pitch deck. Recognition, in real time.', url: '#' },
      { title: 'SCU × O.N.E The Duo FLWRS — Powered by Jordan', context: 'Cultural activation brief.', url: '#' },
      { title: 'Larry & Jeff — Briefing Deck', context: 'Friend-conversation deck. No Mexico City ask.', url: '#' }
    ]
  },
  {
    category: 'Briefings',
    items: [
      { title: 'Mexico City — May 2026', context: 'Immediate activation brief.', url: '#' },
      { title: 'Generational Greatness — Jordan 2026', context: 'Slot context for FLWRS.', url: '#' }
    ]
  },
  {
    category: 'Press & One-Sheets',
    items: [
      { title: 'FLWRS One-Pager', context: 'Single-page partner overview.', url: '#' }
    ]
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.BETA_PASSCODE;
  if (!expected) {
    return res.status(500).json({ error: 'Beta access is not configured.' });
  }

  const submitted = (req.body && typeof req.body.passcode === 'string') ? req.body.passcode.trim() : '';
  if (!submitted) {
    return res.status(400).json({ error: 'Missing passcode.' });
  }

  if (submitted !== expected) {
    return res.status(401).json({ error: 'Invalid access code.' });
  }

  return res.status(200).json({ ok: true, resources: RESOURCES });
}
