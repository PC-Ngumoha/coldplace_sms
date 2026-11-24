-- Create the prices table
USE coldplace;

CREATE TABLE IF NOT EXISTS prices (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id            INT UNSIGNED NOT NULL,
  unit_id               INT UNSIGNED NOT NULL,
  price                 DECIMAL(12,2) NOT NULL,
  effective_from        DATE NOT NULL,
  effective_to          DATE NULL,
  created_by            INT UNSIGNED NOT NULL,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  INDEX idx_price_lookup (product_id, unit_id, effective_from),
  INDEX idx_price_unit (unit_id),
  CONSTRAINT fk_price_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_price_unit    FOREIGN KEY (unit_id)    REFERENCES units(id),
  CONSTRAINT fk_price_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;