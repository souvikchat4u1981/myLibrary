package com.souvik.library.service;

import com.souvik.library.entities.Book;
import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.BookShelfListWithCount;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.book.BookListModel;
import com.souvik.library.models.bookShelfs.BookShelfModel;
import com.souvik.library.models.bookShelfs.BookShelfsListModel;
import com.souvik.library.models.bookShelfs.ShelfRelationListModel;
import com.souvik.library.models.bookShelfs.ShelfRelationModel;

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

import java.sql.Timestamp;
import java.util.*;

@Service
@GraphQLApi
@RequiredArgsConstructor
public class BookShelfService {

    private final IBookShelfs bookShelfs;
    private final IBookRepository book;
    private final IConfigurationsRepository configurationsRepository;
    private final UtilityService utilityService;
    private final BookService bookService;

    @GraphQLQuery(name = "getAllBookShelfs")
    public BookShelfsListModel getAllBookShelfs(@GraphQLArgument(name = "reststatus") RestStatus restStatus) {
        BookShelfsListModel model = new BookShelfsListModel();
        model.setBookShelfs(bookShelfs.findAllParentBookShelfs());
        return model;
    }


    @GraphQLQuery(name = "getAllBookShelfsWithCount")
    public BookShelfListWithCount getAllBookShelfsWithCount(@GraphQLArgument(name = "reststatus") RestStatus restStatus) {
        BookShelfListWithCount model = new BookShelfListWithCount();
        List<BookShelfs> shelfs = bookShelfs.findAllParentBookShelfs();
        List<BookShelfModel> sm = new ArrayList<>();
        for (BookShelfs b : shelfs) {
            int count = bookShelfs.getBookCountByShelf(b.getShelfId());
            BookShelfModel m = new BookShelfModel();

//            Get first book image
//            Book b1 = book.findTopByShelfIdOrderByBookName(b.getShelfId()).orElse(null);
//            if(b1!=null){
//                b.setShelfImage(b1.getImage());
//            }
            m.setBookShelfs(b);
            m.setBookCount(count);
            sm.add(m);
        }
        model.setBookShelfList(sm);
        return model;
    }

    @GraphQLQuery(name = "getShelfById")
    public BookShelfModel getShelfById(@GraphQLArgument(name = "id") int id) {
        BookShelfModel model = new BookShelfModel();
        model.setBookShelfs(bookShelfs.getById(id));
        return model;
    }

