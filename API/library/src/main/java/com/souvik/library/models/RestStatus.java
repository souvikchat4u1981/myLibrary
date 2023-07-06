package com.souvik.library.models;

import io.leangen.graphql.annotations.GraphQLInputField;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Data
public class RestStatus {
    private String message;
    @GraphQLInputField(defaultValue = "false")
    private boolean failure;
    @GraphQLInputField(defaultValue = "0")
    private int userId;
}
