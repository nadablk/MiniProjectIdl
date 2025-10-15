package spring.back.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spring.back.project.model.University;
import spring.back.project.repository.UniversityRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UniversityService {
    
    @Autowired
    private UniversityRepository universityRepository;
    
    // Get all universities
    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }
    
    // Get university by ID
    public Optional<University> getUniversityById(Long id) {
        return universityRepository.findById(id);
    }
    
    // Create university
    public University createUniversity(University university) {
        return universityRepository.save(university);
    }
    
    // Update university
    public University updateUniversity(Long id, University universityDetails) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
        
        university.setName(universityDetails.getName());
        university.setLocation(universityDetails.getLocation());
        
        return universityRepository.save(university);
    }
    
    // Delete university
    public void deleteUniversity(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
        universityRepository.delete(university);
    }
    
    // Search universities by name
    public List<University> searchByName(String name) {
        return universityRepository.findByNameContainingIgnoreCase(name);
    }
}
