package com.ReRideX.controller;

import com.ReRideX.model.BuyerLead;
import com.ReRideX.model.SellRequest;
import com.ReRideX.model.TestDriveLead;
import com.ReRideX.model.ValuationLead;
import com.ReRideX.repository.BuyerLeadRepository;
import com.ReRideX.repository.SellRequestRepository;
import com.ReRideX.repository.TestDriveLeadRepository;
import com.ReRideX.repository.ValuationLeadRepository;
import com.ReRideX.repository.BikeRepository; 
import com.ReRideX.service.GoogleSheetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") 
public class LeadController {

    @Autowired
    private SellRequestRepository sellRequestRepository;
    @Autowired
    private ValuationLeadRepository valuationLeadRepository;
    @Autowired
    private BuyerLeadRepository buyerLeadRepository;
    @Autowired
    private TestDriveLeadRepository testDriveLeadRepository;
    @Autowired
    private BikeRepository bikeRepository;
    @Autowired
    private GoogleSheetsService googleSheetsService;

    // ==========================================
    // 1. SELL REQUESTS
    // ==========================================
    @PostMapping("/sell")
    public ResponseEntity<?> createSellRequest(@RequestBody SellRequest request) {
        // 1. Save to fast MySQL DB instantly
        SellRequest saved = sellRequestRepository.save(request);
        
        // 2. Offload the slow Google Sheets API call to a background thread
        CompletableFuture.runAsync(() -> {
            try {
                List<Object> rowData = Arrays.asList(
                        String.valueOf(saved.getId()), saved.getName(), saved.getMobile(), saved.getBrand(),
                        saved.getModel(), saved.getRegNo(), saved.getOwnership(), saved.getCity(),
                        saved.getKmDriven(), saved.getStatus(), saved.getCreatedAt().toString()
                );
                googleSheetsService.appendRow("SellRequests", rowData);
            } catch (Exception e) {
                System.err.println("Google Sheets Sync Failed for Sell Request: " + e.getMessage());
            }
        });
        
        // 3. Return response instantly!
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/sell")
    public ResponseEntity<List<SellRequest>> getAllSellRequests() {
        return ResponseEntity.ok(sellRequestRepository.findAll());
    }

    @DeleteMapping("/sell/all")
    public ResponseEntity<?> deleteAllSellRequests() {
        try {
            sellRequestRepository.deleteAll();
            CompletableFuture.runAsync(() -> googleSheetsService.clearSheet("SellRequests"));
            return ResponseEntity.ok().body("{\"message\": \"All Sell Requests wiped successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to clear Sell Requests.\"}");
        }
    }

    // ==========================================
    // 2. VALUATION LEADS
    // ==========================================
    @PostMapping("/valuation")
    public ResponseEntity<?> createValuationLead(@RequestBody ValuationLead request) {
        ValuationLead saved = valuationLeadRepository.save(request);
        
        CompletableFuture.runAsync(() -> {
            try {
                List<Object> rowData = Arrays.asList(
                        String.valueOf(saved.getId()), saved.getFullName(), saved.getMobileNumber(), saved.getBrand(),
                        saved.getModel(), saved.getVehicleNo(), saved.getNoOfOwners(), saved.getKmDriven(),
                        saved.getRequestedAt().toString()
                );
                googleSheetsService.appendRow("ValuationLeads", rowData);
            } catch (Exception e) {
                System.err.println("Google Sheets Sync Failed for Valuation Lead: " + e.getMessage());
            }
        });
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/valuation")
    public ResponseEntity<List<ValuationLead>> getAllValuationLeads() {
        return ResponseEntity.ok(valuationLeadRepository.findAll());
    }

    @DeleteMapping("/valuation/all")
    public ResponseEntity<?> deleteAllValuationLeads() {
        try {
            valuationLeadRepository.deleteAll();
            CompletableFuture.runAsync(() -> googleSheetsService.clearSheet("ValuationLeads"));
            return ResponseEntity.ok().body("{\"message\": \"All Valuation Leads wiped successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to clear Valuation Leads.\"}");
        }
    }

    // ==========================================
    // 3. BUYER LEADS (VIEW MORE)
    // ==========================================
    @PostMapping("/view-more")
    public ResponseEntity<?> createBuyerLead(@RequestBody BuyerLead request) {
        BuyerLead saved = buyerLeadRepository.save(request);
        
        CompletableFuture.runAsync(() -> {
            try {
                List<Object> rowData = Arrays.asList(
                        String.valueOf(saved.getId()), saved.getBikeId(), saved.getName(), saved.getMobile(),
                        saved.getSegment(), saved.getBudget(), saved.getCreatedAt().toString()
                );
                googleSheetsService.appendRow("BuyerLeads", rowData);
            } catch (Exception e) {
                System.err.println("Google Sheets Sync Failed for Buyer Lead: " + e.getMessage());
            }
        });
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/view-more")
    public ResponseEntity<List<BuyerLead>> getAllBuyerLeads() {
        return ResponseEntity.ok(buyerLeadRepository.findAll());
    }

    @DeleteMapping("/view-more/all")
    public ResponseEntity<?> deleteAllBuyerLeads() {
        try {
            buyerLeadRepository.deleteAll();
            CompletableFuture.runAsync(() -> googleSheetsService.clearSheet("BuyerLeads"));
            return ResponseEntity.ok().body("{\"message\": \"All Buyer Leads wiped successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to clear Buyer Leads.\"}");
        }
    }

    // ==========================================
    // 4. TEST DRIVE LEADS
    // ==========================================
    @PostMapping("/test-drive")
    public ResponseEntity<?> createTestDriveLead(@RequestBody TestDriveLead request) {
        
        String price = "N/A", kms = "N/A", makeYear = "N/A", regYear = "N/A", owners = "N/A", vehicleNo = "N/A";
        String fullBikeName = request.getBikeName(); 
        
        if (request.getBikeId() != null) {
            com.ReRideX.model.Bike bookedBike = bikeRepository.findById(request.getBikeId()).orElse(null);
            
            if (bookedBike != null) {
                price = bookedBike.getPrice() != null ? String.valueOf(bookedBike.getPrice()) : "N/A";
                kms = bookedBike.getKms() != null ? String.valueOf(bookedBike.getKms()) : "N/A";
                makeYear = bookedBike.getMakeYear() != null ? String.valueOf(bookedBike.getMakeYear()) : "N/A";
                regYear = bookedBike.getRegYear() != null ? String.valueOf(bookedBike.getRegYear()) : makeYear;
                owners = bookedBike.getOwners() != null ? String.valueOf(bookedBike.getOwners()) : "N/A";
                vehicleNo = bookedBike.getVehicleNo() != null ? bookedBike.getVehicleNo() : "N/A";
                
                String brand = bookedBike.getBrand() != null ? bookedBike.getBrand() : "";
                String title = bookedBike.getTitle() != null ? bookedBike.getTitle() : "";
                fullBikeName = (brand + " " + title).trim();
                
                request.setBikeName(fullBikeName); 
                request.setVehicleNo(vehicleNo); 
            }
        }

        TestDriveLead saved = testDriveLeadRepository.save(request);
        
        // 🔥 Capture values for the async thread (must be effectively final)
        final String finalFullBikeName = fullBikeName;
        final String finalPrice = price;
        final String finalKms = kms;
        final String finalMakeYear = makeYear;
        final String finalRegYear = regYear;
        final String finalOwners = owners;
        final String finalVehicleNo = vehicleNo;
        final String requestTime = LocalDateTime.now().withNano(0).toString().replace("T", " ");

        // 🔥 Offload the slow Google Sheets write to a background thread
        CompletableFuture.runAsync(() -> {
            try {
                List<Object> rowData = Arrays.asList(
                        String.valueOf(saved.getId()),    
                        saved.getName(),                  
                        saved.getMobile(),                
                        saved.getArea(),                  
                        saved.getCity(),                  
                        saved.getPincode(),               
                        saved.getTimeSlot(),              
                        finalFullBikeName,                     
                        finalPrice,                            
                        finalKms,                              
                        finalMakeYear,                         
                        finalRegYear,                          
                        finalOwners,                           
                        finalVehicleNo,                        
                        requestTime                       
                );
                googleSheetsService.appendRow("TestDrives", rowData);
            } catch (Exception e) {
                System.err.println("Google Sheets Sync Failed for Test Drive: " + e.getMessage());
            }
        });
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/test-drive")
    public ResponseEntity<List<TestDriveLead>> getAllTestDrives() {
        return ResponseEntity.ok(testDriveLeadRepository.findAll());
    }

    @DeleteMapping("/test-drive/all")
    public ResponseEntity<?> deleteAllTestDrives() {
        try {
            testDriveLeadRepository.deleteAll();
            CompletableFuture.runAsync(() -> googleSheetsService.clearSheet("TestDrives"));
            return ResponseEntity.ok().body("{\"message\": \"All Test Drives wiped successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to clear Test Drives.\"}");
        }
    }
}