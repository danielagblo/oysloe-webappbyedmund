// post-specific calls
// These connect mocks or real HTTP calls depending on env variable.

import { apiClient } from './apiClient';
import { endpoints } from './endpoints';
import mockPosts from '../../assets/mocks/posts.json';

const useMocks = process.env.REACT_APP_USE_MOCKS === 'true';

export async function listPosts() {
  if (useMocks) return mockPosts;
  return apiClient.get<Post[]>(endpoints.posts.list());
}

export async function createPost(payload: CreatePostDto) {
  if (useMocks) return { id: Date.now(), ...payload };
  return apiClient.post<Post>(endpoints.posts.create(), payload);
}