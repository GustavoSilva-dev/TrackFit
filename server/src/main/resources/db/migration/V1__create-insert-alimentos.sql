CREATE TABLE alimentos (
    id VARCHAR(50) PRIMARY KEY,
    nome_exibicao VARCHAR(100) NOT NULL,
    kcal_por_grama DECIMAL(5,2) NOT NULL,
    proteina_por_grama DECIMAL(5,2) NOT NULL,
    carbo_por_grama DECIMAL(5,2) NOT NULL
);

INSERT INTO alimentos (id, nome_exibicao, kcal_por_grama, proteina_por_grama, carbo_por_grama)
VALUES
    ('PEITO_DE_FRANGO_GRELHADO', 'Peito de Frango Grelhado', 1.65, 0.31, 0.00),
    ('MACARRAO_COZIDO', 'Macarrão Cozido', 1.58, 0.05, 0.30),
    ('ARROZ_BRANCO_COZIDO', 'Arroz Branco Cozido', 1.30, 0.03, 0.28),
    ('FEIJAO_CARIOCA_COZIDO', 'Feijão Carioca', 0.76, 0.05, 0.14),
    ('OVO_COZIDO', 'Ovo Cozido', 1.55, 0.13, 0.01),
    ('WHEY_PROTEIN', 'Whey Protein Concentrado', 4.00, 0.80, 0.05),
    ('BANANA_PRATA', 'Banana Prata', 0.98, 0.01, 0.26);