# AIRB Employee Management API - Deployment Guide

## Production Checklist

### 1. Initial Setup (One-time)

```bash
# Clone repository
git clone <repo-url> airb_employee
cd airb_employee

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with production credentials
```

### 2. Database Preparation

```bash
# Create database (MySQL admin access required)
mysql -u root -p -e "CREATE DATABASE airb_employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Or use Sequel Pro / MySQL Workbench GUI
```

### 3. Run Migrations (Must do BEFORE starting app)

```bash
# Run all pending migrations to create schema
npm run migrate

# Verify tables created
mysql -u <DB_USER> -p<DB_PASS> -e "USE airb_employee_db; SHOW TABLES;"
```

Expected output:
```
activity_logs
assignments
commission_transactions
employees
partners
salary_settings
users
```

### 4. Seed Initial Data (Optional, Development)

```bash
# Add admin/gestionnaire users and test partners
npm run seed
```

### 5. Start Application

```bash
# Development with hot-reload
npm run dev

# Production mode
npm start
```

Server starts on `http://localhost:5000` (or configured PORT)

## Database Connection Verification

```bash
# Test connection from app directory
mysql -u yvart -p"burundi123?" airb_employee_db -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='airb_employee_db';"
```

Expected: 7 tables (all migrations applied)

## Architecture Changes from db.sync()

### Before (SQLite + db.sync())
- ❌ No version control of schema
- ❌ Automatic alterations risky in production
- ❌ No rollback capability
- ❌ Schema changes hard to track

### Now (MySQL + Migrations)
- ✅ Every schema change is versioned
- ✅ Reproducible deployments
- ✅ Full rollback capability
- ✅ Complete audit trail
- ✅ Safe for production

## Application Initialization Flow

### Original index.js
```javascript
await sequelize.sync({ alter: true }); // ❌ Risky!
```

### New index.js
```javascript
await sequelize.authenticate(); // ✅ Just checks connection
// Schema creation handled by migrations
```

## Production Deployment Workflow

### First Deployment

```bash
# 1. Check out code
git clone <repo> && cd <repo>

# 2. Install dependencies
npm install --production

# 3. Configure environment
vi .env  # Set DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET

# 4. Create database
mysql -u admin -p -e "CREATE DATABASE airb_employee_db;"

# 5. Run migrations (THIS IS CRITICAL)
npm run migrate

# 6. Start application
npm start
```

### Subsequent Deployments

```bash
# 1. Pull latest code
git pull origin main

# 2. Install new dependencies (if any)
npm install --production

# 3. Apply new migrations (if any)
npm run migrate

# 4. Restart application
pm2 restart airb-api  # Or your process manager
```

## Using PM2 for Production

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start index.js --name "airb-api"

# Monitor
pm2 monit

# View logs
pm2 logs airb-api

# Restart after migrations
pm2 restart airb-api
```

PM2 ecosystem file (optional):
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'airb-api',
    script: './index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log'
  }]
};
```

## Migration Safety Practices

### Before Any Migration

```bash
# 1. Backup database
mysqldump -u user -p dbname > backup-$(date +%s).sql

# 2. Test on staging
npm run migrate  # On staging server first

# 3. Verify no errors
echo "Check logs for any errors"

# 4. Only then run on production
# After backup and testing pass
```

### If Migration Fails

```bash
# 1. Check what migrations have run
mysql -u user -p dbname -e "SELECT * FROM SequelizeMeta;"

# 2. Rollback last migration
npm run migrate:undo

# 3. Fix migration file
vi migrations/[filename].js

# 4. Re-run
npm run migrate
```

### Emergency: Rollback All

```bash
# ONLY in emergency - rolls back all changes
npm run migrate:undo:all

# Then restore from backup
mysql -u user -p dbname < backup-*.sql
```

## Environment Variables

### Development
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=airb_employee_db
JWT_SECRET=development-secret-key
GOOGLE_CLIENT_ID=dev-client-id
```

### Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=prod-mysql.example.com
DB_USER=prod_user
DB_PASS=strong-random-password
DB_NAME=airb_employee_prod
JWT_SECRET=production-secret-key-min-32-chars
GOOGLE_CLIENT_ID=prod-client-id
```

**⚠️ Never commit .env to git!**

## Docker Deployment (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Run migrations on startup
RUN npm run migrate

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: airb_employee_db
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

  api:
    build: .
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASS: root
      DB_NAME: airb_employee_db
    depends_on:
      - mysql
    ports:
      - "5000:5000"

volumes:
  db_data:
```

Deploy with:
```bash
docker-compose up -d
```

## Monitoring & Logs

### Check Migration Status

```bash
# List applied migrations
mysql -u user -p dbname -e "SELECT * FROM SequelizeMeta ORDER BY name;"
```

### Application Logs

```bash
# With PM2
pm2 logs airb-api

# Direct with file output
tail -f logs/app.log
```

### Database Health

```bash
# Connection test
mysql -u user -ppass dbname -e "SELECT NOW();"

# Table count
mysql -u user -ppass dbname -e "SHOW TABLES;"

# Size
mysql -u user -ppass dbname -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) FROM information_schema.tables WHERE table_schema='airb_employee_db';"
```

## Troubleshooting

### "Database connection failed"
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in .env
- Test connection: `mysql -u user -p dbname -e "SELECT 1;"`

### "SequelizeMeta table not found"
- This is normal first time - Sequelize creates it
- Just run `npm run migrate` again

### "Cannot add or update a child row"
- Foreign key constraint error
- Check parent tables exist first
- Migrations run in correct order

### "ERR! sh: sequelize-cli: not found"
```bash
# Reinstall dev dependencies
npm install
```

### Migration rolled back unexpectedly
```bash
# Verify what state we're in
mysql -e "SELECT * FROM SequelizeMeta;"

# Re-apply if needed
npm run migrate
```

## Scaling Considerations

### Database Connection Pooling
Already configured in `config/database.js`:
```javascript
pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

Adjust based on:
- Number of app instances
- Load patterns
- Available database connections

### Multiple Application Instances

```bash
# With PM2 cluster mode
pm2 start index.js -i max --name "airb-api"

# Each instance shares same database
# Migrations only run once (handled by SequelizeMeta lock)
```

### Database Backup Strategy

```bash
# Daily automatic backup
0 2 * * * mysqldump -u user -p pass dbname > /backups/airb-$(date +\%Y\%m\%d).sql

# Keep 30 days of backups
find /backups -name "airb-*.sql" -mtime +30 -delete
```

## Support & Maintenance

### Regular Tasks

- ✅ Monitor application logs
- ✅ Track migration history
- ✅ Database backups (daily)
- ✅ Update dependencies (npm audit)
- ✅ Monitor disk/memory usage

### Critical Files

- `.env` - Configuration (DO NOT COMMIT)
- `migrations/` - Schema version control (COMMIT)
- `seeders/` - Initial data (COMMIT)
- `package-lock.json` - Exact dependencies (COMMIT)

### Version Control Best Practices

```bash
# .gitignore should include:
.env
.env.local
node_modules/
logs/
uploads/
*.log
```

## Summary

| Step | Command | Purpose |
|------|---------|---------|
| Install | `npm install` | Get dependencies |
| Configure | Edit `.env` | Set database credentials |
| Create DB | `mysql -e "CREATE DATABASE..."` | Database setup |
| Migrate | `npm run migrate` | Apply schema |
| Seed | `npm run seed` | Load initial data |
| Start | `npm start` | Run application |
| Monitor | `pm2 logs` | Watch logs |
| Backup | `mysqldump...` | Database safety |

**Key Difference**: No automatic `db.sync()` - migrations give you control!
