package com.souvik.library.repositiries;

import com.souvik.library.models.book.BooksWithAuthorAndShelfModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Repository
@AllArgsConstructor
public class CustomRepository {
    private final EntityManager entityManager;
    public List<Object[]> getBookDetailsWithShelfAndAuthor(){
        Query q = (Query) entityManager.createNativeQuery("select b.book_id , b.book_name,b.image, b.author,coalesce(b.publication,'') as publication, coalesce (b.format,'') format, coalesce (b.description,'') description,coalesce (b.language,'') language ,bs.shelf_id , bs.shelf_name, coalesce(bs.shelf_image,'') shelf_image, coalesce ((select case when shelf_name is NULL then '' else shelf_name  end as parent_shelf  from book_shelfs bs1 where bs1.shelf_id=bs.parent_shelf_id),'') parent_shelf,b.book_name_in_english  from books b, book_shelfs bs where b.shelf_id = bs.shelf_id order by b.book_name_in_english");
//        q.setParameter("parent_id", id);
        List<Object[]> result = q.getResultList();
        return result;
    }
}