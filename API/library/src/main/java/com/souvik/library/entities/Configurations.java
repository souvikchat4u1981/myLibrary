package com.souvik.library.entities;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="configurations")
@Data
public class Configurations {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "config_id")
    private Integer configId;

    @Column(name = "config_name")
    private String configName;
    @Column(name = "config_value")
    private String configValue;
}
