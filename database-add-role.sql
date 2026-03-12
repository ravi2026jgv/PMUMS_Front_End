-- ============================================
-- Role-Based Authentication Database Migration
-- ============================================
-- This script adds role functionality to the existing users table

-- Step 1: Add role column to users table
-- Default role is 'USER' for all existing users
ALTER TABLE users 
ADD COLUMN role VARCHAR(20) DEFAULT 'USER' NOT NULL;

-- Step 2: Create index on role column for faster queries
CREATE INDEX idx_users_role ON users(role);

-- Step 3: Set admin role for specific users
-- IMPORTANT: Replace 'admin' with your actual admin username/employee ID
UPDATE users 
SET role = 'ADMIN' 
WHERE username = 'admin';

-- Alternative: Update by employee ID if that's what you use
-- UPDATE users SET role = 'ADMIN' WHERE username = 'EMP001';

-- Step 4: You can also set admin by email
-- UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Step 5: Verify the changes
SELECT id, username, name, email, role 
FROM users 
WHERE role = 'ADMIN';

-- Step 6: Check all users and their roles
SELECT id, username, name, role, created_date 
FROM users 
ORDER BY created_date DESC 
LIMIT 10;

-- ============================================
-- Optional: Create a roles enum constraint
-- ============================================
-- If you want to enforce only specific role values

-- For MySQL 8.0+:
-- ALTER TABLE users 
-- ADD CONSTRAINT chk_role 
-- CHECK (role IN ('USER', 'ADMIN'));

-- For PostgreSQL:
-- CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
-- ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;

-- ============================================
-- Rollback Script (if needed)
-- ============================================
-- Uncomment these lines if you need to remove the role column

-- DROP INDEX idx_users_role;
-- ALTER TABLE users DROP COLUMN role;
