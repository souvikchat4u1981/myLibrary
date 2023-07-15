package com.souvik.library.models.borrow;

import com.souvik.library.entities.Borrow;
import com.souvik.library.models.RestStatus;
import lombok.Data;

@Data
public class BorrowModel extends RestStatus {
    private Borrow borrow;
}
