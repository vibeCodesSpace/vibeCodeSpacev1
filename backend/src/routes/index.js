const authRouter = require('./auth');
const generateRouter = require('./generate');
const paymentsRouter = require('./payments');
const exampleRouter = require('./example');

function registerRoutes(app) {
  app.use('/api/auth', authRouter);
  app.use('/api', generateRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/example', exampleRouter); // Example route
}

module.exports = { registerRoutes };