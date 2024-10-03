package com.souvik.library.service;

import com.souvik.library.entities.Borrow;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.borrow.BorrowListModel;
import com.souvik.library.models.borrow.BorrowModel;
import com.souvik.library.models.borrow.BorrowWithBookDetails;
import com.souvik.library.models.borrow.BorrowWithBookDetailsList;
import com.souvik.library.repositiries.CustomRepository;
import com.souvik.library.repositiries.IBorrowRepository;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BorrowService {

    private final IBorrowRepository borrowRepository;
    private final CustomRepository customRepository;
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

    @GraphQLQuery(name="getBorrowList")
    public BorrowWithBookDetailsList getBorrowList(){
        BorrowWithBookDetailsList model = new BorrowWithBookDetailsList();
        try{
            List<Object[]> borrow = customRepository.getBorrowList();
            List<BorrowWithBookDetails> books = new ArrayList<>();
            for (Object[] item : borrow) {
                BorrowWithBookDetails b = new BorrowWithBookDetails();
                b.setBorrowId(Integer.valueOf(item[0].toString()));
                b.setBorrowBy(String.valueOf(item[1]));
                b.setBorrowDate(Timestamp.valueOf(item[2].toString()));
                b.setBookName(String.valueOf(item[3]));
                b.setBookNameInEnglish(String.valueOf(item[4]));
                b.setShelfName(String.valueOf(item[5]));
                b.setParentShelfName(String.valueOf(item[6]));
                b.setBookId(Integer.valueOf(item[7].toString()));
                b.setBookImage(String.valueOf(item[8]));

                books.add(b);

            }

            model.setBorrowList(books);
            model.setFailure(false);
            model.setMessage("Success");

        }catch(Exception ex){
            ex.printStackTrace();
            model.setFailure(true);
            model.setMessage(ex.getMessage());
        }

        return model;
    }
}
