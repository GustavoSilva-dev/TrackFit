package com.trackfit.TrackFit.dtos;

import jakarta.validation.constraints.Min;

public record DadosAdicionarTreino(
        Divisoes divisao,
        @Min(value = 1, message = "Quantidade de series deve ser maior que zero")
        int seriesValidas
) {
}
