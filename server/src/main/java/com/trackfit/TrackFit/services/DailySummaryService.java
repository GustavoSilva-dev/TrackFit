package com.trackfit.TrackFit.services;

import com.trackfit.TrackFit.entity.DailySummary;
import com.trackfit.TrackFit.entity.FoodEntries;
import com.trackfit.TrackFit.entity.WorkoutEntries;
import com.trackfit.TrackFit.repository.DailySummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class DailySummaryService {

    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    @Transactional
    public void criarOuAtualizarDailySummary(FoodEntries food) {
        var dailySummary = dailySummaryRepository.findByDataRegistro(LocalDate.now());

        if(dailySummary.isEmpty()) {
            DailySummary newDailySummary = new DailySummary();
            newDailySummary.setDataRegistro(LocalDate.now());
            if (food != null) {
                newDailySummary.setTotalKcal(food.getKcalCalculado());
                newDailySummary.setTotalProteina(food.getProteinaCalculada());
                newDailySummary.setTotalCarbo(food.getCarboCalculado());
                newDailySummary.setTotalGordura(food.getGorduraCalculada());
            }
            dailySummaryRepository.save(newDailySummary);
        } else {
            DailySummary existingDailySummary = dailySummary.get();
            if (food != null) {
                existingDailySummary.setTotalKcal(existingDailySummary.getTotalKcal() != null ? existingDailySummary.getTotalKcal() + food.getKcalCalculado() : food.getKcalCalculado());
                existingDailySummary.setTotalProteina(existingDailySummary.getTotalProteina() != null ? existingDailySummary.getTotalProteina() + food.getProteinaCalculada() : food.getProteinaCalculada());
                existingDailySummary.setTotalCarbo(existingDailySummary.getTotalCarbo() != null ? existingDailySummary.getTotalCarbo() + food.getCarboCalculado() : food.getCarboCalculado());
                existingDailySummary.setTotalGordura(existingDailySummary.getTotalGordura() != null ? existingDailySummary.getTotalGordura() + food.getGorduraCalculada() : food.getGorduraCalculada());
            }
            dailySummaryRepository.save(existingDailySummary);
        }
    }
}
