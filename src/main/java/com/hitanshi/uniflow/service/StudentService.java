package com.hitanshi.uniflow.service;

import com.hitanshi.uniflow.dto.StudentResponseDTO;
import com.hitanshi.uniflow.entity.Student;
import com.hitanshi.uniflow.exception.ResourceNotFoundException;
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

    public List<StudentResponseDTO> getStudents(){

            return studentRepository.findAll()
                    .stream()
                    .map(this::convertToDTO)
                    .toList();
    }

    public Student getStudentById(Long id){
        return studentRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Student with id " + id + " not found"
                )
        );
    }

    public void deleteStudent(Long id){

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student with id "
                                        + id
                                        + " not found"
                        )
                );

        studentRepository.delete(student);
    }

    public Student updateStudent(Long id, Student updatedStudent){

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student with id "
                                        + id
                                        + " not found"
                        )
                );


        existingStudent.setFirstName(
                updatedStudent.getFirstName()
        );

        existingStudent.setLastName(
                updatedStudent.getLastName()
        );

        existingStudent.setEmail(
                updatedStudent.getEmail()
        );

        existingStudent.setDepartment(
                updatedStudent.getDepartment()
        );

        existingStudent.setSemester(
                updatedStudent.getSemester()
        );


        return studentRepository.save(existingStudent);
    }

    private StudentResponseDTO convertToDTO(Student student){

        return new StudentResponseDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getDepartment(),
                student.getSemester()
        );
    }
}
