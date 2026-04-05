package com.eduvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class FileUploadResponseDto {

	private String originalFileName;
	private String storedFileName;
	private String filePath;
	private String downloadUrl;
	private long size;
}
