package com.souvik.library.models.bookShelfs;

import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class BookShelfsListModel extends RestStatus {
    private List<BookShelfs> bookShelfs;

}
