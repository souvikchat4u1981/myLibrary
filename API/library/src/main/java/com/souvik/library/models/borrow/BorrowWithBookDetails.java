package com.souvik.library.models.borrow;

import io.leangen.graphql.annotations.GraphQLInputField;
import lombok.Data;

import javax.persistence.Column;
import java.sql.Timestamp;

@Data
public class BorrowWithBookDetails {
    private Integer borrowId;
    private String borrowBy;

    private Integer bookId;

     private Timestamp borrowDate;

    private Timestamp returnDate;

    private Boolean isReturn;

    private String comment;
    private String bookName;
    private String bookNameInEnglish;
    private String shelfName;
    private String parentShelfName;
    private String bookImage;

}
