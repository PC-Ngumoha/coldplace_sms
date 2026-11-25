-- Create the customers table
USE coldplace;

CREATE TABLE IF NOT EXISTS customers (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(150) NOT NULL,
  customer_type         ENUM('individual','business') NOT NULL DEFAULT 'individual',
  phone                 VARCHAR(20) NULL,
  address               VARCHAR(255) NULL,
  status                ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_by            INT UNSIGNED NOT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_phone (phone),
  INDEX idx_customer_name (name),
  CONSTRAINT fk_customer_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;