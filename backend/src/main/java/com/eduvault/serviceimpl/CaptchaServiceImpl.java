package com.eduvault.serviceimpl;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.eduvault.dto.CaptchaResponseDto;
import com.eduvault.service.CaptchaService;

@Service
public class CaptchaServiceImpl implements CaptchaService {

	private static final int CAPTCHA_TTL_MINUTES = 5;

	private final Map<String, CaptchaEntry> captchaStore = new ConcurrentHashMap<>();

	@Override
	public CaptchaResponseDto generateCaptcha() {
		removeExpiredCaptchas();

		int firstNumber = ThreadLocalRandom.current().nextInt(1, 10);
		int secondNumber = ThreadLocalRandom.current().nextInt(1, 10);
		String captchaId = UUID.randomUUID().toString();

		captchaStore.put(captchaId, new CaptchaEntry(String.valueOf(firstNumber + secondNumber),
				LocalDateTime.now().plusMinutes(CAPTCHA_TTL_MINUTES)));

		return CaptchaResponseDto.builder()
				.captchaId(captchaId)
				.challengeText(firstNumber + " + " + secondNumber + " = ?")
				.build();
	}

	@Override
	public void validateCaptcha(String captchaId, String captchaAnswer) {
		removeExpiredCaptchas();

		CaptchaEntry captchaEntry = captchaStore.remove(captchaId);
		if (captchaEntry == null) {
			throw new IllegalArgumentException("Captcha expired. Please refresh and try again.");
		}

		if (!captchaEntry.answer().equals(captchaAnswer.trim())) {
			throw new IllegalArgumentException("Incorrect captcha answer");
		}
	}

	private void removeExpiredCaptchas() {
		LocalDateTime now = LocalDateTime.now();
		captchaStore.entrySet().removeIf(entry -> entry.getValue().expiresAt().isBefore(now));
	}

	private record CaptchaEntry(String answer, LocalDateTime expiresAt) {
	}
}
