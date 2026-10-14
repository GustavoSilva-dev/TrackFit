package com.trackfit.TrackFit.controller;

import com.trackfit.TrackFit.entity.DailySummary;
import com.trackfit.TrackFit.repository.DailySummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/daily")
public class DailyController {

    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    @GetMapping
    public Page<DailySummary> listarDailySummary(@PageableDefault(size = 10, sort = {"dataRegistro"}) Pageable paginacao) {
        return dailySummaryRepository.findAll(paginacao);
    }

    @GetMapping("/today")
    public DailySummary listarDailySummary() {
        return dailySummaryRepository.findByDayToday().orElseGet(() -> {;
            var newDailySummary = new DailySummary();
            newDailySummary.setDataRegistro(LocalDate.now());
            newDailySummary.setTotalGordura(0.0);
            dailySummaryRepository.save(newDailySummary);
            return newDailySummary;
        });
    }

    @PatchMapping("/water-250")
    public ResponseEntity atualizarConsumoAgua250ml() {
        var dailyAtual = dailySummaryRepository.findByDataRegistro(LocalDate.now());
        if (dailyAtual.isPresent()) {
            dailyAtual.get().setAguaMl(dailyAtual.get().getAguaMl() + 250);
            dailySummaryRepository.save(dailyAtual.get());
        } else {
            var newDailySummary = new DailySummary();
            newDailySummary.setDataRegistro(LocalDate.now());
            newDailySummary.setAguaMl(250);
            dailySummaryRepository.save(newDailySummary);
        }

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/water-500")
    public ResponseEntity atualizarConsumoAgua500ml() {
        var dailyAtual = dailySummaryRepository.findByDataRegistro(LocalDate.now());
        if (dailyAtual.isPresent()) {
            dailyAtual.get().setAguaMl(dailyAtual.get().getAguaMl() + 500);
            dailySummaryRepository.save(dailyAtual.get());
        } else {
            var newDailySummary = new DailySummary();
            newDailySummary.setDataRegistro(LocalDate.now());
            newDailySummary.setAguaMl(250);
            dailySummaryRepository.save(newDailySummary);
        }

        return ResponseEntity.ok().build();
    }
}
