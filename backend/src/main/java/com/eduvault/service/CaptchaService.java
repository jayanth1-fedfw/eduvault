package com.eduvault.service;

import com.eduvault.dto.CaptchaResponseDto;

public interface CaptchaService {

	CaptchaResponseDto generateCaptcha();

	void validateCaptcha(String captchaId, String captchaAnswer);
}
