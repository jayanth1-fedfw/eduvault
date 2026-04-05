package com.eduvault.service;

import java.util.List;

import com.eduvault.dto.ApiResponseDto;
import com.eduvault.dto.ResourceRequestDto;
import com.eduvault.dto.ResourceResponseDto;

public interface ResourceService {

	ResourceResponseDto createResource(ResourceRequestDto requestDto);

	List<ResourceResponseDto> getAllResources();

	ResourceResponseDto getResourceById(Long id);

	ResourceResponseDto updateResource(Long id, ResourceRequestDto requestDto);

	ApiResponseDto deleteResource(Long id);
}
