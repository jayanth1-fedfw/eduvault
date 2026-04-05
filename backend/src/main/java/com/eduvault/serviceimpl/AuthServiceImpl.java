package com.eduvault.serviceimpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eduvault.dto.AuthLoginRequestDto;
import com.eduvault.dto.AuthResponseDto;
import com.eduvault.dto.AuthSignupRequestDto;
import com.eduvault.entity.User;
import com.eduvault.repository.UserRepository;
import com.eduvault.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public AuthResponseDto signup(AuthSignupRequestDto requestDto) {
		String normalizedEmail = requestDto.getEmail().trim().toLowerCase();
		if (userRepository.existsByEmail(normalizedEmail)) {
			throw new IllegalArgumentException("Email is already registered");
		}

		User user = User.builder()
				.name(requestDto.getName().trim())
				.email(normalizedEmail)
				.password(passwordEncoder.encode(requestDto.getPassword()))
				.build();

		User savedUser = userRepository.save(user);
		return buildResponse(savedUser, "Signup successful");
	}

	@Override
	public AuthResponseDto login(AuthLoginRequestDto requestDto) {
		User user = userRepository.findByEmail(requestDto.getEmail().trim().toLowerCase())
				.orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

		if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("Invalid email or password");
		}

		return buildResponse(user, "Login successful");
	}

	private AuthResponseDto buildResponse(User user, String message) {
		return AuthResponseDto.builder()
				.id(user.getId())
				.name(user.getName())
				.email(user.getEmail())
				.message(message)
				.build();
	}
}
