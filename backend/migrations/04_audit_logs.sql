-- Sets up the audit_log table that stores a record of all actions taken on the app.
USE coldplace;


CREATE TABLE IF NOT EXISTS audit_logs(
    id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id             INT UNSIGNED NULL,
    action              VARCHAR(100) NOT NULL,
    entity              VARCHAR(60) NOT NULL,
    entity_id           INT UNSIGNED NULL,
    old_value           TEXT NULL,
    new_value           TEXT NULL,  -- Chose TEXT for compatibility across MySQL 5 & 8
    reason              VARCHAR(255) NULL,
    ip_address          VARCHAR(60) NULL,
    user_agent          VARCHAR(255) NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_created (created_at),
    INDEX idx_audit_user (user_id, created_at),
    INDEX idx_audit_entity (entity, entity_id),
    INDEX idx_audit_action  (action, created_at),

    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;