package com.hitanshi.uniflow.service;

import com.hitanshi.uniflow.entity.Student;
import com.hitanshi.uniflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student){
        return studentRepository.save(student);
    }

    public List<Student> getStudents(){
        return studentRepository.findAll();
    }
}
