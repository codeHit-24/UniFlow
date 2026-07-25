package com.hitanshi.uniflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;
    @Column(nullable = false)
    private String courseName;
    @Column(nullable = false, unique = true)
    private String courseCode;
    @Column(nullable = false)
    private int credits;
    @Column(nullable = false)
    private String department;

    @JsonIgnore
    @OneToMany(mappedBy = "course")
    private List<Enrollment> enrollments;
}

