const express = require('express');

const cors = require('cors');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

const fileUpload = require('express-fileupload');

const websiteLeadRoutes = require('./routes/websiteLead');
const facebookLeadRoutes= require('./routes/facebookLeads');
const formResponseRoutes = require('./routes/appRoutes/formResponse');
const clientBulkRoutes = require('./routes/clientBulk');

// create our Express app
const app = express();

const allowedOrigins = [
  'http://3.109.229.73:3000',
  'http://web.jestycrm.com',
  'https://web.jestycrm.com',
  'http://localhost:3000',
  true,
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

// 🧩 CORS Middleware
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use((err, req, res, next) => {
  console.log('Route:', req.method, req.originalUrl);
  console.error('Unhandled error:', err);
    if (!res.headersSent) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// // default options
app.use(fileUpload());

// Here our API Routes

app.use('/api/client', clientBulkRoutes);
app.use('/api', websiteLeadRoutes);
app.use('/api', facebookLeadRoutes);
app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);
app.use('/api/form-response', formResponseRoutes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
