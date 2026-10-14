package com.trackfit.TrackFit.dtos;

import com.trackfit.TrackFit.entity.FoodEntries;

import java.time.LocalDateTime;

public record DadosRetornoFood(
        String alimento,
        Double proteinas,
        Double carboidratos,
        Double gorduras,
        LocalDateTime horario
) {
    public DadosRetornoFood(FoodEntries foodEntry){
        this(foodEntry.getAlimento().getNomeExibicao(),
                foodEntry.getProteinaCalculada(),
                foodEntry.getCarboCalculado(),
                foodEntry.getGorduraCalculada(),
                foodEntry.getDataHora());
    }
}
