package com.souvik.library.service;

import com.souvik.library.entities.ReadingLog;
import com.souvik.library.models.RestStatus;
import com.souvik.library.models.reading.ReadingLogItemModel;
import com.souvik.library.models.reading.ReadingLogListModel;
import com.souvik.library.repositiries.CustomRepository;
import com.souvik.library.repositiries.IReadingLogRepository;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@GraphQLApi
public class ReadingLogService {

    private final IReadingLogRepository readingLogRepository;
    private final CustomRepository customRepository;

    @GraphQLMutation(name = "saveReadingLog")
    public RestStatus saveReadingLog(
            @GraphQLArgument(name = "readingId") Integer readingId,
            @GraphQLArgument(name = "bookId") Integer bookId,
            @GraphQLArgument(name = "readingDate") String readingDate,
            @GraphQLArgument(name = "status") String statusVal,
            @GraphQLArgument(name = "notes") String notes) {
        RestStatus status = new RestStatus();
        try {
            ReadingLog log = new ReadingLog();
            if (readingId != null && readingId > 0) {
                log = readingLogRepository.findById(readingId).orElse(new ReadingLog());
            }
            log.setBookId(bookId);
            if (readingDate != null && !readingDate.trim().isEmpty()) {
                String d = readingDate.trim();
                if (d.length() == 10) {
                    d = d + " 00:00:00";
                } else {
                    d = d.replace("T", " ");
                    if (d.length() > 19) d = d.substring(0, 19);
                }
                log.setReadingDate(Timestamp.valueOf(d));
            } else {
                log.setReadingDate(new Timestamp(System.currentTimeMillis()));
            }
            log.setStatus(statusVal != null && !statusVal.trim().isEmpty() ? statusVal.trim() : "Reading");
            log.setNotes(notes != null ? notes : "");
            readingLogRepository.save(log);
            status.setFailure(false);
            status.setMessage("SUCCESS");
        } catch (Exception ex) {
            status.setFailure(true);
            status.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return status;
    }

    @GraphQLMutation(name = "deleteReadingLog")
    public RestStatus deleteReadingLog(@GraphQLArgument(name = "readingId") Integer readingId) {
        RestStatus status = new RestStatus();
        try {
            readingLogRepository.deleteById(readingId);
            status.setFailure(false);
            status.setMessage("SUCCESS");
        } catch (Exception ex) {
            status.setFailure(true);
            status.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return status;
    }

    @GraphQLQuery(name = "getReadingLogs")
    public ReadingLogListModel getReadingLogs() {
        ReadingLogListModel model = new ReadingLogListModel();
        try {
            List<Object[]> rows = customRepository.getReadingLogList();
            List<ReadingLogItemModel> list = new ArrayList<>();
            for (Object[] row : rows) {
                ReadingLogItemModel item = new ReadingLogItemModel();
                item.setReadingId(Integer.valueOf(row[0].toString()));
                item.setBookId(Integer.valueOf(row[1].toString()));
                item.setReadingDate(row[2] != null ? String.valueOf(row[2]) : "");
                item.setStatus(row[3] != null ? String.valueOf(row[3]) : "Reading");
                item.setNotes(row[4] != null ? String.valueOf(row[4]) : "");
                item.setBookName(row[5] != null ? String.valueOf(row[5]) : "");
                item.setBookNameInEnglish(row[6] != null ? String.valueOf(row[6]) : "");
                item.setAuthor(row[7] != null ? String.valueOf(row[7]) : "");
                item.setPublication(row[8] != null ? String.valueOf(row[8]) : "");
                item.setBookImage(row[9] != null ? String.valueOf(row[9]) : "");
                item.setShelfName(row[10] != null ? String.valueOf(row[10]) : "");
                item.setParentShelfName(row[11] != null ? String.valueOf(row[11]) : "");
                list.add(item);
            }
            model.setReadingList(list);
            model.setFailure(false);
            model.setMessage("SUCCESS");
        } catch (Exception ex) {
            model.setFailure(true);
            model.setMessage(ex.getMessage());
            ex.printStackTrace();
        }
        return model;
    }
}
