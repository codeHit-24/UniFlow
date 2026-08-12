package com.hitanshi.uniflow.controller;

import com.hitanshi.uniflow.dto.CourseResponseDTO;
import com.hitanshi.uniflow.entity.Course;
import com.hitanshi.uniflow.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Courses")
public class CourseController {

    @Autowired
    private CourseService courseService;


    // =========================
    // ADMIN - ALL COURSES
    // =========================

    @PostMapping
    public Course addCourse(@RequestBody Course course) {

        return courseService.saveCourse(course);
    }


    @GetMapping
    public List<CourseResponseDTO> getCourses() {

        return courseService.getCourses();
    }

    @GetMapping("/me")
    public List<CourseResponseDTO> getMyCourses(
            Authentication authentication
    ) {

        String username = authentication.getName();

        return courseService.getCoursesForFaculty(username);
    }


    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id) {

        return courseService.getCourseById(id);
    }


    @DeleteMapping("/{id}")
    public boolean deleteById(@PathVariable Long id) {

        return courseService.deleteCourseById(id);
    }


    @PutMapping("/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody Course course
    ) {

        return courseService.updateCourse(id, course);
    }


}