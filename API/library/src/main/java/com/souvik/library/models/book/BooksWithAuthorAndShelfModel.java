package com.souvik.library.models.book;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BooksWithAuthorAndShelfModel {
    private Integer bookId;
    private String bookName;
    private String bookImage;
    private String author;
    private String publication;
    private String format;
    private String description;
    private String language;
    private String shelfName;
    private String parentShelfName;
    private Integer shelfId;
    private String shelfImage;
    private String bookNameInEnglish;
}
