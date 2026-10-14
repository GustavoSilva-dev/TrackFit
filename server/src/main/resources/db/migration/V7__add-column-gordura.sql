ALTER TABLE alimentos
ADD COLUMN gordura_por_grama DECIMAL(5,2) NOT NULL DEFAULT 0.00;

ALTER TABLE food_entries
ADD COLUMN gordura_calculada DECIMAL(7,2) NOT NULL DEFAULT 0.00;

ALTER TABLE daily_summary
ADD COLUMN meta_gordura DECIMAL(7,2) NOT NULL DEFAULT 70,
ADD COLUMN meta_agua_ml DECIMAL(7,2) NOT NULL DEFAULT 3000.00;

ALTER TABLE daily_summary
ADD COLUMN gordura_total DECIMAL(7,2) NOT NULL DEFAULT 0.00;

UPDATE alimentos SET gordura_por_grama = 0.04 WHERE id = 'PEITO_DE_FRANGO_GRELHADO';

UPDATE alimentos SET gordura_por_grama = 0.01 WHERE id = 'MACARRAO_COZIDO';

UPDATE alimentos SET gordura_por_grama = 0.01 WHERE id = 'FEIJAO_CARIOCA_COZIDO';

UPDATE alimentos SET gordura_por_grama = 0.11 WHERE id = 'OVO_COZIDO';

UPDATE alimentos SET gordura_por_grama = 0.06 WHERE id = 'WHEY_PROTEIN';