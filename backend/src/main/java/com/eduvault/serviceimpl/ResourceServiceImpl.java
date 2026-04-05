package com.eduvault.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.eduvault.dto.ApiResponseDto;
import com.eduvault.dto.ResourceRequestDto;
import com.eduvault.dto.ResourceResponseDto;
import com.eduvault.entity.ResourceItem;
import com.eduvault.repository.ResourceItemRepository;
import com.eduvault.service.ResourceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

	private final ResourceItemRepository resourceItemRepository;

	@Override
	public ResourceResponseDto createResource(ResourceRequestDto requestDto) {
		ResourceItem resourceItem = ResourceItem.builder()
				.title(requestDto.getTitle().trim())
				.description(requestDto.getDescription())
				.subject(requestDto.getSubject().trim())
				.type(requestDto.getType().trim())
				.fileName(blankToNull(requestDto.getFileName()))
				.filePath(blankToNull(requestDto.getFilePath()))
				.build();

		return mapToResponse(resourceItemRepository.save(resourceItem));
	}

	@Override
	public List<ResourceResponseDto> getAllResources() {
		return resourceItemRepository.findAllByOrderByCreatedAtDesc()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	public ResourceResponseDto getResourceById(Long id) {
		return mapToResponse(findResource(id));
	}

	@Override
	public ResourceResponseDto updateResource(Long id, ResourceRequestDto requestDto) {
		ResourceItem resourceItem = findResource(id);
		resourceItem.setTitle(requestDto.getTitle().trim());
		resourceItem.setDescription(requestDto.getDescription());
		resourceItem.setSubject(requestDto.getSubject().trim());
		resourceItem.setType(requestDto.getType().trim());
		resourceItem.setFileName(blankToNull(requestDto.getFileName()));
		resourceItem.setFilePath(blankToNull(requestDto.getFilePath()));

		return mapToResponse(resourceItemRepository.save(resourceItem));
	}

	@Override
	public ApiResponseDto deleteResource(Long id) {
		ResourceItem resourceItem = findResource(id);
		resourceItemRepository.delete(resourceItem);
		return new ApiResponseDto("Resource deleted successfully");
	}

	private ResourceItem findResource(Long id) {
		return resourceItemRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));
	}

	private ResourceResponseDto mapToResponse(ResourceItem resourceItem) {
		String downloadUrl = null;
		if (resourceItem.getFileName() != null && !resourceItem.getFileName().isBlank()) {
			downloadUrl = "/api/files/download/" + resourceItem.getFileName();
		}

		return ResourceResponseDto.builder()
				.id(resourceItem.getId())
				.title(resourceItem.getTitle())
				.description(resourceItem.getDescription())
				.subject(resourceItem.getSubject())
				.type(resourceItem.getType())
				.fileName(resourceItem.getFileName())
				.filePath(resourceItem.getFilePath())
				.createdAt(resourceItem.getCreatedAt())
				.downloadUrl(downloadUrl)
				.uploader("EduVault Community")
				.build();
	}

	private String blankToNull(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}
		return value.trim();
	}
}
