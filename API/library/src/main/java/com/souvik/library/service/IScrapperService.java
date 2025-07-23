package com.souvik.library.service;

import com.souvik.library.models.InitialSearchListModel;
import com.souvik.library.models.InitialSearchModel;
import org.json.simple.parser.ParseException;

public interface IScrapperService {
    InitialSearchListModel retrieveBooks(String queryString) throws ParseException;
    InitialSearchModel bookDetails(InitialSearchModel book);
}
