package com.trackfit.TrackFit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_entries")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FoodEntries {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "alimento_id")
    private Alimentos alimento;

    @Column(name = "peso_gramas")
    private int pesoGramas;

    @Column(name = "kcal_calculado")
    private Double kcalCalculado;

    @Column(name = "proteina_calculada")
    private Double proteinaCalculada;

    @Column(name = "carbo_calculado")
    private Double carboCalculado;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @Column(name = "gordura_calculada")
    private Double gorduraCalculada;

    public FoodEntries(Alimentos comida, int gramas, Double calorias, Double proteinas, Double carboidratos, Double gorduras) {
        this.alimento = comida;
        this.pesoGramas = gramas;
        this.kcalCalculado = calorias;
        this.proteinaCalculada = proteinas;
        this.carboCalculado = carboidratos;
        this.dataHora = LocalDateTime.now();
        this.gorduraCalculada = gorduras;
    }
}