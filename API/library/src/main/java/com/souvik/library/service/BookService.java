package com.souvik.library.service;

import com.souvik.library.entities.Book;
import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.InitialSearchModel;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.book.*;
import com.souvik.library.repositiries.CustomRepository;
import com.souvik.library.repositiries.IBookRepository;
import com.souvik.library.repositiries.IBookShelfs;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class BookService {

    private final IConfigurationsRepository configurationsRepository;
    private final IBookRepository bookRepository;
    private final UtilityService utilityService;
    private final CustomRepository customRepository;
    private final IBookShelfs bookShelfs;

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

    @GraphQLMutation(name = "updateBookPurchaseDate")
    public RestStatus updateBookPurchaseDate(
            @GraphQLArgument(name = "bookId") int bookId,
            @GraphQLArgument(name = "purchaseDate") String purchaseDate) {
        RestStatus status = new RestStatus();
        try {
            Book b = bookRepository.findById(bookId)
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            if (purchaseDate == null || purchaseDate.trim().isEmpty()) {
                b.setPurchaseDate(null);
            } else {
                String dateStr = purchaseDate.trim();
                if (dateStr.length() == 10) {
                    dateStr = dateStr + " 00:00:00";
                } else {
                    dateStr = dateStr.replace("T", " ");
                    if (dateStr.length() > 19) {
                        dateStr = dateStr.substring(0, 19);
                    }
                }
                b.setPurchaseDate(Timestamp.valueOf(dateStr));
            }
            bookRepository.save(b);
            status.setFailure(false);
            status.setMessage("Purchase date updated");
        } catch (Exception ex) {
            status.setFailure(true);
            status.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return status;
    }

    @GraphQLQuery(name = "totalBookCount")
    public int totalBookCount() {
        return (int) bookRepository.count();
    }


    @GraphQLMutation(name = "deleteBook")
    public RestStatus deleteBook(@GraphQLArgument(name = "bookId") int bookId) {
        RestStatus status = new RestStatus();
        try {
            Book b = bookRepository.getById(bookId);
            if (b.getImage() != "") {
                String filePath = configurationsRepository.findByConfigName("imagePath").getConfigValue();
                try {
                    utilityService.deletePhysicalFile(filePath + "//" + b.getImage());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            bookRepository.deleteById(bookId);
            status.setFailure(false);
            status.setMessage("Success");

        } catch (Exception ex) {
            status.setMessage(ex.getMessage());
            status.setFailure(true);
            ex.printStackTrace();
        }
        return status;
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
                        status.setMessage("Image not saved...");
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


                if ((b.getBookId() == null || b.getBookId() == 0) && b.getPurchaseDate() == null) {
                    b.setPurchaseDate(new Timestamp(System.currentTimeMillis()));
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

    @GraphQLQuery(name = "getAllBooksWithAuthorAndShelf")
    public BooksWithAuthorAndShelfListModel getAllBooksWithAuthorAndShelf() {
        BooksWithAuthorAndShelfListModel model = new BooksWithAuthorAndShelfListModel();
        try {
            List<Object[]> items = customRepository.getBookDetailsWithShelfAndAuthor();
            List<BooksWithAuthorAndShelfModel> m = new ArrayList<>();
            for (Object[] item : items) {
                BooksWithAuthorAndShelfModel b = new BooksWithAuthorAndShelfModel();
                b.setBookId(Integer.valueOf(item[0].toString()));
                b.setBookName(String.valueOf(item[1]));
                b.setBookImage(String.valueOf(item[2]));
                b.setAuthor(String.valueOf(item[3]));
                b.setPublication(String.valueOf(item[4]));
                b.setFormat(String.valueOf(item[5]));
                b.setDescription(String.valueOf(item[6]));
                b.setLanguage(String.valueOf(item[7]));
                b.setShelfId(Integer.valueOf(item[8].toString()));
                b.setShelfName(String.valueOf(item[9]));
                b.setShelfImage(String.valueOf(item[10]));
                b.setParentShelfName(String.valueOf(item[11]));
                b.setBookNameInEnglish(String.valueOf(item[12]));
                b.setDigitalFileName(String.valueOf(item[13]));
                b.setIsbn(String.valueOf(item[14]));
                b.setPrice(item[15] != null ? Double.valueOf(item[15].toString()) : 0.0);
                b.setPublishing_year(String.valueOf(item[16]));
                b.setPurchaseDate(item.length > 17 && item[17] != null ? String.valueOf(item[17]) : "");
                m.add(b);
            }
            model.setBookList(m);
            model.setMessage("SUCCESS");
            model.setFailure(false);
        } catch (Exception ex) {
            ex.printStackTrace();
            model.setMessage(ex.getMessage());
            model.setFailure(true);
        }
        return model;
    }

    @GraphQLQuery(name = "getAllBooksWithAuthorAndShelfByAuthor")
    public BooksWithAuthorAndShelfListModel getAllBooksWithAuthorAndShelfByAuthor(@GraphQLArgument(name = "author") String author) {
        BooksWithAuthorAndShelfListModel model = new BooksWithAuthorAndShelfListModel();
        try {
            List<Object[]> items = customRepository.getBookDetailsWithShelfAndAuthorByAuthor(author);
            List<BooksWithAuthorAndShelfModel> m = new ArrayList<>();
            for (Object[] item : items) {
                BooksWithAuthorAndShelfModel b = new BooksWithAuthorAndShelfModel();
                b.setBookId(Integer.valueOf(item[0].toString()));
                b.setBookName(String.valueOf(item[1]));
                b.setBookImage(String.valueOf(item[2]));
                b.setAuthor(String.valueOf(item[3]));
                b.setPublication(String.valueOf(item[4]));
                b.setFormat(String.valueOf(item[5]));
                b.setDescription(String.valueOf(item[6]));
                b.setLanguage(String.valueOf(item[7]));
                b.setShelfId(Integer.valueOf(item[8].toString()));
                b.setShelfName(String.valueOf(item[9]));
                b.setShelfImage(String.valueOf(item[10]));
                b.setParentShelfName(String.valueOf(item[11]));
                b.setBookNameInEnglish(String.valueOf(item[12]));
                b.setDigitalFileName(String.valueOf(item[13]));
                b.setIsbn(String.valueOf(item[14]));
                b.setPrice(Double.valueOf(item[15].toString()));
                b.setPublishing_year(String.valueOf(item[16]));
                b.setPurchaseDate(item.length > 17 && item[17] != null ? String.valueOf(item[17]) : "");
                m.add(b);
            }
            model.setBookList(m);
            model.setMessage("SUCCESS");
            model.setFailure(false);
        } catch (Exception ex) {
            ex.printStackTrace();
            model.setMessage(ex.getMessage());
            model.setFailure(true);
        }
        return model;
    }

    @GraphQLQuery(name = "getAllAuthor")
    public AuthorWithBookCountListModel getAllAuthor() {
        AuthorWithBookCountListModel model = new AuthorWithBookCountListModel();
        try {
            List<Object[]> authorsObject = customRepository.getAuthors();
            List<AuthorWithBookCountModel> a = new ArrayList<>();
            List<BookShelfs> shelfs = bookShelfs.findAll();
            for (Object[] item : authorsObject) {
                AuthorWithBookCountModel m = new AuthorWithBookCountModel();
                m.setAuthorName(String.valueOf(item[0]));
                m.setBookCount(Integer.valueOf(item[1].toString()));
                String authImage = "";
                try {
                    String authName = String.valueOf(item[0]);
                    List<BookShelfs> s = shelfs.stream().filter(m1 -> m1.getShelfName().equalsIgnoreCase(authName)).collect(Collectors.toList());
                    List<BookShelfs> bsithPic = s.stream().filter(m2 -> m2.getShelfImage() != "").collect(Collectors.toList());
                    authImage = bsithPic.get(0).getShelfImage();
                } catch (Exception e) {

                }
                m.setAuthorImage(authImage);
                a.add(m);
            }
            model.setAuthorWithBookCountModels(a);
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }

    @GraphQLQuery(name = "getFirstBookInShelf")
    public BookModel getFirstBookInShelf(@GraphQLArgument(name = "shelfId") int shelfId) {
        BookModel book = new BookModel();
        try {
            Book found = findFirstBookInShelfOrChildren(shelfId, new HashSet<>());
            if (found != null) {
                book.setBook(found);
                book.setFailure(false);
                book.setMessage("SUCCESS");
            } else {
                book.setFailure(true);
                book.setMessage("No book found in shelf");
            }
        } catch (Exception ex) {
            book.setFailure(true);
            book.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return book;
    }

    private Book findFirstBookInShelfOrChildren(int shelfId, Set<Integer> visited) {
        if (!visited.add(shelfId)) {
            return null;
        }
        List<Book> bookList = bookRepository.findByShelfIdOrderByBookName(shelfId);
        if (bookList != null && !bookList.isEmpty()) {
            for (Book b : bookList) {
                if (b.getImage() != null && !b.getImage().trim().isEmpty()) {
                    return b;
                }
            }
        }
        List<BookShelfs> childShelfs = bookShelfs.findByParentShelfId(shelfId);
        if (childShelfs != null && !childShelfs.isEmpty()) {
            for (BookShelfs child : childShelfs) {
                if (child.getShelfId() != null) {
                    Book childBook = findFirstBookInShelfOrChildren(child.getShelfId(), visited);
                    if (childBook != null && childBook.getImage() != null && !childBook.getImage().trim().isEmpty()) {
                        return childBook;
                    }
                }
            }
        }
        if (bookList != null && !bookList.isEmpty()) {
            return bookList.get(0);
        }
        return null;
    }

    @GraphQLQuery(name = "getFirstBookInAuthor")
    public BookModel getFirstBookInAuthor(@GraphQLArgument(name = "author") String author) {
        BookModel book = new BookModel();
        try {
            List<Book> bookList = bookRepository.findByAuthorOrderByBookName(author);
            Book selected = bookList.stream()
                    .filter(b -> b.getImage() != null && !b.getImage().trim().isEmpty())
                    .findFirst()
                    .orElse(bookList.get(0));
            book.setBook(selected);
            book.setFailure(false);
            book.setMessage("SUCCESS");
        } catch (Exception ex) {
            book.setFailure(true);
            book.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return book;
    }

}
