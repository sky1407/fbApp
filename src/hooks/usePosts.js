import { useEffect, useState } from 'react';
import { loadPosts, savePosts } from '../utils/storage';
import { createMockPosts } from '../data/mockPosts';

export function usePosts() {
  const [posts, setPosts] = useState(() => loadPosts() ?? createMockPosts(25));

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  const addPost = (content, thumbnail) => {
    const newPost = { id: `post_${Date.now()}`, content, thumbnail, likes: 0, comments: [] };
    setPosts((prev) => [newPost, ...prev]);
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const likePost = (postId) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
  };

  const editPost = (postId, content) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, content } : post)));
  };

  const addComment = (postId, text) => {
    if (!text || !text.trim()) return;
    const newComment = { id: `comment_${Date.now()}`, text, likes: 0, replies: [] };
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post))
    );
  };

  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) } : post
      )
    );
  };

  const likeComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : { ...post, comments: post.comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)) }
      )
    );
  };

  const editComment = (postId, commentId, text) => {
    if (!text || !text.trim()) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : { ...post, comments: post.comments.map((c) => (c.id === commentId ? { ...c, text } : c)) }
      )
    );
  };

  const addReply = (postId, commentId, text) => {
    if (!text || !text.trim()) return;
    const newReply = { id: `reply_${Date.now()}`, text, likes: 0 };
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
              ),
            }
      )
    );
  };

  const deleteReply = (postId, commentId, replyId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.map((c) =>
                c.id !== commentId ? c : { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
              ),
            }
      )
    );
  };

  const likeReply = (postId, commentId, replyId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.map((c) =>
                c.id !== commentId
                  ? c
                  : { ...c, replies: c.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)) }
              ),
            }
      )
    );
  };

  return {
    posts,
    addPost,
    deletePost,
    likePost,
    editPost,
    addComment,
    deleteComment,
    likeComment,
    editComment,
    addReply,
    deleteReply,
    likeReply,
  };
}
