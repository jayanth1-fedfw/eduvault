const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

function getErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload.message) {
    return payload.message;
  }

  return fallbackMessage;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Something went wrong"));
  }

  return payload;
}

function formatRelativeTime(createdAt) {
  if (!createdAt) {
    return "just now";
  }

  const createdDate = new Date(createdAt);
  const seconds = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / 1000));

  if (seconds < 60) {
    return "just now";
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} min ago`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)} hr ago`;
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  return createdDate.toLocaleDateString();
}

function mapResource(resource) {
  return {
    ...resource,
    uploader: resource.uploader || "EduVault Community",
    uploadedAt: formatRelativeTime(resource.createdAt),
    downloads: 0,
    sizeLabel: resource.fileName || "No file attached",
  };
}

export async function signupUser(payload) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCaptcha() {
  return request("/auth/captcha");
}

export async function getResources() {
  const resources = await request("/resources");
  return Array.isArray(resources) ? resources.map(mapResource) : [];
}

export async function getResourceById(id) {
  const resource = await request(`/resources/${id}`);
  return mapResource(resource);
}

export async function createResource(payload) {
  const resource = await request("/resources", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapResource(resource);
}

export async function updateResource(id, payload) {
  const resource = await request(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return mapResource(resource);
}

export async function deleteResource(id) {
  return request(`/resources/${id}`, {
    method: "DELETE",
  });
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/files/upload", {
    method: "POST",
    body: formData,
  });
}

export async function downloadResourceFile(fileName) {
  const response = await fetch(`${API_BASE_URL}/files/download/${fileName}`);
  if (!response.ok) {
    throw new Error("Unable to download file");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
