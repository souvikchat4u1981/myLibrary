package com.souvik.library.repositiries;

import com.souvik.library.entities.BookShelfs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IBookShelfs extends JpaRepository<BookShelfs, Integer> {
    List<BookShelfs> findByParentShelfId(int parentShelfId);
    @Query("select bs from BookShelfs bs where parentShelfId is null OR parentShelfId=0")
    List<BookShelfs> findAllParentBookShelfs();
}
