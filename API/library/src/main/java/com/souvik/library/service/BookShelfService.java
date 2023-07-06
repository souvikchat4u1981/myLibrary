package com.souvik.library.service;

import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.bookShelfs.BookShelfModel;
import com.souvik.library.models.bookShelfs.BookShelfsListModel;
import com.souvik.library.repositiries.IBookShelfs;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@GraphQLApi
@RequiredArgsConstructor
public class BookShelfService {

    private final IBookShelfs bookShelfs;
    @GraphQLQuery(name="getAllBookShelfs")
    public BookShelfsListModel getAllBookShelfs(@GraphQLArgument(name = "reststatus")RestStatus restStatus){
        BookShelfsListModel model = new BookShelfsListModel();
        model.setBookShelfs(bookShelfs.findAllParentBookShelfs());
        return model;
    }

    @GraphQLQuery(name="getChildBookShelfs")
    public BookShelfsListModel getAllChildShelf(@GraphQLArgument(name="parentId") Integer parentId){
        BookShelfsListModel model = new BookShelfsListModel();
        try{
            model.setBookShelfs(bookShelfs.findByParentShelfId(parentId));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        }catch(Exception ex){
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLMutation(name="addBookShelf")
    public RestStatus addBookShelf(@GraphQLArgument(name = "bookShelf")BookShelfModel model){
        RestStatus status = new RestStatus();
        try{
            bookShelfs.save(model.getBookShelfs());
            status.setMessage("SUCCESS");
            status.setFailure(false);
        }catch(Exception ex){

            status.setFailure(true);
            if(ex.getMessage().contains("book_shelfs_un")){
                status.setMessage("Shelf already exists");
            }else {
                status.setMessage(ex.getMessage());
            }
            ex.printStackTrace();
        }
        return status;
    }
}
