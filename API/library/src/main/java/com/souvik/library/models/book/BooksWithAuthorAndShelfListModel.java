package com.souvik.library.models.book;

import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class BooksWithAuthorAndShelfListModel extends RestStatus {
    private List<BooksWithAuthorAndShelfModel> bookList;
}
