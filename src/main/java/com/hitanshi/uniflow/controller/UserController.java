package com.hitanshi.uniflow.controller;

import com.hitanshi.uniflow.dto.LoginRequest;
import com.hitanshi.uniflow.dto.LoginResponse;
import com.hitanshi.uniflow.entity.User;
import com.hitanshi.uniflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user){

        return userService.registerUser(user);

    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){

        return userService.login(request);

    }

}