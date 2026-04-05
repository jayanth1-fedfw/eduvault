package com.eduvault.serviceimpl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.eduvault.dto.FileUploadResponseDto;
import com.eduvault.service.FileService;

import jakarta.annotation.PostConstruct;

@Service
public class FileServiceImpl implements FileService {

	@Value("${file.upload-dir}")
	private String uploadDir;

	private Path uploadPath;

	@PostConstruct
	public void init() {
		try {
			uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
			Files.createDirectories(uploadPath);
		} catch (IOException exception) {
			throw new RuntimeException("Could not create upload directory", exception);
		}
	}

	@Override
	public FileUploadResponseDto uploadFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("Please choose a file to upload");
		}

		String originalFileName = file.getOriginalFilename() == null ? "resource-file" : file.getOriginalFilename();
		String extension = "";
		int dotIndex = originalFileName.lastIndexOf('.');
		if (dotIndex >= 0) {
			extension = originalFileName.substring(dotIndex);
		}

		String storedFileName = UUID.randomUUID() + extension;
		Path targetLocation = uploadPath.resolve(storedFileName);

		try {
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException exception) {
			throw new RuntimeException("Could not store file", exception);
		}

		return FileUploadResponseDto.builder()
				.originalFileName(originalFileName)
				.storedFileName(storedFileName)
				.filePath(targetLocation.toString())
				.downloadUrl("/api/files/download/" + storedFileName)
				.size(file.getSize())
				.build();
	}

	@Override
	public Resource downloadFile(String fileName) {
		try {
			Path filePath = uploadPath.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (!resource.exists()) {
				throw new IllegalArgumentException("File not found: " + fileName);
			}
			return resource;
		} catch (MalformedURLException exception) {
			throw new RuntimeException("Could not read file", exception);
		}
	}
}
