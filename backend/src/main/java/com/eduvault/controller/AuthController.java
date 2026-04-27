package com.eduvault.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduvault.dto.AuthLoginRequestDto;
import com.eduvault.dto.AuthResponseDto;
import com.eduvault.dto.AuthSignupRequestDto;
import com.eduvault.service.AuthService;
import com.eduvault.service.CaptchaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	private final CaptchaService captchaService;

	@GetMapping("/captcha")
	public ResponseEntity<?> getCaptcha() {
		return ResponseEntity.ok(captchaService.generateCaptcha());
	}

	@PostMapping("/signup")
	public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody AuthSignupRequestDto requestDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(requestDto));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthLoginRequestDto requestDto) {
		return ResponseEntity.ok(authService.login(requestDto));
	}
}
