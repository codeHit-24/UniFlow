package com.hitanshi.uniflow.controller;

import com.hitanshi.uniflow.entity.Student;
import com.hitanshi.uniflow.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Students")
public class StudentController {

    @Autowired
    StudentService studentService;

    @PostMapping
    public Student addStudent(@RequestBody Student student){
        return studentService.saveStudent(student);
    }

    @GetMapping
    public List<Student> getStudents(){
        return studentService.getStudents();
    }
}
