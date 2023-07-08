package com.souvik.library.repositiries;

import com.souvik.library.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByShelfIdOrderByBookName(int shelfId);

    @Query("select b from Book b where lower(b.bookName) like (lower(:bookName)) and b.shelfId in (select bs.shelfId  from BookShelfs bs where bs.parentShelfId=:shelfId) order by b.bookName")
    List<Book> getBookByParentShelfAndFilter(@Param("shelfId") int shelfId, @Param("bookName") String bookName);

    @Query("select b from Book b where lower(b.bookName) like (lower(:bookName)) and b.shelfId =:shelfId order by b.bookName")
    List<Book> getBookByShelfAndFilter(@Param("shelfId") int shelfId, @Param("bookName") String bookName);
}
