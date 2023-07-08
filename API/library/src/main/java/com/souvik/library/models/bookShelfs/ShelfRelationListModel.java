package com.souvik.library.models.bookShelfs;

import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class ShelfRelationListModel extends RestStatus {
    public List<ShelfRelationModel> shelfRelationModelList;
}
