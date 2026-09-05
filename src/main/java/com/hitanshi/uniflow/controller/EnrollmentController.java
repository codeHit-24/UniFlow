package com.hitanshi.uniflow.controller;

import com.hitanshi.uniflow.dto.EnrollmentRequest;
import com.hitanshi.uniflow.entity.Enrollment;
import com.hitanshi.uniflow.service.EnrollmentService;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import com.hitanshi.uniflow.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CourseService courseService;

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

    @GetMapping("/course/{courseId}")
    public List<Enrollment> getStudentsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        boolean ownsCourse =
                courseService.facultyOwnsCourse(
                        courseId,
                        userDetails.getUsername()
                );

        if (!ownsCourse) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not assigned to this course"
            );
        }

        return enrollmentService
                .getEnrollmentsByCourseId(courseId);
    }

    @GetMapping("/faculty/student-count")
    public long getStudentCountByFaculty(
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return enrollmentService.getStudentCountByFaculty(
                userDetails.getUsername()
        );
    }
}
