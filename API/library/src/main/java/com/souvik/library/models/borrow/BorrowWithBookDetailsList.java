package com.souvik.library.models.borrow;

import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class BorrowWithBookDetailsList extends RestStatus {
    private List<BorrowWithBookDetails> borrowList;
}
