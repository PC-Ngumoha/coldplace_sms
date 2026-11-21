-- Create products table and establish many-to-many relationship with the units table.
USE coldplace;

CREATE TABLE IF NOT EXISTS products (
    id                      INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sku                     VARCHAR(50) NOT NULL,
    name                    VARCHAR(200) NOT NULL,
    category_id             INT UNSIGNED NULL,
    description             VARCHAR(1000) NULL,
    min_stock_kg            DECIMAL(12,3) NOT NULL,
    status                  ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_by              INT UNSIGNED NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_product_sku (sku),
    INDEX idx_product_category (category_id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_product_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Establish many-to-many relationship between products & units
CREATE TABLE IF NOT EXISTS product_units (
    product_id              INT UNSIGNED NOT NULL,
    unit_id                 INT UNSIGNED NOT NULL,
    kg_per_unit             DECIMAL(12,3) NOT NULL,
    
    PRIMARY KEY (product_id, unit_id),
    INDEX idx_pu_unit (unit_id),
    CONSTRAINT fk_pu_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_pu_unit FOREIGN KEY (unit_id) REFERENCES units(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;