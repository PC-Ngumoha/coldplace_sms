-- Setup the categories table in the database
USE coldplace;

CREATE TABLE IF NOT EXISTS categories (
    id              INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    status          ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_by      INT UNSIGNED NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_category_name (name),
    CONSTRAINT fk_category_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;