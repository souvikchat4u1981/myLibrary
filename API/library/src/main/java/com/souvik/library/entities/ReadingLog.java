package com.souvik.library.entities;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "reading_log")
public class ReadingLog {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "reading_id")
    private Integer readingId;

    @Column(name = "book_id")
    private Integer bookId;

    @Column(name = "reading_date")
    private Timestamp readingDate;

    @Column(name = "status")
    private String status;

    @Column(name = "notes")
    private String notes;
}
