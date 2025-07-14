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

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use((err, req, res, next) => {
  console.log('Route:', req.method, req.originalUrl);
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message });
  next();
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
