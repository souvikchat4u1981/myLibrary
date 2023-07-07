package com.souvik.library.service;

import com.souvik.library.entities.Book;
import com.souvik.library.models.InitialSearchModel;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.book.BookListModel;
import com.souvik.library.models.book.BookModel;
import com.souvik.library.repositiries.IBookRepository;
import com.souvik.library.repositiries.IConfigurationsRepository;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BookService {

    private final IConfigurationsRepository configurationsRepository;
    private final IBookRepository bookRepository;

    @GraphQLQuery(name = "loadBookByShelf")
    public BookListModel loadBookByShelf(@GraphQLArgument(name = "shelfId") int shelfId){
        BookListModel model = new BookListModel();
        try{
            model.setBookList(bookRepository.findByShelfIdOrderByBookName(shelfId));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        }catch(Exception ex)
        {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLMutation(name = "saveBook")
    public RestStatus saveBook(@GraphQLArgument(name = "book") BookModel book) {
        RestStatus status = new RestStatus();
        try {
            Book b = book.getBook();
            //Download File if present
            if (b.getImage() != "" || b.getImage() != null) {
                String filePath = configurationsRepository.findByConfigName("imagePath").getConfigValue();
                String fileName = b.getImage();
                String extension = fileName.substring(fileName.lastIndexOf("."));


                fileName = filePath + "\\" + b.getBookName() + b.getShelfId() + extension;
                try (BufferedInputStream in = new BufferedInputStream(new URL(book.getBook().getImage()).openStream());
                     FileOutputStream fileOutputStream = new FileOutputStream(fileName)) {
                    byte dataBuffer[] = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                        fileOutputStream.write(dataBuffer, 0, bytesRead);
                    }
                    b.setImage(b.getBookName() + b.getShelfId() + extension);

                } catch (IOException e) {
                    // handle exception
                    b.setImage("");
                }

                bookRepository.save(b);
            }

        } catch (Exception ex) {
            status.setFailure(true);
            status.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return status;
    }
}
