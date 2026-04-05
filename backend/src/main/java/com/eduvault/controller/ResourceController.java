package com.eduvault.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduvault.dto.ApiResponseDto;
import com.eduvault.dto.ResourceRequestDto;
import com.eduvault.dto.ResourceResponseDto;
import com.eduvault.service.ResourceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resources")
@Validated
@RequiredArgsConstructor
public class ResourceController {

	private final ResourceService resourceService;

	@PostMapping
	public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto requestDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(requestDto));
	}

	@GetMapping
	public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
		return ResponseEntity.ok(resourceService.getAllResources());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable Long id) {
		return ResponseEntity.ok(resourceService.getResourceById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ResourceResponseDto> updateResource(@PathVariable Long id,
			@Valid @RequestBody ResourceRequestDto requestDto) {
		return ResponseEntity.ok(resourceService.updateResource(id, requestDto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponseDto> deleteResource(@PathVariable Long id) {
		return ResponseEntity.ok(resourceService.deleteResource(id));
	}
}
