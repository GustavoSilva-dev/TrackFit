CREATE TABLE daily_summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATE UNIQUE NOT NULL,
    total_kcal DECIMAL(7,2) DEFAULT 0.00,
    total_proteina DECIMAL(7,2) DEFAULT 0.00,
    total_carbo DECIMAL(7,2) DEFAULT 0.00
);