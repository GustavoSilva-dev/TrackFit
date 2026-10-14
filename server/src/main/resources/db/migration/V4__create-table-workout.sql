CREATE TABLE workout_entries (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 divisao VARCHAR(20) NOT NULL,
                                 series_validas INT NOT NULL,
                                 data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);