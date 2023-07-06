package com.souvik.library.models.bookShelfs;

import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.RestStatus;
import lombok.Data;

@Data
public class BookShelfModel extends RestStatus {
    private BookShelfs bookShelfs;
}
