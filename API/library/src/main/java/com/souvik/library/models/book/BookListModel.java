package com.souvik.library.models.book;

import com.souvik.library.entities.Book;
import com.souvik.library.models.RestStatus;

import java.util.List;

public class BookListModel extends RestStatus {
    private List<Book> bookList;
}
