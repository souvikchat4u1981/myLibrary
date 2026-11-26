package com.souvik.library.repositiries;

import com.souvik.library.entities.ReadingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IReadingLogRepository extends JpaRepository<ReadingLog, Integer> {
    List<ReadingLog> findAllByOrderByReadingDateDesc();
}
