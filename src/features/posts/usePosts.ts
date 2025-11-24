// hooks/components consume services

import { useEffect, useState } from 'react';
import { listPosts, createPost } from '../../services/postService';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  async function addPost(input: CreatePostDto) {
    const newPost = await createPost(input);
    setPosts(prev => [newPost, ...prev]);
  }

  return { posts, loading, addPost };
}