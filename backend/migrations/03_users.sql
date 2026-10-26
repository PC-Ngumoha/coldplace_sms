-- Create users table & refresh_tokens log tables.
USE coldplace;


CREATE TABLE IF NOT EXISTS users (
    id                      INT PRIMARY KEY AUTO_INCREMENT,
    name                    VARCHAR(255) NOT NULL,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    password_hash           VARCHAR(100),
    role                    VARCHAR(60) NOT NULL,
    location_id             INT,
    is_primary_handler      BOOLEAN NOT NULL DEFAULT false,
    must_change_password    BOOLEAN NOT NULL DEFAULT true,
    status                  VARCHAR(60) NOT NULL DEFAULT 'active',

    CONSTRAINT chk_role CHECK (role IN ('executive', 'admin', 'manager', 'central', 'outlet', 'viewer')),
    CONSTRAINT chk_usr_status CHECK (status IN ('active', 'inactive')),
    CONSTRAINT fk_user_location FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id                      INT PRIMARY KEY AUTO_INCREMENT,
    user_id                 INT NOT NULL,
    token_hash              CHAR(64) NOT NULL,
    expires_at              INT NOT NULL,
    revoked_at              INT,
    replaced_by             INT,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_token_hash (token_hash),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;