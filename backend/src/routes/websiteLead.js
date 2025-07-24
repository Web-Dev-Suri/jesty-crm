const express = require('express');
const router = express.Router();
const cors = require('cors');
const { receiveWebsiteLead } = require('@/controllers/websiteleadController/websiteLeadController');

const allowedOrigins = [
  'http://3.109.229.73:3000',
  'http://web.jestycrm.com',
  'https://web.jestycrm.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

router.options('/leads/website', cors(corsOptions)); // Handle preflight
router.post('/leads/website', cors(corsOptions), receiveWebsiteLead);

module.exports = router;
