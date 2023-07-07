package com.souvik.library.repositiries;

import com.souvik.library.entities.Configurations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IConfigurationsRepository extends JpaRepository<Configurations, Integer> {
    Configurations findByConfigName(String configName);

}
