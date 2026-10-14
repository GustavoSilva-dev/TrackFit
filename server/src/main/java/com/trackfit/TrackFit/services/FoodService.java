package com.trackfit.TrackFit.services;

import com.trackfit.TrackFit.dtos.DadosAdicionarRefeicao;
import com.trackfit.TrackFit.entity.FoodEntries;
import com.trackfit.TrackFit.repository.AlimentosRepository;
import com.trackfit.TrackFit.repository.DailySummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FoodService {

    @Autowired
    private AlimentosRepository alimentosRepository;

    public FoodEntries calcularCalorias(DadosAdicionarRefeicao dados) {
        var comida = alimentosRepository.findByNomeExibicao(String.valueOf(dados.alimento())).orElseThrow(() -> new RuntimeException("Alimento não encontrado"));

        Double calorias = comida.getKcalPorGrama() * dados.gramas();
        Double proteinas = comida.getProteinaPorGrama() * dados.gramas();
        Double carboidratos = comida.getCarboPorGrama() * dados.gramas();
        Double gorduras = comida.getGorduraPorGrama() * dados.gramas();

        return new FoodEntries(comida, dados.gramas(), calorias, proteinas, carboidratos, gorduras);
    }
}
