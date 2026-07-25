package com.hitanshi.uniflow.controller;


import com.hitanshi.uniflow.entity.Course;
import com.hitanshi.uniflow.repository.CourseRepository;
import com.hitanshi.uniflow.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Courses")
public class CourseController {

    @Autowired
    CourseService courseService;

    @Autowired
    CourseRepository courseRepository;

    @PostMapping
    public Course addCourse(@RequestBody Course course){
        return courseService.saveCourse(course);
    }

    @GetMapping
    public List<Course> getCourses(){
        return courseService.getCourses();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id){
        return courseService.getCourseById(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteById(@PathVariable Long id){
        return courseService.deleteCourseById(id);
    }
}
