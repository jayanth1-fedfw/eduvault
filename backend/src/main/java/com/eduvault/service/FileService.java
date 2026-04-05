package com.eduvault.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.eduvault.dto.FileUploadResponseDto;

public interface FileService {

	FileUploadResponseDto uploadFile(MultipartFile file);

	Resource downloadFile(String fileName);
}
