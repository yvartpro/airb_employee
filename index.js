const dotenv = require('dotenv')
dotenv.config()

const app = require('./app');
const { sequelize } = require('./models');
const { PORT } = require('./config');

(async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`AIRB Employee Management Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
