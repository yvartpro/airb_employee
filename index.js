const dotenv = require('dotenv')
dotenv.config()
const app = require('./app');
const { initDatabase } = require('./database');
const { PORT } = require('./config');

(async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`AIRB Backend running on http://localhost:${PORT}`);
  });
})();
