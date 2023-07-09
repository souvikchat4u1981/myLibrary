package com.souvik.library.service;

import com.souvik.library.entities.Book;
import com.souvik.library.models.InitialSearchModel;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.book.BookListModel;
import com.souvik.library.models.book.BookModel;
import com.souvik.library.repositiries.IBookRepository;
import com.souvik.library.repositiries.IConfigurationsRepository;
import com.souvik.library.utility.UtilityService;
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
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BookService {

    private final IConfigurationsRepository configurationsRepository;
    private final IBookRepository bookRepository;
    private final UtilityService utilityService;

    @GraphQLQuery(name = "loadBookByShelf")
    public BookListModel loadBookByShelf(@GraphQLArgument(name = "shelfId") int shelfId) {
        BookListModel model = new BookListModel();
        try {
            model.setBookList(bookRepository.findByShelfIdOrderByBookName(shelfId));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLQuery(name = "loadBookByShelfAndFilter")
    public BookListModel loadBookByShelfAndFilter(@GraphQLArgument(name = "shelfId") int shelfId, @GraphQLArgument(name = "filterParam") String filterParam) {
        BookListModel model = new BookListModel();
        try {
            model.setBookList(bookRepository.getBookByShelfAndFilter(shelfId, "%" + filterParam + "%"));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLQuery(name = "loadBookByParentShelfAndFilter")
    public BookListModel loadBookByParentShelfAndFilter(@GraphQLArgument(name = "shelfId") int shelfId, @GraphQLArgument(name = "filterParam") String filterParam) {
        BookListModel model = new BookListModel();
        try {
            model.setBookList(bookRepository.getBookByParentShelfAndFilter(shelfId, "%" + filterParam + "%"));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLQuery(name = "totalBookCount")
    public int totalBookCount() {
        return (int) bookRepository.count();
    }


    @GraphQLMutation(name = "saveBook")
    public RestStatus saveBook(@GraphQLArgument(name = "book") BookModel book) {
        RestStatus status = new RestStatus();
        try {
            Book b = book.getBook();
            //Download File if present
            if (b.getImage() != "" || b.getImage() != null) {

                if (b.getImage().contains("http")) {

                    String filePath = configurationsRepository.findByConfigName("imagePath").getConfigValue();
                    String fileName = b.getImage();
                    String extension = fileName.substring(fileName.lastIndexOf("."));
                    fileName = filePath + "\\" + utilityService.removeSpecialCharacter(b.getBookName()) + b.getShelfId() + extension;
                    boolean saved = utilityService.DownloadImage(fileName, book.getBook().getImage());
                    if (!saved) {
                        b.setImage("");
                    } else {
                        b.setImage(utilityService.removeSpecialCharacter(b.getBookName()) + b.getShelfId() + extension);
                    }
                } else if (b.getImage().contains("tmp")) {
                    String tempPath = configurationsRepository.findByConfigName("tempFilePath").getConfigValue() + "\\" + b.getImage();
                    String filePath = configurationsRepository.findByConfigName("imagePath").getConfigValue();
                    String fileName = b.getImage();
                    String extension = fileName.substring(fileName.lastIndexOf("."));
                    String time = new Timestamp(System.currentTimeMillis()).toString();
                    time = time.replace(" ", "").replace(":", "").replace(":", "").replace(".", "");

                    String fileNameOnly = utilityService.removeSpecialCharacter(b.getBookName()) + b.getShelfId() + time + extension;
                    fileName = filePath + "\\" + fileNameOnly;

                    String oldFileName = bookRepository.getById(b.getBookId()).getImage();
                    if (oldFileName != "") {
                        oldFileName = filePath + "\\" + oldFileName;
                    }


                    utilityService.deletePhysicalFile(oldFileName);
                    Files.move
                            (Paths.get(tempPath),
                                    Paths.get(fileName), StandardCopyOption.REPLACE_EXISTING);
                    b.setImage(fileNameOnly);
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

    @GraphQLQuery(name = "getUniqueListByColumn")
    public List<String> getUniqueListByColumn(@GraphQLArgument(name = "columnName") String columnName) {
        List<String> values = new ArrayList<>();
        try {

            List<Book> books = bookRepository.findAll();
            if (columnName.toLowerCase().equals("author"))
                values = books.stream().map(Book::getAuthor).toList();
            else if (columnName.toLowerCase().equals("publication"))
                values = books.stream().map(Book::getPublicastion).toList();

            values = values.stream()
                    .distinct()
                    .collect(Collectors.toList());
            values.removeAll(Arrays.asList("", null));

        } catch (Exception ex) {
            ex.printStackTrace();
        }


        return values;
    }
}
