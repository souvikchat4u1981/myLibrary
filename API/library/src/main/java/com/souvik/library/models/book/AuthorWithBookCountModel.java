package com.souvik.library.models.book;

import lombok.Data;

@Data
public class AuthorWithBookCountModel {
    private String authorName;
    private String authorImage;
    private int bookCount;
}
