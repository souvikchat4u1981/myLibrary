package com.souvik.library.models.book;

import com.souvik.library.entities.Book;
import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class BookListModel extends RestStatus {
    private List<Book> bookList;
}
