-- scripts/sql/check-user.sql
-- Run in Supabase SQL Editor (dev/staging) to confirm the user exists.
select id, email, created_at, last_sign_in_at, is_sso_user
from auth.users
where email = 'claudiolopesjr@hotmail.com';
