package spring.back.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.back.project.model.University;
import spring.back.project.service.UniversityService;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
// @CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "*")

public class UniversityController {
    
    @Autowired
    private UniversityService universityService;
    
    // Get all universities
    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return ResponseEntity.ok(universities);
    }
    
    // Get university by ID
    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        return universityService.getUniversityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create university
    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        University createdUniversity = universityService.createUniversity(university);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUniversity);
    }
    
    // Update university
    @PutMapping("/{id}")
    public ResponseEntity<University> updateUniversity(@PathVariable Long id, @RequestBody University university) {
        try {
            University updatedUniversity = universityService.updateUniversity(id, university);
            return ResponseEntity.ok(updatedUniversity);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete university
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        try {
            universityService.deleteUniversity(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Search universities
    @GetMapping("/search")
    public ResponseEntity<List<University>> searchUniversities(@RequestParam String name) {
        List<University> universities = universityService.searchByName(name);
        return ResponseEntity.ok(universities);
    }
}
