-- Create locations table & add 3 default locations
USE coldplace;

-- Create table to be compatible on MYSQL 5.7, 8.0 & MariaDB
CREATE TABLE IF NOT EXISTS locations (
    id                      INT PRIMARY KEY AUTO_INCREMENT,
    name                    VARCHAR(255) UNIQUE NOT NULL,
    is_central              BOOLEAN NOT NULL DEFAULT false,
    address                 VARCHAR(1000),
    status                  VARCHAR(255) NOT NULL DEFAULT 'active',

    CONSTRAINT chk_loc_status CHECK (status IN ('active', 'inactive'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Insert 3 locations by default: Central Area, Gwarimpa & Mpape
INSERT IGNORE INTO locations (name, is_central)
VALUES ('Central Area', true), ('Gwarimpa', false), ('Mpape', false);