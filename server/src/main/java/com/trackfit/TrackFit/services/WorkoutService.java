package com.trackfit.TrackFit.services;

import com.trackfit.TrackFit.dtos.DadosAdicionarTreino;
import com.trackfit.TrackFit.entity.DailySummary;
import com.trackfit.TrackFit.entity.WorkoutEntries;
import com.trackfit.TrackFit.repository.DailySummaryRepository;
import com.trackfit.TrackFit.repository.WorkoutEntriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class WorkoutService {

    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    @Autowired
    private WorkoutEntriesRepository workoutEntriesRepository;

    @Transactional
    public WorkoutEntries criarWorkout(DadosAdicionarTreino dados){
        var registroTreino = new WorkoutEntries();
        registroTreino.setDataHora(LocalDateTime.now());
        registroTreino.setDivisao(dados.divisao());
        registroTreino.setSeriesValidas(dados.seriesValidas());

        var daily = dailySummaryRepository.findByDataRegistro(LocalDate.now());

        if(daily.isPresent()){
            daily.get().setTreino(true);
            dailySummaryRepository.save(daily.get());
            workoutEntriesRepository.save(registroTreino);
        }
        else {
            var newDailySummary = new DailySummary();
            newDailySummary.setDataRegistro(LocalDate.now());
            newDailySummary.setTreino(true);
            dailySummaryRepository.save(newDailySummary);
            workoutEntriesRepository.save(registroTreino);
        }

        return registroTreino;
    }
}
