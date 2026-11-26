-- Create the tables for sales, sale_lines & daily_closes
USE coldplace;

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference             VARCHAR(30) NULL,
  location_id           INT UNSIGNED NOT NULL,
  customer_id           INT UNSIGNED NOT NULL,
  sale_date             DATE NOT NULL,
  created_by            INT UNSIGNED NOT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sale_reference (reference),
  INDEX idx_sale_location_date (location_id, sale_date),
  INDEX idx_sale_customer_date (customer_id, sale_date),
  CONSTRAINT fk_sale_location FOREIGN KEY (location_id) REFERENCES locations(id),
  CONSTRAINT fk_sale_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_sale_creator  FOREIGN KEY (created_by)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sale lines
CREATE TABLE IF NOT EXISTS sale_lines (
  id                        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id                   INT UNSIGNED NOT NULL,
  product_id                INT UNSIGNED NOT NULL,
  unit_id                   INT UNSIGNED NOT NULL,
  quantity                  DECIMAL(12,3) NOT NULL,
  quantity_kg               DECIMAL(12,3) NOT NULL,
  applied_price             DECIMAL(12,2) NOT NULL,
  line_total                DECIMAL(14,2) NOT NULL,
  set_price                 DECIMAL(12,2) NULL,
  set_price_total           DECIMAL(14,2) NULL,
  variance_amount           DECIMAL(14,2) NULL,
  variance_percent          DECIMAL(10,2) NULL,
  variance_label            VARCHAR(20) NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sale_line (sale_id, product_id, unit_id),
  INDEX idx_sl_product (product_id),
  INDEX idx_sl_unit (unit_id),
  CONSTRAINT fk_sl_sale    FOREIGN KEY (sale_id)    REFERENCES sales(id),
  CONSTRAINT fk_sl_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_sl_unit    FOREIGN KEY (unit_id)    REFERENCES units(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily closes
CREATE TABLE IF NOT EXISTS daily_closes (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  location_id INT UNSIGNED NOT NULL,
  close_date  DATE NOT NULL,
  status      ENUM('closed','reopened') NOT NULL DEFAULT 'closed',
  closed_by   INT UNSIGNED NOT NULL,
  closed_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reopened_by INT UNSIGNED NULL,
  reopened_at TIMESTAMP NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_close (location_id, close_date),
  CONSTRAINT fk_dc_location FOREIGN KEY (location_id) REFERENCES locations(id),
  CONSTRAINT fk_dc_closer   FOREIGN KEY (closed_by)   REFERENCES users(id),
  CONSTRAINT fk_dc_reopener FOREIGN KEY (reopened_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;