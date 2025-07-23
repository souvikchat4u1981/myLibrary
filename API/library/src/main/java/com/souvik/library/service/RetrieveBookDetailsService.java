package com.souvik.library.service;

import com.souvik.library.models.InitialSearchListModel;
import com.souvik.library.models.InitialSearchModel;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@GraphQLApi
public class RetrieveBookDetailsService {

    private final List<IScrapperService> scrappers;

    @Autowired
    public RetrieveBookDetailsService(ReadBengaliBooksScrapper readBengaliBooksScrapper, BoiChitroScrapper boiChitroScrapper) {
        this.scrappers = new ArrayList<>();
        this.scrappers.add(readBengaliBooksScrapper);
        this.scrappers.add(boiChitroScrapper);
    }

    @GraphQLQuery(name = "retrieveBooks")
    public InitialSearchListModel retrieveBooks(@GraphQLArgument(name = "queryString") String queryString) throws ParseException {
        InitialSearchListModel model = null;
        for (IScrapperService scrapper : scrappers) {
            try {
                model = scrapper.retrieveBooks(queryString);
                if (!model.isFailure() && model.getBooks() != null && !model.getBooks().isEmpty()) {
                    return model;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (model == null) {
            model = new InitialSearchListModel();
            model.setFailure(true);
            model.setMessage("All scrapers failed to retrieve books.");
        }
        return model;
    }

    @GraphQLQuery(name = "bookDetails")
    public InitialSearchModel bookDetails(@GraphQLArgument(name = "book") InitialSearchModel book) {
        InitialSearchModel model = null;
        for (IScrapperService scrapper : scrappers) {
            try {
                // A bit of a hack to know which scrapper to use.
                // Ideally, the book model should contain the source.
                if (book.getDetailsURL().contains("readbengalibooks")) {
                    if (scrapper instanceof ReadBengaliBooksScrapper) {
                        model = scrapper.bookDetails(book);
                        if (!model.isFailure()) {
                            return model;
                        }
                    }
                } else if (book.getDetailsURL().contains("boichitro")) {
                    if (scrapper instanceof BoiChitroScrapper) {
                        model = scrapper.bookDetails(book);
                        if (!model.isFailure()) {
                            return model;
                        }
                    }
                } else {
                    // If we don't know the source, try all scrapers
                    model = scrapper.bookDetails(book);
                    if (!model.isFailure()) {
                        return model;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (model == null) {
            model = new InitialSearchModel();
            model.setFailure(true);
            model.setMessage("All scrapers failed to retrieve book details.");
        }
        return model;
    }
}