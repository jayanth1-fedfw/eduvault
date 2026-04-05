package com.eduvault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceRequestDto {

	@NotBlank(message = "Title is required")
	private String title;

	private String description;

	@NotBlank(message = "Subject is required")
	private String subject;

	@NotBlank(message = "Type is required")
	private String type;

	private String fileName;

	private String filePath;
}
