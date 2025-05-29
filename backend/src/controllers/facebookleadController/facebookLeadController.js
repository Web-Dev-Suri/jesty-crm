const axios = require('axios');
const Client = require('@/models/appModels/Client');

exports.facebookAuth = (req, res) => {
  const fbAppId = process.env.FB_APP_ID;
  const redirectUri = encodeURIComponent(`${process.env.API_URL}/facebook/callback`);
  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=pages_show_list,leads_retrieval,pages_read_engagement`;
  res.redirect(url);
};

exports.facebookCallback = async (req, res) => {
  const { code } = req.query;
  const fbAppId = process.env.FB_APP_ID;
  const fbAppSecret = process.env.FB_APP_SECRET;
  const redirectUri = `${process.env.API_URL}/facebook/callback`;
  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${fbAppSecret}&code=${code}`;
  const tokenRes = await axios.get(tokenUrl);
  // Save tokenRes.data.access_token for the user/admin in DB for future use
  // Redirect to frontend with success message
  res.redirect(`${process.env.FRONTEND_URL}/settings?fb_connected=1`);
};

exports.facebookWebhook = async (req, res) => {
  // Facebook webhook for lead notifications
  if (req.method === 'GET') {
    // Verification challenge
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
      return res.send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verification failed');
  }

  // Handle lead data
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  if (changes?.field === 'leadgen') {
    const leadId = changes.value.leadgen_id;
    // Fetch lead details from Facebook
    const pageAccessToken = '...'; // Retrieve from DB
    const leadRes = await axios.get(
      `https://graph.facebook.com/v19.0/${leadId}?access_token=${pageAccessToken}`
    );
    // Map Facebook lead fields to your Client schema
    await Client.create({
      name: leadRes.data.field_data.find(f => f.name === 'full_name')?.values?.[0] || 'FB Lead',
      email: leadRes.data.field_data.find(f => f.name === 'email')?.values?.[0],
      phone: leadRes.data.field_data.find(f => f.name === 'phone_number')?.values?.[0],
      source: 'Facebook',
      status: 'New Lead',
    });
  }
  res.sendStatus(200);
};