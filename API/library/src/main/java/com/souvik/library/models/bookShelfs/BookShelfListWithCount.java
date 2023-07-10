package com.souvik.library.models.bookShelfs;

import com.souvik.library.models.RestStatus;

import java.util.List;

public class BookShelfListWithCount extends RestStatus {
  public List<BookShelfModel> bookShelfList;
  public int count;
}
