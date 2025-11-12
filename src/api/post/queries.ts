import { useQuery } from '@tanstack/react-query';
import { PostWithUser, Post } from './types';
import { User } from '../user/types';
import apiClient from '@/lib/api-client';

export const getPosts = async (): Promise<PostWithUser[]> => {
  try {
    const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
      apiClient.get<Post[]>('/posts?_sort=-createdAt'),
      apiClient.get<User[]>('/users'),
      apiClient.get('/comments'),
    ]);

    const posts = postsResponse.data;
    const users = usersResponse.data;
    const comments = commentsResponse.data;

    return posts.map((post) => {
      const user = users.find((u) => u.id.toString() === post.userId.toString());
      const commentsCount = comments.filter(
        (c: any) => c.postId.toString() === post.id.toString()
      ).length;

      return {
        ...post,
        user: user || {
          id: post.userId,
          email: '',
          name: 'Unknown User',
          createdAt: new Date().toISOString(),
        },
        commentsCount,
      };
    });
  } catch (error) {
    throw new Error('Failed to fetch posts');
  }
};

export const getPostById = async (id: string | number): Promise<PostWithUser> => {
  try {
    const [postResponse, usersResponse, commentsResponse] = await Promise.all([
      apiClient.get<Post>(`/posts/${id}`),
      apiClient.get<User[]>('/users'),
      apiClient.get(`/comments?postId=${id}`),
    ]);

    const post = postResponse.data;
    const users = usersResponse.data;
    const comments = commentsResponse.data;

    const user = users.find((u) => u.id.toString() === post.userId.toString());

    return {
      ...post,
      user: user || {
        id: post.userId,
        email: '',
        name: 'Unknown User',
        createdAt: new Date().toISOString(),
      },
      commentsCount: comments.length,
    };
  } catch (error) {
    throw new Error('Failed to fetch post');
  }
};

export const getPostsByUserId = async (userId: string | number): Promise<PostWithUser[]> => {
  try {
    const [postsResponse, userResponse, commentsResponse] = await Promise.all([
      apiClient.get<Post[]>(`/posts?userId=${userId}&_sort=-createdAt`),
      apiClient.get<User>(`/users/${userId}`),
      apiClient.get('/comments'),
    ]);

    const posts = postsResponse.data;
    const user = userResponse.data;
    const comments = commentsResponse.data;

    return posts.map((post) => {
      const commentsCount = comments.filter(
        (c: any) => c.postId.toString() === post.id.toString()
      ).length;

      return {
        ...post,
        user,
        commentsCount,
      };
    });
  } catch (error) {
    throw new Error('Failed to fetch user posts');
  }
};

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};

export const usePost = (id: string | number) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};

export const useUserPosts = (userId: string | number) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getPostsByUserId(userId),
    enabled: !!userId,
  });
};