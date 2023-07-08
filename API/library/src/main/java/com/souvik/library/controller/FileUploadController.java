package com.souvik.library.controller;

import com.souvik.library.models.book.BookModel;
import com.souvik.library.repositiries.IConfigurationsRepository;
import com.souvik.library.utility.UtilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api")
@RequiredArgsConstructor
public class FileUploadController {

    private final IConfigurationsRepository configurationsRepository;
    private final UtilityService utilityService;
    @RequestMapping(value="/uploadImage", method= RequestMethod.POST)
    public String uploadImage(@RequestParam("image") MultipartFile multipartFile){

        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        fileName= "tmp"+fileName;
        String uploadDir = configurationsRepository.findByConfigName("tempFilePath").getConfigValue();

        try {
            utilityService.uploadTempImage(uploadDir, multipartFile, fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileName;
    }

    @RequestMapping(value = "test", method = RequestMethod.GET)
    public String test(){
        return "Hello";
    }
}
