package com.ReRideX.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    // 🔥 OPTIMIZED: Uploads image into a specific folder and applies auto-compression!
    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "reridex_inventory", // Keeps your Cloudinary dashboard clean
                "fetch_format", "auto",        // Automatically converts to WebP/AVIF for faster loading
                "quality", "auto"              // Compresses the image without losing visible quality (saves quota!)
        ));
        return uploadResult.get("secure_url").toString();
    }

    // 🔥 OPTIMIZED: Made asynchronous! 
    // Deleting a bike with 8 images no longer freezes the Admin dashboard for 10 seconds.
    @Async
    public void deleteImage(String imageUrl) {
        try {
            // Extracts the file name (public_id) from the URL to delete it
            // Need to include the folder name in the publicId for Cloudinary to find it!
            String publicId = "reridex_inventory/" + imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
            
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("Deleted from Cloudinary in background: " + publicId);
        } catch (Exception e) {
            System.err.println("Failed to delete image from Cloudinary: " + imageUrl);
        }
    }
}