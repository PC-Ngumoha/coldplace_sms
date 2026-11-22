-- Create Stock Movements Ledger for tabulating all business transactions that affect stock.
USE coldplace;

CREATE TABLE IF NOT EXISTS stock_movements (
    id                      BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_id              INT UNSIGNED NOT NULL,
    location_id             INT UNSIGNED NOT NULL,
    movement_type           VARCHAR(30) NOT NULL,
    quantity_kg             DECIMAL(12,3) NOT NULL,
    movement_date           DATE NOT NULL,
    source_table            VARCHAR(50) NOT NULL,
    source_id               INT UNSIGNED NOT NULL,
    reason                  VARCHAR(255) NULL,
    created_by              INT UNSIGNED NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_sm_balance (location_id, product_id),
    INDEX idx_sm_product (product_id),
    INDEX idx_sm_date (movement_date),
    INDEX idx_sm_source (source_table, source_id),
    CONSTRAINT fk_sm_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_sm_location FOREIGN KEY (location_id) REFERENCES locations(id),
    CONSTRAINT fk_sm_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;