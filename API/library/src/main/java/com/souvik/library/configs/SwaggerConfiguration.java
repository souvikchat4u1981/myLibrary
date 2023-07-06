package com.souvik.library.configs;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SwaggerConfiguration {
    @Bean
    public OpenAPI customizeOpenAPI() {
        List<Server> servers = new ArrayList<Server>();
        servers.add(new Server()
                .url("/")
                .description("Editor Embedded Server URL"));
        servers.add(new Server()
                .url("/library")
                .description("Deployed Server URL"));
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info().title("My Library")
                        .description("Library API")
                        .version("1.0"))
                .servers(servers)
                ;
    }

}
