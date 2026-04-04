-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  event_type  TEXT NOT NULL,
  description TEXT NOT NULL,
  party       TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS activity_log_user_created ON activity_log (user_id, created_at DESC);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  subtitle   TEXT,
  unread     BOOLEAN NOT NULL DEFAULT true,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_unread  ON notifications (user_id, unread);

-- Credential offers (inbox)
CREATE TABLE IF NOT EXISTS credential_offers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id),
  title          TEXT NOT NULL,
  issuer_name    TEXT NOT NULL,
  issuer_did     TEXT,
  offered_claims TEXT[] NOT NULL,
  expires_at     TIMESTAMPTZ,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'accepted', 'declined')),
  credential_id  TEXT,
  received_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credential_offers_user_received ON credential_offers (user_id, received_at DESC);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id          UUID PRIMARY KEY REFERENCES users(id),
  language         TEXT NOT NULL DEFAULT 'en',
  theme            TEXT NOT NULL DEFAULT 'dark',
  notif_expiry     BOOLEAN NOT NULL DEFAULT true,
  notif_requests   BOOLEAN NOT NULL DEFAULT true,
  notif_suspicious BOOLEAN NOT NULL DEFAULT true,
  notif_issuance   BOOLEAN NOT NULL DEFAULT true,
  notif_digest     BOOLEAN NOT NULL DEFAULT false,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add bio to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
