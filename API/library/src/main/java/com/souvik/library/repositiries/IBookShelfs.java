package com.souvik.library.repositiries;

import com.souvik.library.entities.BookShelfs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBookShelfs extends JpaRepository<BookShelfs, Integer> {
    List<BookShelfs> findByParentShelfId(int parentShelfId);
    @Query("select bs from BookShelfs bs where parentShelfId is null OR parentShelfId=0")
    List<BookShelfs> findAllParentBookShelfs();

    @Query("select bs from BookShelfs bs  where bs.shelfId  in (select bs2.parentShelfId  from BookShelfs bs2 where bs2.shelfId in (select b.shelfId  from Book b where lower(b.bookName) like(lower(:bookName)) or lower(b.author) like(lower(:author)))) or bs.shelfId in (select bs3.parentShelfId  from BookShelfs bs3 where lower(bs3.shelfName) like (lower(:author))) or bs.shelfId in (select b2.shelfId  from Book b2 where lower(b2.bookName) like(lower(:bookName)) or lower(b2.author) like(lower(:author))) and bs.parentShelfId =0")
    List<BookShelfs> getAllByFilerParam(@Param("author") String author, @Param("bookName") String bookName);

    @Query("select bs from BookShelfs bs where bs.parentShelfId =:parentShelfId and (lower(bs.shelfName) like (lower(:author)) or bs.shelfId in (select b.shelfId  from Book b where lower(b.bookName) like(lower(:bookName)) or lower(b.author) like(lower(:author)))) ")
    List<BookShelfs> getChildBookShelfsByFilterparam(@Param("author") String author, @Param("bookName") String bookName,@Param("parentShelfId") int parentShelfId);
}
