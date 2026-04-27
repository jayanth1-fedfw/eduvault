package com.eduvault.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthLoginRequestDto {

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;

	@NotBlank(message = "Captcha id is required")
	private String captchaId;

	@NotBlank(message = "Captcha answer is required")
	private String captchaAnswer;
}
