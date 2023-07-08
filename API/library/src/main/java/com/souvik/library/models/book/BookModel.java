package com.souvik.library.models.book;

import com.souvik.library.entities.Book;
import com.souvik.library.models.RestStatus;
import lombok.Data;

@Data
public class BookModel extends RestStatus {
    private Book book;

}
