const jwt = require('jsonwebtoken');
const axios = require('axios');
const Client = require('@/models/appModels/Client');
const Admin = require('@/models/coreModels/Admin');
require('dotenv').config();

exports.facebookAuth = (req, res) => {
  const fbAppId = process.env.FB_APP_ID;
  const { token } = req.query;

  if (!token) return res.status(400).send('Missing JWT token.');

  const redirectUri = encodeURIComponent(`${process.env.API_URL}/api/facebook/callback`);
  const state = encodeURIComponent(token);

  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=pages_show_list,leads_retrieval,pages_read_engagement,pages_manage_metadata&state=${state}`;

  res.redirect(url);
};

exports.facebookCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!state) return res.status(401).send('No JWT token provided.');

    const token = decodeURIComponent(state);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = verified.id;

    const fbAppId = process.env.FB_APP_ID;
    const fbAppSecret = process.env.FB_APP_SECRET;
    const redirectUri = `${process.env.API_URL}/api/facebook/callback`;

    // Step 1: Get Facebook user access token
    const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
      params: {
        client_id: fbAppId,
        redirect_uri: redirectUri,
        client_secret: fbAppSecret,
        code: code
      }
    });
    const fbAccessToken = tokenRes.data.access_token;
    console.log('Facebook access token:', fbAccessToken);

    // Step 2: Exchange for long-lived user token
    const longLivedTokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: fbAppId,
        client_secret: fbAppSecret,
        fb_exchange_token: fbAccessToken
      }
    });
    const longLivedUserToken = longLivedTokenRes.data.access_token;
    console.log('Long-lived user token:', longLivedUserToken);

    // Step 3: Get Facebook pages connected to this user
    const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedUserToken}`);

    if (!pagesRes.data.data.length) throw new Error('No Facebook pages found.');

    const page = pagesRes.data.data[0]; // Select first page
    const pageId = page.id;
    const pageAccessToken = page.access_token;

    // Step 4: Auto-subscribe the page to your app
    await axios.post(`https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`, null, {
      params: {
        access_token: pageAccessToken,
        subscribed_fields: 'leadgen'
      }
    });

    // Step 5: Save Facebook info to Admin
    const pages = pagesRes.data.data.map(page => ({
      id: page.id,
      accessToken: page.access_token,
      name: page.name,
    }));

    await Admin.findByIdAndUpdate(adminId, {
      $set: {
        'facebookIntegration.connected': true,
        'facebookIntegration.fbUserId': pages[0].id,
        'facebookIntegration.fbPages': pages,
        'facebookIntegration.pageAccessToken': pages[0].accessToken // <-- Needed for frontend
      }
    });

    console.log('Page subscribed successfully and saved to DB.');

    res.send(`
      <script>
        window.opener && window.opener.postMessage('facebook-connected', '*');
        window.close();
      </script>
    `);
  } catch (err) {
    console.error('Facebook callback error:', err.response?.data || err.message);
    res.status(500).send('Facebook callback error');
  }
};

exports.facebookWebhook = async (req, res) => {
  if (req.method === 'GET') {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
      return res.send(req.query['hub.challenge']);
    }
    return res.sendStatus(403);
  }

  // ✅ Log the entire incoming payload for confirmation
  console.log('📥 Incoming Facebook Webhook:', JSON.stringify(req.body, null, 2));

  // ✅ Respond immediately to Facebook
  res.sendStatus(200);

  // ✅ Process each lead asynchronously
  try {
    for (const entry of req.body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'leadgen') {
          processLead(change.value); // Safe: Do not await
        }
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err.message);
  }
};

async function processLead(leadValue) {
  try {
    const leadId = leadValue.leadgen_id;
    const pageId = leadValue.page_id;

    const admin = await Admin.findOne({
      'facebookIntegration.connected': true,
      'facebookIntegration.fbPages': { $elemMatch: { id: pageId } }
    });
    console.log('Admin found for pageId:', pageId, admin ? admin._id : 'None');
    if (!admin) {
      console.error('Admin with connected Facebook page not found.');
      return;
    }

    console.log('Admin organizationId:', admin.organizationId);

    const pageObj = admin.facebookIntegration.fbPages.find(p => p.id === pageId);
    const pageAccessToken = pageObj.accessToken;

    const leadDetailsRes = await axios.get(`https://graph.facebook.com/v19.0/${leadId}`, {
      params: { access_token: pageAccessToken }
    });

    const leadData = leadDetailsRes.data.field_data;

    const name = leadData.find(f => f.name === 'full_name')?.values?.[0] || 'FB Lead';
    const email = leadData.find(f => f.name === 'email')?.values?.[0] || '';
    const phone = leadData.find(f => f.name === 'phone_number')?.values?.[0] || '';

    // Ensure organizationId is present
    if (!admin.organizationId) {
      console.error('Admin is missing organizationId. Cannot save lead.');
      return;
    }

    await Client.create({
      name,
      email,
      phone,
      source: 'Meta Campaign A',
      status: 'New Lead',
      createdBy: admin._id,
      organizationId: admin.organizationId,
      formResponses: leadData
    });

    console.log(`Lead ${leadId} processed and saved.`);
  } catch (err) {
    console.error('Error processing lead:', err.response?.data || err.message);
  }
}

exports.facebookSettings = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin.facebookIntegration?.connected) {
      return res.json({ connected: false });
    }

    const userToken = admin.facebookIntegration.pageAccessToken;
    console.log('facebookSettings admin:', admin._id, admin.facebookIntegration);

    // Get Facebook user info
    const userRes = await axios.get(`https://graph.facebook.com/v19.0/me`, {
      params: { access_token: userToken, fields: 'id,name,picture' }
    });

    // Get all pages
    const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
      params: { access_token: userToken, fields: 'id,name,picture,access_token' }
    });

    // For each page, get lead forms
    const pages = await Promise.all(
      (pagesRes.data.data || []).map(async page => {
        // Get lead forms for this page
        let forms = [];
        try {
          const formsRes = await axios.get(`https://graph.facebook.com/v19.0/${page.id}/leadgen_forms`, {
            params: { access_token: page.access_token, fields: 'id,name' }
          });
          forms = formsRes.data.data || [];
        } catch (err) {
          forms = [];
        }
        return {
          id: page.id,
          name: page.name,
          picture: page.picture?.data?.url || '',
          forms
        };
      })
    );

    res.json({
      connected: true,
      fbUserId: userRes.data.id,
      fbUserName: userRes.data.name,
      fbUserPic: userRes.data.picture?.data?.url || '',
      pages
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized or Facebook API error', details: err.message });
  }
};

exports.facebookDisconnect = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await Admin.findByIdAndUpdate(decoded.id, { $unset: { facebookIntegration: "" } });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};