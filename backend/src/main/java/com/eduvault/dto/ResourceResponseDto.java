package com.eduvault.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ResourceResponseDto {

	private Long id;
	private String title;
	private String description;
	private String subject;
	private String type;
	private String fileName;
	private String filePath;
	private LocalDateTime createdAt;
	private String downloadUrl;
	private String uploader;
}
