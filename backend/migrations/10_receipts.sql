-- Setup Receipts and Receipt Lines tables
USE coldplace;

CREATE TABLE IF NOT EXISTS receipts (
  id                        INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  reference                 VARCHAR(30) NULL,
  supplier_id               INT UNSIGNED NOT NULL,
  location_id               INT UNSIGNED NOT NULL,
  receipt_date              DATE NOT NULL,
  delivery_ref              VARCHAR(100) NULL,
  notes                     VARCHAR(500) NULL,
  created_by                INT UNSIGNED NOT NULL,
  created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_receipt_reference (reference),
  INDEX idx_receipt_supplier (supplier_id),
  INDEX idx_receipt_location_date (location_id, receipt_date),
  INDEX idx_receipt_delivery_ref (delivery_ref),
  CONSTRAINT fk_receipt_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  CONSTRAINT fk_receipt_location FOREIGN KEY (location_id) REFERENCES locations(id),
  CONSTRAINT fk_receipt_creator  FOREIGN KEY (created_by)  REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS receipt_lines (
  id                        INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  receipt_id                INT UNSIGNED NOT NULL,
  product_id                INT UNSIGNED NOT NULL,
  unit_id                   INT UNSIGNED NOT NULL,
  delivered_qty             DECIMAL(12,3) NOT NULL,
  damaged_qty               DECIMAL(12,3) NOT NULL DEFAULT 0,
  accepted_kg               DECIMAL(12,3) NOT NULL,
  damaged_kg                DECIMAL(12,3) NOT NULL DEFAULT 0,
  damage_reason             VARCHAR(255) NULL,
  unit_cost                 DECIMAL(12,2) NOT NULL,
  line_value                DECIMAL(14,2) NOT NULL,

  UNIQUE KEY uq_receipt_line (receipt_id, product_id, unit_id),
  INDEX idx_rl_product (product_id),
  INDEX idx_rl_unit (unit_id),
  CONSTRAINT fk_rl_receipt FOREIGN KEY (receipt_id) REFERENCES receipts(id),
  CONSTRAINT fk_rl_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_rl_unit    FOREIGN KEY (unit_id)    REFERENCES units(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;