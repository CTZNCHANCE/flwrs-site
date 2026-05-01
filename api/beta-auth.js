// Edit RESOURCES below to manage what unlocked users see.
// Set BETA_PASSCODE in Vercel env vars (Project → Settings → Environment Variables).

const RESOURCES = [
  {
    category: 'Decks',
    items: [
      {
        title: 'FLWRS — Segment Pitch',
        context: 'The master pitch. Recognition, in real time.',
        url: 'https://drive.google.com/file/d/1vyROAyGybSK1njXphvllU77O6JO4UiYy/view?usp=drivesdk'
      },
      {
        title: 'O.N.E The Duo — ONE 4 ALL Pitch Deck',
        context: 'Tekitha & Prana Supreme. Nashville. Mother & daughter. Country Americana.',
        url: 'https://drive.google.com/file/d/1af707aZoVGW016bRpj3dC7CVDvsF2Pzp/view?usp=drivesdk'
      }
    ]
  },
  {
    category: 'Briefings',
    items: [
      {
        title: 'O.N.E The Duo × Jordan — Internal Brief',
        context: 'Partnership thesis and activation framing.',
        url: 'https://drive.google.com/file/d/1rFlFtEzVZI5-svwzhnJD1PGcovhyp87n/view?usp=drivesdk'
      }
    ]
  },
  {
    category: 'Dashboards & References',
    items: [
      {
        title: 'Jordan — Programs Comparison Dashboard',
        context: 'Four programs, one comparison. PDF companion to the live dashboard.',
        url: 'https://drive.google.com/file/d/1BXJ9aXlgMTfwzZhF4NA5EmrYcfC-89ro/view?usp=drivesdk'
      }
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
