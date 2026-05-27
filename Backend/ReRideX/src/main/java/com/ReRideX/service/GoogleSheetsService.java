package com.ReRideX.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ClearValuesRequest;
import com.google.api.services.sheets.v4.model.ValueRange;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleSheetsService {

    private static final String APPLICATION_NAME = "ReRideX Backend";
    private static final String SPREADSHEET_ID = "1zhP0St2r7UPa3NVnXqAm_45fy91OUEA2zc-TazKdwNk";

    // ⚡ FIX: Build the Sheets client ONCE at startup instead of on every request.
    // Previously every lead form submission rebuilt the HTTP transport + OAuth flow = 1-2 sec delay each time.
    private Sheets sheetsService;

    @PostConstruct
    public void init() {
        try {
            InputStream in = GoogleSheetsService.class.getResourceAsStream("/credentials.json");
            if (in == null) {
                System.err.println("WARNING: credentials.json not found — Google Sheets integration disabled.");
                return;
            }
            Credential credential = GoogleCredential.fromStream(in)
                    .createScoped(Collections.singletonList(SheetsScopes.SPREADSHEETS));

            this.sheetsService = new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    credential)
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            System.out.println("Google Sheets client initialized successfully.");
        } catch (Exception e) {
            System.err.println("Failed to initialize Google Sheets client: " + e.getMessage());
        }
    }

    // ⚡ FIX: @Async means this runs in a background thread.
    // Lead form POST returns 200 to the user IMMEDIATELY.
    // Google Sheets is updated in the background — no more waiting for Google API.
    @Async
    public void appendRow(String tabName, List<Object> rowData) {
        if (sheetsService == null) {
            System.err.println("Sheets client not available — skipping append for tab: " + tabName);
            return;
        }
        try {
            ValueRange body = new ValueRange()
                    .setValues(Collections.singletonList(rowData));

            sheetsService.spreadsheets().values()
                    .append(SPREADSHEET_ID, tabName + "!A1", body)
                    .setValueInputOption("USER_ENTERED")
                    .execute();

            System.out.println("Sheets updated: " + tabName);
        } catch (Exception e) {
            System.err.println("Failed to write to Google Sheets (" + tabName + "): " + e.getMessage());
        }
    }

    // 🔥 NEW: Clear all data in a sheet EXCEPT the header row (A1:Z1)
    @Async
    public void clearSheet(String tabName) {
        if (sheetsService == null) {
            System.err.println("Sheets client not available — skipping clear for tab: " + tabName);
            return;
        }
        try {
            // Target from row 2 down to the bottom (A2:Z)
            String range = tabName + "!A2:Z";
            
            ClearValuesRequest requestBody = new ClearValuesRequest();

            sheetsService.spreadsheets().values()
                    .clear(SPREADSHEET_ID, range, requestBody)
                    .execute();

            System.out.println("Sheets cleared (kept headers): " + tabName);
        } catch (Exception e) {
            System.err.println("Failed to clear Google Sheet (" + tabName + "): " + e.getMessage());
        }
    }
}