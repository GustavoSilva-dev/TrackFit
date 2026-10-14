package com.trackfit.TrackFit.controller;

import com.trackfit.TrackFit.dtos.AlimentosEnum;
import com.trackfit.TrackFit.dtos.DadosAdicionarRefeicao;
import com.trackfit.TrackFit.dtos.DadosAdicionarRefeicaoCoringa;
import com.trackfit.TrackFit.dtos.DadosRetornoFood;
import com.trackfit.TrackFit.entity.Alimentos;
import com.trackfit.TrackFit.repository.AlimentosRepository;
import com.trackfit.TrackFit.repository.FoodEntriesRepository;
import com.trackfit.TrackFit.services.DailySummaryService;
import com.trackfit.TrackFit.services.FoodService;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/food")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private FoodEntriesRepository foodEntriesRepository;

    @Autowired
    private AlimentosRepository alimentosRepository;

    @Autowired
    private DailySummaryService dailySummaryService;

    @GetMapping
    public Page<DadosRetornoFood> listarRefeicoes(@PageableDefault(size = 10, sort = {"dataHora"}) Pageable paginacao) {
        return foodEntriesRepository.findAll(paginacao).map(DadosRetornoFood::new);
    }

    @PostMapping
    public ResponseEntity cadastrarRefeicao(@RequestBody @Valid DadosAdicionarRefeicao dados, UriComponentsBuilder uriBuilder){
        var registroComida = foodService.calcularCalorias(dados);
        var uri = uriBuilder.path("/food/{id}").buildAndExpand(registroComida.getId()).toUri();
        foodEntriesRepository.save(registroComida);

        dailySummaryService.criarOuAtualizarDailySummary(registroComida);

        return ResponseEntity.created(uri).body(registroComida);
    }

    @PostMapping("/coringa")
    public ResponseEntity cadastrarRefeicaoCoringa(@RequestBody @Valid DadosAdicionarRefeicaoCoringa dados) {
        Double caloriaCalculada = (dados.proteinas() * 4) + (dados.carboidratos() * 4) + (dados.gorduras() * 9);

        var alimentoNovo = new Alimentos(dados.nome().toUpperCase().replace(" ", "_"), dados.nome(),
                caloriaCalculada / dados.gramas(),
                dados.proteinas() / dados.gramas(),
                dados.carboidratos() / dados.gramas(),
                dados.gorduras() / dados.gramas());
        alimentosRepository.save(alimentoNovo);

        var registroComida = foodService.calcularCalorias(new DadosAdicionarRefeicao(alimentoNovo.getId(), dados.gramas().intValue()));
        foodEntriesRepository.save(registroComida);

        dailySummaryService.criarOuAtualizarDailySummary(registroComida);

        return ResponseEntity.ok().body(registroComida);
    }

}