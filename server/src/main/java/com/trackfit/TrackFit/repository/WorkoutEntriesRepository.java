package com.trackfit.TrackFit.repository;

import com.trackfit.TrackFit.entity.WorkoutEntries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutEntriesRepository extends JpaRepository<WorkoutEntries, Long> {
}
