package com.trackfit.TrackFit.repository;

import com.trackfit.TrackFit.entity.FoodEntries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodEntriesRepository extends JpaRepository<FoodEntries, Long> {
}
