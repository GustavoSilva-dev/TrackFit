CREATE TABLE food_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alimento_id VARCHAR(50) NOT NULL,
    peso_gramas INT NOT NULL,
    kcal_calculado DECIMAL(7,2) NOT NULL,
    proteina_calculada DECIMAL(7,2) NOT NULL,
    carbo_calculado DECIMAL(7,2) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alimento_id) REFERENCES alimentos(id)
);