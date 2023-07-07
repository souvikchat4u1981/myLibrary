package com.souvik.library.repositiries;

import com.souvik.library.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IBookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByShelfIdOrderByBookName(int shelfId);
}
