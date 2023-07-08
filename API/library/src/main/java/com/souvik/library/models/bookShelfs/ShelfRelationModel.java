package com.souvik.library.models.bookShelfs;

import lombok.Data;

@Data
public class ShelfRelationModel {
    private int shelfId;
    private String shelfName;
    private String parentShelfName;

}
