export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Submissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: req.body })
      }
    );
    
    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