    @GraphQLQuery(name = "getChildBookShelfs")
    public BookShelfsListModel getAllChildShelf(@GraphQLArgument(name = "parentId") Integer parentId) {
        BookShelfsListModel model = new BookShelfsListModel();
        try {
            model.setBookShelfs(bookShelfs.findByParentShelfId(parentId));
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLQuery(name = "getChildBookShelfsWithCount")
    public BookShelfListWithCount getChildBookShelfsWithCount(@GraphQLArgument(name = "parentId") Integer parentId) {
        BookShelfListWithCount model = new BookShelfListWithCount();


        try {

            List<BookShelfs> shelfs = bookShelfs.findByParentShelfId(parentId);
            List<BookShelfModel> sm = new ArrayList<>();
            for (BookShelfs b : shelfs) {
                int count = bookShelfs.getBookCountByShelf(b.getShelfId());
                BookShelfModel m = new BookShelfModel();
                m.setBookShelfs(b);
                m.setBookCount(count);
                sm.add(m);
            }
            Collections.sort(sm, new Comparator<BookShelfModel>() {
                @Override
                public int compare(final BookShelfModel object1, final BookShelfModel object2) {
                    return object1.getBookShelfs().getShelfName().compareTo(object2.getBookShelfs().getShelfName());
                }
            });
            model.setBookShelfList(sm);
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLMutation(name = "addBookShelf")
    public RestStatus addBookShelf(@GraphQLArgument(name = "bookShelf") BookShelfModel model) {
        RestStatus status = new RestStatus();
        try {
            BookShelfs shelfs = model.getBookShelfs();
            if (shelfs.getShelfImage() != "" || shelfs.getShelfImage() != null) {
                if (shelfs.getShelfImage().contains("http")) {

                    String time = new Timestamp(System.currentTimeMillis()).toString();
                    time = time.replace(" ", "").replace(":", "").replace(":", "").replace(".", "");
                    String filePath = configurationsRepository.findByConfigName("authorImagePath").getConfigValue();
                    String fileName = shelfs.getShelfImage();
                    //Delete old Image
                    if (shelfs.getShelfId() > 0) {
                        BookShelfs s = new BookShelfs();
                        s = bookShelfs.findById(shelfs.getShelfId()).get();
                        if (s.getShelfImage() != "" && s.getShelfName() != null) {
                            utilityService.deletePhysicalFile(filePath + "\\" + s.getShelfImage());
                        }
                    }

                    String extension = fileName.substring(fileName.lastIndexOf("."));
                    String onlyFileName = shelfs.getShelfName().replace(" ", "") + time + extension;
                    fileName = filePath + "\\" + shelfs.getShelfName().replace(" ", "") + time + extension;

                    boolean saved = utilityService.DownloadImage(fileName, shelfs.getShelfImage());
                    if (!saved) {
                        model.getBookShelfs().setShelfImage("");
                    } else {
                        model.getBookShelfs().setShelfImage(onlyFileName);
                    }
                }
            }
            bookShelfs.save(model.getBookShelfs());
            status.setMessage("SUCCESS");
            status.setFailure(false);
        } catch (Exception ex) {

            status.setFailure(true);
            if (ex.getMessage().contains("book_shelfs_un")) {
                status.setMessage("Shelf already exists");
            } else {
                status.setMessage(ex.getMessage());
            }
            ex.printStackTrace();
        }
        return status;
    }

    @GraphQLMutation(name = "deleteShelfs")
    public RestStatus deleteShelf(@GraphQLArgument(name = "shelf") int id) {
        RestStatus status = new RestStatus();
        try {
            //Check if any book associated with shelf
            BookListModel books = bookService.loadBookByShelf(id);
            if (books.getBookList().size() > 0) {
                status.setFailure(true);
                status.setMessage("Shelf has books.");
            } else if (bookShelfs.findByParentShelfId(id).size() > 0) {
                status.setFailure(true);
                status.setMessage("Shelf has child sheifs.");
            } else {
                BookShelfs b = bookShelfs.getById(id);
                if (b.getShelfImage() != "") {
                    String filePath = configurationsRepository.findByConfigName("authorImagePath").getConfigValue();
                    try {
                        utilityService.deletePhysicalFile(filePath + "//" + b.getShelfImage());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }
                bookShelfs.deleteById(id);
                status.setFailure(false);
                status.setMessage("Success");
            }

        } catch (Exception ex) {
            status.setMessage(ex.getMessage());
            status.setFailure(true);
            ex.printStackTrace();
        }


        return status;
    }

    @GraphQLQuery(name = "getAllShelfWithRelation")
    public ShelfRelationListModel getAllShelfWithRelation() {
        ShelfRelationListModel model = new ShelfRelationListModel();
        model.shelfRelationModelList = new ArrayList<>();

        try {
            List<BookShelfs> shelfs = bookShelfs.findAll();
            List<BookShelfs> parentBookShelfs = bookShelfs.findAllParentBookShelfs();
            for (BookShelfs b : shelfs) {
                String parentShelf = "";
                String shelfName = "";
                if (b.getParentShelfId() > 0) {
                    shelfName = b.getShelfName();
                    if (shelfName.equals("Pallabi Sengupta")) {
                        System.out.println(shelfName);
                    }
                    for (BookShelfs b1 : parentBookShelfs) {
                        if (b1.getShelfId().equals(b.getParentShelfId())) {
                            parentShelf = b1.getShelfName();
                        }
                    }
                } else {
                    parentShelf = b.getShelfName();
                }

                ShelfRelationModel m = new ShelfRelationModel();
                m.setShelfId(b.getShelfId());
                m.setShelfName(shelfName);
                m.setParentShelfName(parentShelf);
                model.shelfRelationModelList.add(m);
            }
            Collections.sort(model.getShelfRelationModelList(), new Comparator<ShelfRelationModel>() {
                @Override
                public int compare(ShelfRelationModel o1, ShelfRelationModel o2) {
                    return o1.getParentShelfName().compareTo(o2.getParentShelfName());
                }
            });
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return model;
    }

    @GraphQLQuery(name = "filterShelfByAuthorOrBook")
    public BookShelfListWithCount filterShelfByAuthorOrBook(@GraphQLArgument(name = "searchParam") String searchparam) {
        BookShelfListWithCount model = new BookShelfListWithCount();
        try {
            List<BookShelfs> shelfs = bookShelfs.getAllByFilerParam("%" + searchparam + "%", "%" + searchparam + "%");
            List<BookShelfModel> sm = new ArrayList<>();
            for (BookShelfs b : shelfs) {
                int count = bookShelfs.getBookCountByShelf(b.getShelfId());
                BookShelfModel m = new BookShelfModel();
                m.setBookShelfs(b);
                m.setBookCount(count);
                sm.add(m);
            }
            model.setBookShelfList(sm);
            model.setFailure(false);
            model.setMessage("SUCCESS");

        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }

    @GraphQLQuery(name = "filterChildShelfByAuthorOrBook")
    public BookShelfListWithCount filterChildShelfByAuthorOrBook(@GraphQLArgument(name = "searchParam") String searchparam, @GraphQLArgument(name = "parentId") int parentId) {
        BookShelfListWithCount model = new BookShelfListWithCount();
        try {
            List<BookShelfs> shelfs = bookShelfs.getChildBookShelfsByFilterparam("%" + searchparam + "%", "%" + searchparam + "%", parentId);
            List<BookShelfModel> sm = new ArrayList<>();
            for (BookShelfs b : shelfs) {
                int count = bookShelfs.getBookCountByShelf(b.getShelfId());
                BookShelfModel m = new BookShelfModel();
                m.setBookShelfs(b);
                m.setBookCount(count);
                sm.add(m);
            }
            model.setBookShelfList(sm);
            model.setFailure(false);
            model.setMessage("SUCCESS");

        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }

}


