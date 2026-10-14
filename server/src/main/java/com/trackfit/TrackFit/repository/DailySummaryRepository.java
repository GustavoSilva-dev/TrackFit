package com.trackfit.TrackFit.repository;

import com.trackfit.TrackFit.entity.DailySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Optional;

public interface DailySummaryRepository extends JpaRepository<DailySummary, Long> {
    Optional<DailySummary> findByDataRegistro(LocalDate dia);

    @Query("SELECT d FROM DailySummary d WHERE d.dataRegistro = CURRENT_DATE LIMIT 1")
    Optional<DailySummary> findByDayToday();
}
