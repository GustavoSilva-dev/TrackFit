package com.trackfit.TrackFit.controller;

import com.trackfit.TrackFit.dtos.DadosAdicionarTreino;
import com.trackfit.TrackFit.dtos.DadosRetornoWorkout;
import com.trackfit.TrackFit.entity.WorkoutEntries;
import com.trackfit.TrackFit.repository.DailySummaryRepository;
import com.trackfit.TrackFit.repository.WorkoutEntriesRepository;
import com.trackfit.TrackFit.services.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private WorkoutEntriesRepository workoutEntriesRepository;

    @PostMapping
    public ResponseEntity<WorkoutEntries> cadastrarTreino(@RequestBody @Valid DadosAdicionarTreino dados, UriComponentsBuilder uriBuilder){
        var registroSalvo = workoutService.criarWorkout(dados);
        var uri = uriBuilder.path("/workout/{id}").buildAndExpand(registroSalvo.getId()).toUri();

        return ResponseEntity.created(uri).body(registroSalvo);
    }

    @GetMapping
    public Page<DadosRetornoWorkout> listarTreinos(@PageableDefault(size = 10, sort = {"dataHora"}) Pageable paginacao) {
        return workoutEntriesRepository.findAll(paginacao).map(DadosRetornoWorkout::new);
    }
}
