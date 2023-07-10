package com.souvik.library.models;

import com.souvik.library.models.bookShelfs.BookShelfModel;
import lombok.Data;

import java.util.List;

@Data
public class BookShelfListWithCount extends RestStatus{
    private List<BookShelfModel> bookShelfList;
}
