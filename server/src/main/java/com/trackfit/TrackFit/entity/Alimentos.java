package com.trackfit.TrackFit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "alimentos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Alimentos {

    @Id
    private String id;

    @Column(name = "nome_exibicao")
    private String nomeExibicao;

    @Column(name = "kcal_por_grama")
    private Double kcalPorGrama;

    @Column(name = "proteina_por_grama")
    private Double proteinaPorGrama;

    @Column(name = "carbo_por_grama")
    private Double carboPorGrama;

    @Column(name = "gordura_por_grama")
    private Double gorduraPorGrama;
}