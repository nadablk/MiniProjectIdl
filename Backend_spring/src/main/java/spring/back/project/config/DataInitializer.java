package spring.back.project.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import spring.back.project.model.Student;
import spring.back.project.model.University;
import spring.back.project.repository.StudentRepository;
import spring.back.project.repository.UniversityRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UniversityRepository universityRepository, StudentRepository studentRepository) {
        return args -> {
            // Check if data already exists
            if (universityRepository.count() > 0) {
                return; // Data already initialized
            }

            // Create Universities
            University sorbonne = new University("Sorbonne University", "Paris, France");
            University oxford = new University("Oxford University", "Oxford, UK");
            University harvard = new University("Harvard University", "Cambridge, USA");
            University cambridge = new University("Cambridge University", "Cambridge, UK");
            
            universityRepository.save(sorbonne);
            universityRepository.save(oxford);
            universityRepository.save(harvard);
            universityRepository.save(cambridge);

            // Create Students
            Student student1 = new Student("John", "Smith", "john.smith@philosophe.edu", sorbonne);
            Student student2 = new Student("Jane", "Doe", "jane.doe@philosophe.edu", oxford);
            Student student3 = new Student("Michael", "Brown", "michael.brown@philosophe.edu", harvard);
            Student student4 = new Student("Emma", "Wilson", "emma.wilson@philosophe.edu", cambridge);
            Student student5 = new Student("David", "Miller", "david.miller@philosophe.edu", sorbonne);
            Student student6 = new Student("Sarah", "Davis", "sarah.davis@philosophe.edu", oxford);
            Student student7 = new Student("James", "Garcia", "james.garcia@philosophe.edu", harvard);
            Student student8 = new Student("Emily", "Martinez", "emily.martinez@philosophe.edu", cambridge);

            studentRepository.save(student1);
            studentRepository.save(student2);
            studentRepository.save(student3);
            studentRepository.save(student4);
            studentRepository.save(student5);
            studentRepository.save(student6);
            studentRepository.save(student7);
            studentRepository.save(student8);

            System.out.println("✅ Database initialized with sample data:");
            System.out.println("   - " + universityRepository.count() + " universities");
            System.out.println("   - " + studentRepository.count() + " students");
        };
    }
}
