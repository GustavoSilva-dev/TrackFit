package com.trackfit.TrackFit.entity;

import com.trackfit.TrackFit.dtos.Divisoes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_entries")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WorkoutEntries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "divisao")
    @Enumerated(EnumType.STRING)
    private Divisoes divisao;

    @Column(name = "series_validas")
    private int seriesValidas;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;
}