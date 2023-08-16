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

    public List<Object[]> getBookDetailsWithShelfAndAuthor() {
        Query q = (Query) entityManager.createNativeQuery("select b.book_id , b.book_name,b.image, b.author,coalesce(b.publication,'') as publication, " +
                "coalesce (b.format,'') format, coalesce (b.description,'') description,coalesce (b.language,'') language ,bs.shelf_id , bs.shelf_name, " +
                "coalesce(bs.shelf_image,'') shelf_image, coalesce ((select case when shelf_name is NULL then '' else shelf_name  end as parent_shelf  " +
                "from book_shelfs bs1 where bs1.shelf_id=bs.parent_shelf_id),'') parent_shelf,b.book_name_in_english, " +
                "coalesce(b.digital_file_name,'') digital_file_name, coalesce(b.isbn,'') isbn,coalesce(b.price,0) price,coalesce(b.publishing_year,'') publishing_year  from books b, " +
                "book_shelfs bs where b.shelf_id = bs.shelf_id order by b.book_name_in_english");
//        q.setParameter("parent_id", id);
        List<Object[]> result = q.getResultList();
        return result;
    }

    public List<Object[]> getBookDetailsWithShelfAndAuthorByAuthor(String author) {
        Query q = (Query) entityManager.createNativeQuery("select b.book_id , b.book_name,b.image, b.author,coalesce(b.publication,'') as publication, " +
                "coalesce (b.format,'') format, coalesce (b.description,'') description,coalesce (b.language,'') language ,bs.shelf_id , bs.shelf_name, " +
                "coalesce(bs.shelf_image,'') shelf_image, coalesce ((select case when shelf_name is NULL then '' else shelf_name  end as parent_shelf  " +
                "from book_shelfs bs1 where bs1.shelf_id=bs.parent_shelf_id),'') parent_shelf,b.book_name_in_english, " +
                "coalesce(b.digital_file_name,'') digital_file_name, coalesce(b.isbn,'') isbn,coalesce(b.price,0) price,coalesce(b.publishing_year,'') publishing_year  from books b, " +
                "book_shelfs bs where b.shelf_id = bs.shelf_id and lower(b.author)=lower('" + author + "') order by b.book_name_in_english");
//        q.setParameter("parent_id", id);
        List<Object[]> result = q.getResultList();
        return result;
    }

    public List<Object[]> getAuthors() {
        Query q = (Query) entityManager.createNativeQuery("select b.author, count(b.book_name) from books b  group by b.author order by b.author");
        List<Object[]> result = q.getResultList();
        return result;
    }
}
