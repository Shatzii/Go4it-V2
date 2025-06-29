
-- License Server Database Schema

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'starter',
  subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  license_key VARCHAR(255) UNIQUE NOT NULL,
  server_fingerprint VARCHAR(255),
  installation_id VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE license_validations (
  id SERIAL PRIMARY KEY,
  license_id INTEGER REFERENCES licenses(id),
  server_fingerprint VARCHAR(255),
  validated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscription_events (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  event_type VARCHAR(50) NOT NULL, -- 'created', 'renewed', 'cancelled', 'expired'
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_licenses_license_key ON licenses(license_key);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_license_validations_license_id ON license_validations(license_id);
CREATE INDEX idx_license_validations_validated_at ON license_validations(validated_at);
