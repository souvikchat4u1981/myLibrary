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
                "coalesce (b.format,'') format, coalesce (b.description,'') description,coalesce (b.language,'') as language ,bs.shelf_id , bs.shelf_name, " +
                "coalesce(bs.shelf_image,'') shelf_image, coalesce ((select case when shelf_name is NULL then '' else shelf_name  end as parent_shelf  " +
                "from book_shelfs bs1 where bs1.shelf_id=bs.parent_shelf_id),'') parent_shelf,b.book_name_in_english, " +
                "coalesce(b.digital_file_name,'') digital_file_name, coalesce(b.isbn,'') isbn,coalesce(b.price,0) price,coalesce(b.publishing_year,'') publishing_year, coalesce(to_char(b.purchase_date, 'YYYY-MM-DD'), '') as purchase_date from books b, " +
                "book_shelfs bs where b.shelf_id = bs.shelf_id order by b.book_name_in_english");
//        q.setParameter("parent_id", id);
        List<Object[]> result = q.getResultList();
        return result;
    }

    public List<Object[]> getBookDetailsWithShelfAndAuthorByAuthor(String author) {
        Query q = (Query) entityManager.createNativeQuery("select b.book_id , b.book_name,b.image, b.author,coalesce(b.publication,'') as publication, " +
                "coalesce (b.format,'') format, coalesce (b.description,'') description,coalesce (b.language,'') as language ,bs.shelf_id , bs.shelf_name, " +
                "coalesce(bs.shelf_image,'') shelf_image, coalesce ((select case when shelf_name is NULL then '' else shelf_name  end as parent_shelf  " +
                "from book_shelfs bs1 where bs1.shelf_id=bs.parent_shelf_id),'') parent_shelf,b.book_name_in_english, " +
                "coalesce(b.digital_file_name,'') digital_file_name, coalesce(b.isbn,'') isbn,coalesce(b.price,0) price,coalesce(b.publishing_year,'') publishing_year, coalesce(to_char(b.purchase_date, 'YYYY-MM-DD'), '') as purchase_date from books b, " +
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

    public List<Object[]> getBorrowList() {
        Query q = (Query) entityManager.createNativeQuery("select b.borrow_id,b.borrow_by,b.borrow_date,b2.book_name,b2.book_name_in_english,bs.shelf_name," +
                "coalesce((select bs2.shelf_name from book_shelfs bs2 where bs2.shelf_id =bs.parent_shelf_id),'') parent_shelf, b.book_id,b2.image  " +
                "from borrow b, books b2, book_shelfs bs  where b.book_id = b2.book_id and b2.shelf_id = bs.shelf_id  and b.is_return =false");
        List<Object[]> result = q.getResultList();
        return result;
    }

    public List<Object[]> getReadingLogList() {
        Query q = (Query) entityManager.createNativeQuery(
                "select r.reading_id, r.book_id, coalesce(to_char(r.reading_date, 'YYYY-MM-DD'), '') as reading_date, " +
                "coalesce(r.status, 'Reading') as status, coalesce(r.notes, '') as notes, " +
                "b.book_name, coalesce(b.book_name_in_english, '') as book_name_in_english, " +
                "coalesce(b.author, '') as author, coalesce(b.publication, '') as publication, " +
                "coalesce(b.image, '') as image, coalesce(bs.shelf_name, '') as shelf_name, " +
                "coalesce((select bs2.shelf_name from book_shelfs bs2 where bs2.shelf_id = bs.parent_shelf_id), '') as parent_shelf " +
                "from reading_log r " +
                "join books b on r.book_id = b.book_id " +
                "left join book_shelfs bs on b.shelf_id = bs.shelf_id " +
                "order by r.reading_date desc, r.reading_id desc");
        return q.getResultList();
    }
}
