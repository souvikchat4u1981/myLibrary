package com.souvik.library.service;

import com.souvik.library.entities.Borrow;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.borrow.BorrowModel;
import com.souvik.library.repositiries.IBorrowRepository;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BorrowService {

    private final IBorrowRepository borrowRepository;
    @GraphQLMutation(name = "addBookToBorrow")
    public RestStatus addBookToBorrow(@GraphQLArgument(name = "borrowBook")BorrowModel model){
        RestStatus status = new RestStatus();
        try{
            Borrow borrow = model.getBorrow();
            if(borrow.getBorrowBy()==null){
                borrow.setBorrowId(0);
            }
            if(borrow.getBorrowId()==0 || borrow.getIsReturn()==false){
                borrow.setReturnDate(null);
            }

            borrowRepository.save(borrow);
        }catch (Exception ex){
            status.setMessage(ex.getMessage());
            status.setFailure(true);
            ex.printStackTrace();
        }


        return status;
    }

    @GraphQLQuery(name="bookBorrowedBy")
    public BorrowModel bookBorrowedBy(@GraphQLArgument(name = "bookId") int bookId){
        BorrowModel model = new BorrowModel();
        try{
            model.setBorrow(borrowRepository.findByBookIdAndReturnDate(bookId,null));
            model.setMessage("SUCCESS");
            model.setFailure(false);
        }catch(Exception ex){
            model.setMessage(ex.getMessage());
            model.setFailure(true);
            ex.printStackTrace();
        }

        return model;
    }
}
