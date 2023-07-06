package com.souvik.library.service;

import com.souvik.library.models.InitialSearchModel;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.book.BookModel;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BookService {
    @GraphQLMutation(name="saveBook")
    public RestStatus saveBook(@GraphQLArgument(name = "book") BookModel book){
        RestStatus status = new RestStatus();
        try{

        }catch(Exception ex){
            status.setFailure(true);
            status.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return status;
    }
}
