package com.trackfit.TrackFit.repository;

import com.trackfit.TrackFit.entity.Alimentos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlimentosRepository extends JpaRepository<Alimentos, String> {
    Optional<Alimentos> findByNomeExibicao(String nome);
}
