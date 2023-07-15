package com.souvik.library.repositiries;

import com.souvik.library.entities.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBorrowRepository extends JpaRepository<Borrow, Integer> {
    Borrow findByBookId(Integer bookId);

    List<Borrow> findByBorrowBy(String borrowBy);
}
