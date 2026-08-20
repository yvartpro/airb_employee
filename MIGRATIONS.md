# Database Migrations Guide

This project uses Sequelize CLI for managing database migrations, ensuring version-controlled schema management.

## Migration Commands

### Running Migrations

```bash
# Run all pending migrations
npm run migrate
```

This command:
- Connects to your MySQL database
- Runs all migrations not yet executed (tracked in `SequelizeMeta` table)
- Creates/updates tables in proper order based on foreign key dependencies
- Updates migration history

### Undoing Migrations

```bash
# Undo the last migration batch
npm run migrate:undo

# Undo all migrations (use with caution in production!)
npm run migrate:undo:all
```

## Seeding Database

### Running Seeders

```bash
# Seed initial data (admin users, sample partners)
npm run seed
```

Included seeders:
- `20260820000001-seed-users.js` - Creates admin and gestionnaire users
- `20260820000002-seed-partners.js` - Creates example partners

### Undoing Seeders

```bash
# Remove all seeded data
npm run seed:undo
```

## Production Deployment Workflow

1. **Database Setup** (first time only)
   ```bash
   # Ensure database exists
   mysql -u root -p -e "CREATE DATABASE airb_employee_db CHARACTER SET utf8mb4;"
   ```

2. **Run Migrations**
   ```bash
   npm run migrate
   ```

3. **Optional: Seed Test Data** (development only)
   ```bash
   npm run seed
   ```

4. **Start Application**
   ```bash
   npm start
   ```

## Migrations Structure

All migrations are in `/migrations/` directory and follow naming convention:
```
{timestamp}-{description}.js
```

Example:
- `20260820000001-create-users.js` - Creates users table
- `20260820000002-create-partners.js` - Creates partners table
- etc.

## How Migrations Work

### Up Method
Executes when running `npm run migrate` - creates/modifies database schema.

### Down Method
Executes when running `npm run migrate:undo` - rolls back changes.

### Example Migration Structure

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table or modify schema
    await queryInterface.createTable('my_table', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      // ... column definitions
    });
  },

  async down(queryInterface, Sequelize) {
    // Undo changes
    await queryInterface.dropTable('my_table');
  }
};
```

## Migration Dependencies

The migrations run in sequential order:

1. **Users** - No dependencies
2. **Partners** - No dependencies
3. **Employees** - References users (createdBy)
4. **Assignments** - References employees & partners
5. **Salary Settings** - References assignments
6. **Commission Transactions** - References employees, partners, salary_settings
7. **Activity Logs** - References users

This order ensures foreign key constraints are satisfied.

## Configuration

Sequelize CLI uses `.sequelizerc` to find configuration:

```javascript
{
  'config': 'config/database-config.js',
  'models-path': 'models',
  'seeders-path': 'seeders',
  'migrations-path': 'migrations'
}
```

Database credentials from `.env`:
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASS` - Database password
- `DB_NAME` - Database name

## Checking Migration Status

Migrations are tracked in the `SequelizeMeta` table:

```sql
SELECT * FROM SequelizeMeta;
```

This shows all applied migrations and their execution order.

## Creating New Migrations

To generate a new migration (e.g., adding a column):

```bash
npx sequelize-cli migration:generate --name add-column-to-users
```

This creates a template in `/migrations/` that you can edit.

## Best Practices

1. **Always test migrations** - Run migrate/undo locally first
2. **Keep migrations small** - One logical change per migration
3. **Use descriptive names** - `add-photo-url-to-employees` is clearer than `update-schema`
4. **Test rollbacks** - Ensure undo methods work correctly
5. **Production deployments** - Always backup database before running migrations
6. **Version control** - Commit all migration files with code changes
7. **Never modify old migrations** - Create new ones if changes needed

## Troubleshooting

### Migration fails with foreign key error

**Problem**: "Cannot add or update a child row"

**Solution**: Check migration order - parent tables must be created before child tables. The current order is correct.

### "SequelizeMeta table not found"

**Problem**: First time migration fails on second command

**Solution**: This is normal - Sequelize creates the table automatically on first run.

### Need to rollback one specific migration

**Problem**: Can't rollback just one middle migration

**Solution**: Sequelize only supports sequential undo. To rollback a specific migration:
1. Run `npm run migrate:undo` multiple times to reach it
2. Edit the migration file
3. Run `npm run migrate` to reapply

### Database connection errors

**Problem**: "Access denied" or "Unknown database"

**Solution**: 
- Verify credentials in `.env`
- Ensure database exists: `CREATE DATABASE airb_employee_db;`
- Check MySQL is running: `mysql -u root -p -e "SELECT 1;"`

## Development vs Production

### Development Environment (.env)
- `NODE_ENV=development`
- Direct localhost MySQL connection
- Can use migrate:undo:all freely

### Production Environment
1. Set `NODE_ENV=production`
2. Use environment-specific credentials
3. **Always backup before migrations**
4. Run migrations in deployment pipeline
5. Keep database-config.js separate from models/database.js

## Migrations vs sync()

| Aspect | Migrations | db.sync() |
|--------|-----------|----------|
| Version Control | ✅ Full history | ❌ No history |
| Rollback | ✅ Undo migrations | ❌ Not possible |
| Production Safe | ✅ Controlled changes | ❌ Risky alterations |
| SQL Visibility | ✅ See exact SQL | ❌ Hidden auto-generation |
| Team Collaboration | ✅ Tracked in Git | ❌ Hard to coordinate |

This project uses migrations for production safety and proper schema management.
