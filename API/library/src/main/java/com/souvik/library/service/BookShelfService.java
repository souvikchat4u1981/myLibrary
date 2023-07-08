package com.souvik.library.service;

import com.souvik.library.entities.BookShelfs;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.bookShelfs.BookShelfModel;
import com.souvik.library.models.bookShelfs.BookShelfsListModel;
import com.souvik.library.models.bookShelfs.ShelfRelationListModel;
import com.souvik.library.models.bookShelfs.ShelfRelationModel;
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
    private final IConfigurationsRepository configurationsRepository;
    private final UtilityService utilityService;

    @GraphQLQuery(name = "getAllBookShelfs")
    public BookShelfsListModel getAllBookShelfs(@GraphQLArgument(name = "reststatus") RestStatus restStatus) {
        BookShelfsListModel model = new BookShelfsListModel();
        model.setBookShelfs(bookShelfs.findAllParentBookShelfs());
        return model;
    }

    @GraphQLQuery(name="getShelfById")
    public BookShelfModel getShelfById(@GraphQLArgument(name="id") int id){
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

    @GraphQLMutation(name = "addBookShelf")
    public RestStatus addBookShelf(@GraphQLArgument(name = "bookShelf") BookShelfModel model) {
        RestStatus status = new RestStatus();
        try {
            BookShelfs shelfs = model.getBookShelfs();
            if (shelfs.getShelfImage() != "" || shelfs.getShelfImage() != null) {
                if (shelfs.getShelfImage().contains("http")) {

                    String time = new Timestamp(System.currentTimeMillis()).toString();
                    time = time.replace(" ", "").replace(":", "").replace(":", "").replace(".","");
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

    @GraphQLQuery(name="getAllShelfWithRelation")
    public ShelfRelationListModel getAllShelfWithRelation(){
        ShelfRelationListModel model = new ShelfRelationListModel();
        model.shelfRelationModelList = new ArrayList<>();

        try{
            List<BookShelfs> shelfs = bookShelfs.findAll();
            for(BookShelfs b: shelfs){
                String parentShelf="";
                String shelfName="";
                if(b.getParentShelfId()>0){
                    shelfName=b.getShelfName();
                    for(BookShelfs b1: shelfs){
                        if(b1.getShelfId()==b.getParentShelfId()){
                            parentShelf = b1.getShelfName();
                        }
                    }
                }else{
                    parentShelf=b.getShelfName();
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
        }catch(Exception ex){
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }

        return  model;
    }

    @GraphQLQuery(name = "filterShelfByAuthorOrBook")
    public BookShelfsListModel filterShelfByAuthorOrBook(@GraphQLArgument(name = "searchParam") String searchparam){
        BookShelfsListModel model = new BookShelfsListModel();
        try {
            model.setBookShelfs(bookShelfs.getAllByFilerParam("%" + searchparam + "%","%" + searchparam + "%"));
            model.setFailure(false);
            model.setMessage("SUCCESS");

        }catch (Exception ex){
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }

    @GraphQLQuery(name = "filterChildShelfByAuthorOrBook")
    public BookShelfsListModel filterChildShelfByAuthorOrBook(@GraphQLArgument(name = "searchParam") String searchparam, @GraphQLArgument(name = "parentId") int parentId){
        BookShelfsListModel model = new BookShelfsListModel();
        try {
            model.setBookShelfs(bookShelfs.getChildBookShelfsByFilterparam("%" + searchparam + "%","%" + searchparam + "%",parentId));
            model.setFailure(false);
            model.setMessage("SUCCESS");

        }catch (Exception ex){
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }

}


