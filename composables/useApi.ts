// 定义用户接口
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

// 定义帖子接口
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// 定义评论接口
export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

// API服务
export const useApi = () => {
  const nuxtApp = useNuxtApp()
  
  return {
    // 用户相关API
    users: {
      // 获取所有用户
      getAll: () => nuxtApp.$http.get<User[]>('/users'),
      
      // 获取单个用户
      getById: (id: number | string) => nuxtApp.$http.get<User>(`/users/${id}`),
      
      // 创建用户
      create: (userData: Partial<User>) => nuxtApp.$http.post<User>('/users', userData),
      
      // 更新用户
      update: (id: number | string, userData: Partial<User>) => nuxtApp.$http.put<User>(`/users/${id}`, userData),
      
      // 删除用户
      delete: (id: number | string) => nuxtApp.$http.delete(`/users/${id}`)
    },
    
    // 帖子相关API
    posts: {
      // 获取所有帖子
      getAll: () => nuxtApp.$http.get<Post[]>('/posts'),
      
      // 获取单个帖子
      getById: (id: number | string) => nuxtApp.$http.get<Post>(`/posts/${id}`),
      
      // 获取用户的所有帖子
      getByUserId: (userId: number | string) => nuxtApp.$http.get<Post[]>('/posts', { userId }),
      
      // 创建帖子
      create: (postData: Partial<Post>) => nuxtApp.$http.post<Post>('/posts', postData),
      
      // 更新帖子
      update: (id: number | string, postData: Partial<Post>) => nuxtApp.$http.put<Post>(`/posts/${id}`, postData),
      
      // 删除帖子
      delete: (id: number | string) => nuxtApp.$http.delete(`/posts/${id}`)
    },
    
    // 评论相关API
    comments: {
      // 获取所有评论
      getAll: () => nuxtApp.$http.get<Comment[]>('/comments'),
      
      // 获取单个评论
      getById: (id: number | string) => nuxtApp.$http.get<Comment>(`/comments/${id}`),
      
      // 获取帖子的所有评论
      getByPostId: (postId: number | string) => nuxtApp.$http.get<Comment[]>('/comments', { postId }),
      
      // 创建评论
      create: (commentData: Partial<Comment>) => nuxtApp.$http.post<Comment>('/comments', commentData),
      
      // 更新评论
      update: (id: number | string, commentData: Partial<Comment>) => nuxtApp.$http.put<Comment>(`/comments/${id}`, commentData),
      
      // 删除评论
      delete: (id: number | string) => nuxtApp.$http.delete(`/comments/${id}`)
    }
  }
} 