import apiClient from '@/lib/api-client';
import { Post, PostWithUser, CreatePostData, UpdatePostData } from '@/types/post';
import { User } from '@/types/auth';

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

export const createPost = async (data: CreatePostData): Promise<Post> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Decode token to get user ID
    const decoded = atob(token);
    const userId = decoded.split(':')[0];

    const newPost = {
      userId,
      content: data.content,
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await apiClient.post<Post>('/posts', newPost);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create post');
  }
};

export const updatePost = async (
  id: string | number,
  data: UpdatePostData
): Promise<Post> => {
  try {
    const response = await apiClient.patch<Post>(`/posts/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update post');
  }
};

export const deletePost = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${id}`);
    // Also delete all comments for this post
    const commentsResponse = await apiClient.get(`/comments?postId=${id}`);
    const comments = commentsResponse.data;
    await Promise.all(comments.map((comment: any) => apiClient.delete(`/comments/${comment.id}`)));
  } catch (error) {
    throw new Error('Failed to delete post');
  }
};
