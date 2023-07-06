package com.souvik.library.models;

import lombok.Data;

@Data
public class InitialSearchModel extends RestStatus {
    private Integer bookId;
    private String bookName;
    private int shelfId;
    private String author;
    private String image;
    private String publicastion;
    private String detailsURL;
    private String description;
    private String format;
    private String isbn;
    private String publishigYear;
    private String language;
    private double price;
    private String genere;
}
