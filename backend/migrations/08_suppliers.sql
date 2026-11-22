-- Create Suppliers and seed the database with 'Kado Fish Market'
USE coldplace;

CREATE TABLE IF NOT EXISTS suppliers (
    id                  INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name                VARCHAR(200) NOT NULL,
    contact             VARCHAR(255) NULL,
    notes               VARCHAR(500) NULL,
    outlet_allowed      BOOLEAN NOT NULL DEFAULT false,
    status              ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_by          INT UNSIGNED NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_supplier_name (name),
    CONSTRAINT fk_supplier_creator FOREIGN KEY (created_by) REFERENCES users(id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed the database with 
INSERT INTO suppliers (name, outlet_allowed, created_by) VALUES ('Kado Fish Market', true, 1);