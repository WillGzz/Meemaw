PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('ELDER','RELATIVE')),
 instagram_username TEXT, family_code TEXT UNIQUE, location TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS elder_relative_connections (
 id TEXT PRIMARY KEY, elder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 relative_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 relationship TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('PENDING','ACCEPTED','DECLINED')),
 created_at INTEGER NOT NULL, UNIQUE(elder_id, relative_id)
);
CREATE INDEX IF NOT EXISTS idx_connections_relative ON elder_relative_connections(relative_id, status);
CREATE TABLE IF NOT EXISTS activity_cache (
 relative_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 payload TEXT NOT NULL, fetched_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
 bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS one_grants (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 encrypted_tokens TEXT NOT NULL, expires_at INTEGER NOT NULL,
 refreshed_at INTEGER NOT NULL, lock_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS one_transactions (
 state TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 session_hash TEXT NOT NULL, proof_hash TEXT NOT NULL, encrypted_verifier TEXT NOT NULL, expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS answers (
 id TEXT PRIMARY KEY, elder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 relative_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 question TEXT NOT NULL, answer TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_answers_elder ON answers(elder_id, created_at);
CREATE TABLE IF NOT EXISTS answer_feedback (
 answer_id TEXT PRIMARY KEY REFERENCES answers(id) ON DELETE CASCADE,
 elder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('HELPFUL','SHORTER','MORE_DETAIL','NOT_ACCURATE')),
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_feedback_elder ON answer_feedback(elder_id, created_at);
