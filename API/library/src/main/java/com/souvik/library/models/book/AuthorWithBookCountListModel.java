package com.souvik.library.models.book;

import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class AuthorWithBookCountListModel extends RestStatus {
    private List<AuthorWithBookCountModel> authorWithBookCountModels;
}
