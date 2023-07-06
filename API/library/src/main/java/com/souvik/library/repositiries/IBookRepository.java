package com.souvik.library.repositiries;

import com.souvik.library.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookRepository extends JpaRepository<Book, Integer> {
}
