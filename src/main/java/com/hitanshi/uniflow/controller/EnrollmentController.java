package com.hitanshi.uniflow.controller;

import com.hitanshi.uniflow.dto.EnrollmentRequest;
import com.hitanshi.uniflow.entity.Enrollment;
import com.hitanshi.uniflow.service.EnrollmentService;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public Enrollment addEnrollment(@RequestBody EnrollmentRequest enrollment){
        return enrollmentService.saveEnrollment(enrollment);
    }

    @GetMapping
    public List<Enrollment> getEnrollments(){
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/me")
    public List<Enrollment> getMyEnrollments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return enrollmentService.getEnrollmentsByUsername(
                userDetails.getUsername()
        );

    }

    @GetMapping("/my-students")
    public List<Enrollment> getMyStudents(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return enrollmentService.getEnrollmentsByFacultyUsername(
                userDetails.getUsername()
        );

    }

    @GetMapping("/{id}")
    public Enrollment getEnrollmentById(@PathVariable Long id){
        return enrollmentService.getEnrollmentById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id){
        enrollmentService.deleteEnrollment(id);
    }
}
