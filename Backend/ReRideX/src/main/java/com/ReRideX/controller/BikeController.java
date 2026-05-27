package com.ReRideX.controller;

import com.ReRideX.model.Bike;
import com.ReRideX.repository.BikeRepository;
import com.ReRideX.service.CloudinaryService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "*")
public class BikeController {

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // 🔥 OPTIMIZATION: Cache the paginated results in RAM!
    // The key ensures that "Page 1 of all" is cached separately from "Page 1 of scooters"
    @Cacheable(value = "bikes", key = "#page + '-' + #size + '-' + #category")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false, defaultValue = "all") String category) {
            
        try {
            Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
            Page<Bike> pageBikes;

            if (category.equalsIgnoreCase("all")) {
                pageBikes = bikeRepository.findAll(paging);
            } else {
                pageBikes = bikeRepository.findByCategoryIgnoreCase(category, paging);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("bikes", pageBikes.getContent());
            response.put("currentPage", pageBikes.getNumber());
            response.put("totalItems", pageBikes.getTotalElements());
            response.put("totalPages", pageBikes.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // 🔥 OPTIMIZATION: Cache individual bike details! 
    // Super useful when people keep refreshing a specific bike's detail page.
    @Cacheable(value = "bikeDetails", key = "#id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getBikeById(@PathVariable Long id) {
        return bikeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔥 CACHE EVICT: Wipes the memory when a new bike is added so the website updates instantly.
    @CacheEvict(value = {"bikes", "bikeDetails"}, allEntries = true)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addBike(
            @RequestPart("bikeData") Bike bike,
            @RequestPart("images") MultipartFile[] files) {
        try {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                imageUrls.add(cloudinaryService.uploadImage(file));
            }
            bike.setImageUrls(imageUrls);
            
            if (bike.getStatus() == null || bike.getStatus().isEmpty()) {
                bike.setStatus("AVAILABLE");
            }
            return ResponseEntity.ok(bikeRepository.save(bike));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload images or save bike details.");
        }
    }

    // 🔥 CACHE EVICT: Wipes memory when a bike is deleted.
    @CacheEvict(value = {"bikes", "bikeDetails"}, allEntries = true)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(@PathVariable Long id) {
        Optional<Bike> optionalBike = bikeRepository.findById(id);
        if (optionalBike.isPresent()) {
            Bike bike = optionalBike.get();
            List<String> images = bike.getImageUrls();
            if (images != null) {
                for (String imageUrl : images) {
                    cloudinaryService.deleteImage(imageUrl);
                }
            }
            bikeRepository.delete(bike);
            return ResponseEntity.ok().body("{\"message\": \"Bike deleted successfully\"}");
        }
        return ResponseEntity.notFound().build();
    }

    // 🔥 CACHE EVICT: Wipes memory when all bikes are nuked.
    @CacheEvict(value = {"bikes", "bikeDetails"}, allEntries = true)
    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllBikes() {
        try {
            List<Bike> allBikes = bikeRepository.findAll();
            
            for (Bike bike : allBikes) {
                List<String> images = bike.getImageUrls();
                if (images != null) {
                    for (String imageUrl : images) {
                        cloudinaryService.deleteImage(imageUrl);
                    }
                }
            }
            
            bikeRepository.deleteAll();
            return ResponseEntity.ok().body("{\"message\": \"All bikes and cloud images wiped successfully!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to wipe inventory.\"}");
        }
    }

    // 🔥 CACHE EVICT: Wipes memory when a bike is edited (price changes, reserved status, etc.)
    @CacheEvict(value = {"bikes", "bikeDetails"}, allEntries = true)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBike(
            @PathVariable Long id,
            @RequestPart("bikeData") Bike updatedData,
            @RequestPart(value = "images", required = false) MultipartFile[] newFiles) {
            
        return bikeRepository.findById(id).map(existingBike -> {
            existingBike.setTitle(updatedData.getTitle());
            existingBike.setCategory(updatedData.getCategory());
            existingBike.setBrand(updatedData.getBrand());
            existingBike.setLocation(updatedData.getLocation());
            existingBike.setTag(updatedData.getTag());
            
            existingBike.setPrice(updatedData.getPrice());
            existingBike.setOriginalPrice(updatedData.getOriginalPrice());
            existingBike.setEmi(updatedData.getEmi());
            
            existingBike.setKms(updatedData.getKms());
            existingBike.setMakeYear(updatedData.getMakeYear());
            existingBike.setOwners(updatedData.getOwners());
            existingBike.setRegYear(updatedData.getRegYear());
            existingBike.setVehicleNo(updatedData.getVehicleNo()); 
            
            existingBike.setStatus(updatedData.getStatus());

            if (newFiles != null && newFiles.length > 0) {
                List<String> oldImages = existingBike.getImageUrls();
                if (oldImages != null) {
                    for (String oldUrl : oldImages) {
                        cloudinaryService.deleteImage(oldUrl);
                    }
                }
                List<String> newImageUrls = new ArrayList<>();
                try {
                    for (MultipartFile file : newFiles) {
                        newImageUrls.add(cloudinaryService.uploadImage(file));
                    }
                    existingBike.setImageUrls(newImageUrls);
                } catch (Exception e) {
                    return ResponseEntity.internalServerError().body("Failed to upload new images.");
                }
            } else {
                if (updatedData.getImageUrls() != null && !updatedData.getImageUrls().isEmpty()) {
                    existingBike.setImageUrls(updatedData.getImageUrls());
                }
            }
            
            return ResponseEntity.ok(bikeRepository.save(existingBike));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. DOWNLOAD DATA ZIP (Doesn't need caching since it's an admin export)
    @GetMapping("/{id}/export")
    public void downloadBikeZip(@PathVariable Long id, HttpServletResponse response) {
        Optional<Bike> optionalBike = bikeRepository.findById(id);
        if (optionalBike.isPresent()) {
            Bike bike = optionalBike.get();
            response.setContentType("application/zip");
            response.setHeader("Content-Disposition", "attachment; filename=\"ReRideX_Bike_" + bike.getId() + ".zip\"");
            
            try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream())) {
                ZipEntry detailsEntry = new ZipEntry("Bike_Information.txt");
                zos.putNextEntry(detailsEntry);
                
                String details = String.format(
                        "Title: %s\nBrand: %s\nCategory: %s\nLocation: %s\nStatus: %s\nTag: %s\n\nPrice: Rs. %s\nOriginal Price: Rs. %s\nEMI: Rs. %s\n\nKMs: %s\nMake Year: %s\nReg Year: %s\nOwners: %s\n",
                        bike.getTitle(), bike.getBrand(), bike.getCategory(), bike.getLocation(), bike.getStatus(), bike.getTag() != null ? bike.getTag() : "None",
                        bike.getPrice(), bike.getOriginalPrice(), bike.getEmi(), 
                        bike.getKms(), bike.getMakeYear(), bike.getRegYear(), bike.getOwners()
                );
                        
                zos.write(details.getBytes());
                zos.closeEntry();
                
                List<String> images = bike.getImageUrls();
                if (images != null) {
                    int imgCount = 1;
                    for (String imgUrl : images) {
                        ZipEntry imgEntry = new ZipEntry("Image_" + imgCount + ".jpg");
                        zos.putNextEntry(imgEntry);
                        try (InputStream is = new URL(imgUrl).openStream()) {
                            is.transferTo(zos);
                        }
                        zos.closeEntry();
                        imgCount++;
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to generate ZIP: " + e.getMessage());
            }
        }
    }
}