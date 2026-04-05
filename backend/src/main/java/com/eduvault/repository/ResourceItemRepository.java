package com.eduvault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduvault.entity.ResourceItem;

public interface ResourceItemRepository extends JpaRepository<ResourceItem, Long> {

	List<ResourceItem> findAllByOrderByCreatedAtDesc();
}
