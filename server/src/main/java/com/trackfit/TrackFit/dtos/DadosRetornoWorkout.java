package com.trackfit.TrackFit.dtos;

import com.trackfit.TrackFit.entity.WorkoutEntries;

import java.time.LocalDateTime;

public record DadosRetornoWorkout(
        String divisao,
        int seriesValidas,
        LocalDateTime dataHora
) {
    public DadosRetornoWorkout(WorkoutEntries workout){
        this(workout.getDivisao().name(),
                workout.getSeriesValidas(),
                workout.getDataHora());
    }
}
