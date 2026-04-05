package com.eduvault.service;

import com.eduvault.dto.AuthLoginRequestDto;
import com.eduvault.dto.AuthResponseDto;
import com.eduvault.dto.AuthSignupRequestDto;

public interface AuthService {

	AuthResponseDto signup(AuthSignupRequestDto requestDto);

	AuthResponseDto login(AuthLoginRequestDto requestDto);
}
