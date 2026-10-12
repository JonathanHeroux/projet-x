export async function apiFetch(endpoint, options = {}) {
  return fetch(`/api${endpoint}`, {
    credentials: "include",
    ...options,
  });
}
