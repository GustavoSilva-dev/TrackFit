package com.trackfit.TrackFit.dtos;

import jakarta.validation.constraints.Min;

public record DadosAdicionarRefeicao(
        String alimento,
        @Min(value = 1, message =  "Quantidade de gramas deve ser maior que zero")
        int gramas
) {
}
