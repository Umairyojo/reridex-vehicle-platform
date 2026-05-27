package com.ReRideX.controller;

import com.ReRideX.model.Bike;	
import com.ReRideX.repository.BikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bikes")
@CrossOrigin(origins = "http://localhost:5173") // Connects to your React app
public class AdminBikeController {

    @Autowired
    private BikeRepository bikeRepository;

    // 🔥 API for Admin to add a new bike with multiple images
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Bike> addBike(
            @RequestPart("bikeDetails") Bike bike, 
            @RequestPart("images") List<MultipartFile> images) {

        try {
            // Step 1: We will loop through the uploaded images
            List<String> uploadedImageUrls = new ArrayList<>();
            
            for (MultipartFile image : images) {
                // TODO: Upload 'image' to AWS S3 / Cloudinary here.
                // For now, we simulate getting a public URL back:
                String mockUrl = "https://your-cloud-storage.com/" + image.getOriginalFilename();
                uploadedImageUrls.add(mockUrl);
            }

            // Step 2: Attach the generated URLs to the bike object
            bike.setImageUrls(uploadedImageUrls);

            // Step 3: Save the bike and all its image URLs to MySQL
            Bike savedBike = bikeRepository.save(bike);

            return new ResponseEntity<>(savedBike, HttpStatus.CREATED);

        }
        catch (Exception e) {
            // Log the actual error to your console so you can debug if something goes wrong!
            e.printStackTrace(); 
            
            // Return the error status cleanly
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}