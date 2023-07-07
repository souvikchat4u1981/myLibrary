package com.souvik.library.entities;


import javax.persistence.*;
import javax.validation.constraints.Null;

import io.leangen.graphql.annotations.GraphQLInputField;
import lombok.Data;


@Entity
@Data
@Table(name = "book_shelfs")

public class BookShelfs {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "shelf_id")
    private Integer shelfId;

    @Column(name = "shelf_name")
    private String shelfName;

    @Column(name = "parent_shelf_id")
    private Integer parentShelfId;

    @Column(name = "user_id")
    private Integer userId;
    @Column(name="shelf_image")
    private String shelfImage;
}
