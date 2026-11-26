package com.souvik.library.models.reading;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadingLogItemModel {
    private Integer readingId;
    private Integer bookId;
    private String readingDate;
    private String status;
    private String notes;
    private String bookName;
    private String bookNameInEnglish;
    private String author;
    private String publication;
    private String bookImage;
    private String shelfName;
    private String parentShelfName;
}
