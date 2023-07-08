package com.souvik.library.utility;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UtilityService {
    public boolean DownloadImage(String fileName, String url){
        boolean success=false;
//        fileName = fileName.replace(":","").replace(" ","");
        try(BufferedInputStream in = new BufferedInputStream(new URL(url).openStream());
            FileOutputStream fileOutputStream = new FileOutputStream(fileName)){
            byte dataBuffer[] = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                fileOutputStream.write(dataBuffer, 0, bytesRead);
            }
            success=true;

        }catch(Exception ex){
            success=false;
            ex.printStackTrace();
        }
        return success;
    }

    public boolean deletePhysicalFile(String filepath){
        boolean success=false;
        try{
            File myObj = new File(filepath);
            if (myObj.delete()) {
                System.out.println("Deleted the file: " + myObj.getName());
            } else {
                System.out.println("Failed to delete the file.");
            }
            success=true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return success;
    }

    public String removeSpecialCharacter(String fileName){
        fileName = fileName.replace(" ","").replace("|","").replace(",","").replace(".","");
        fileName = fileName.replace("$","").replace("#","");
        return fileName;

    }

    public void uploadTempImage(String uploadDir, MultipartFile multipartFile, String fileName) throws IOException {

        Path uploadPath = Paths.get(uploadDir);
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {
            throw new IOException("Could not save image file: " + fileName, ioe);
        }

    }
}
