package com.souvik.library.models;

import lombok.Data;

import java.util.List;

@Data
public class InitialSearchListModel extends RestStatus{
    private List<InitialSearchModel> books;
}
