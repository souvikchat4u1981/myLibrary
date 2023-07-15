package com.souvik.library.models.borrow;

import com.souvik.library.entities.Borrow;
import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class BorrowListModel extends RestStatus {
    private List<Borrow> borrowList;
}
