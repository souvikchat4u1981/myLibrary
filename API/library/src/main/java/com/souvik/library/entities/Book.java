package com.souvik.library.entities;

import io.leangen.graphql.annotations.GraphQLInputField;
import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name="books")
public class Book {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "book_id")
    private Integer bookId;
    @Column(name = "book_name")
    private String bookName;
    @Column(name = "book_name_in_english")
    private String bookNameInEnglish;
    @Column(name = "shelf_id")
    private int shelfId;
    @Column(name = "author")
    private String author;
    @Column(name = "image")
    private String image;
    @Column(name = "publication")
    private String publicastion;
    @Column(name = "description")
    private String description;
    @Column(name = "format")
    private String format;
    @Column(name = "isbn")
    private String isbn;
    @Column(name = "publishing_year")
    private String publishigYear;
    @Column(name = "language")
    private String language;
    @Column(name = "price")
    private double price;
    @Column(name = "genere")
    private String genere;
    @Column(name="purchase_date")
    private Timestamp purchaseDate;
    @GraphQLInputField(defaultValue = "1")
    private Integer copy;
    @Column(name="digital_file_name")
    private String digitalFileName;
}
