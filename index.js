const dotenv = require('dotenv')
dotenv.config()

const app = require('./app');
const { sequelize } = require('./models');
const { PORT } = require('./config');

(async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    app.listen(PORT, () => {
      console.log(`AIRB Employee Management Backend running on http://localhost:${PORT}`);
      console.log('Note: Run "npm run migrate" to apply pending migrations');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
