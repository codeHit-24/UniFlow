package com.hitanshi.uniflow.service;

import com.hitanshi.uniflow.entity.User;
import com.hitanshi.uniflow.exception.InvalidCredentialsException;
import com.hitanshi.uniflow.repository.UserRepository;
import com.hitanshi.uniflow.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hitanshi.uniflow.dto.LoginRequest;
import com.hitanshi.uniflow.dto.LoginResponse;
import com.hitanshi.uniflow.entity.User;
import com.hitanshi.uniflow.exception.ResourceNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public User registerUser(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid username or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new InvalidCredentialsException(
                    "Invalid username or password"
            );

        }

        LoginResponse response = new LoginResponse();

        response.setToken(
                jwtService.generateToken(user.getUsername())
        );

        response.setRole(
                user.getRole().name()
        );

        return response;
    }
}