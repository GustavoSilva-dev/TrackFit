package com.trackfit.TrackFit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_summary")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DailySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_registro")
    private LocalDate dataRegistro;

    @Column(name = "total_kcal")
    private Double totalKcal;

    @Column(name = "total_proteina")
    private Double totalProteina;

    @Column(name = "total_carbo")
    private Double totalCarbo;

    @Column(name = "gordura_total")
    private Double totalGordura;

    @Column(name = "treino_boolean")
    private Boolean treino;

    @Column(name = "agua_ml")
    private int aguaMl;

    @Column(name = "meta_kcal")
    private Double metaKcal = 2100.0;

    @Column(name = "meta_proteina")
    private Double metaProteina = 150.0;

    @Column(name = "meta_gordura")
    private Double metaGordura = 70.0;

    @Column(name = "meta_carbo")
    private Double metaCarbo = 300.0;

    @Column(name = "meta_agua_ml")
    private int metaAguaMl = 3000;

}
