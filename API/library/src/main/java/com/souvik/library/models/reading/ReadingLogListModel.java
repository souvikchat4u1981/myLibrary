package com.souvik.library.models.reading;

import com.souvik.library.models.RestStatus;
import lombok.Data;

import java.util.List;

@Data
public class ReadingLogListModel extends RestStatus {
    private List<ReadingLogItemModel> readingList;
}
