package com.souvik.library.entities;

import io.leangen.graphql.annotations.GraphQLInputField;
import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name="borrow")
public class Borrow {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "borrow_id")
    private Integer borrowId;

    @Column(name = "borrow_by")
    private String borrowBy;

    @Column(name = "book_id")
    private Integer bookId;

    @Column(name = "borrow_date")
    private Timestamp borrowDate;

    @Column(name = "return_date")
    private Timestamp returnDate;

    @Column(name = "is_return")
    @GraphQLInputField(defaultValue = "false")
    private Boolean isReturn;

    private String comment;

}
