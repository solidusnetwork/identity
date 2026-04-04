-- Sharing & selective disclosure

CREATE TABLE IF NOT EXISTS share_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  requester_name TEXT NOT NULL,
  requester_domain TEXT,
  requested_claims TEXT[] NOT NULL,  -- e.g., ['name', 'dob', 'kyc_level']
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS active_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  request_id UUID REFERENCES share_requests(id),
  credential_id TEXT NOT NULL,       -- references VC in SDK
  shared_claims TEXT[] NOT NULL,     -- subset of credential claims actually shared
  recipient_name TEXT NOT NULL,
  recipient_domain TEXT,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_share_requests_user ON share_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_active_shares_user ON active_shares (user_id);
