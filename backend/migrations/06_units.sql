-- Create units table and seed it with values
USE coldplace;

CREATE TABLE IF NOT EXISTS units (
    id          INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    code        VARCHAR(20) NOT NULL,
    name        VARCHAR(50) NOT NULL,
    is_base     BOOLEAN NOT NULL DEFAULT false,
    status      ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    UNIQUE KEY uq_unit_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seeding kg & cartons
INSERT INTO units (code, name, is_base) VALUES
    ('kg', 'Kilogram', 1),
    ('carton', 'Carton', 0);