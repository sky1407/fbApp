import { useState, useEffect } from 'react';
import PostForm from './PostForm'; 
import PostCard from './PostCard';

// 1. Automatic mock posts generator for the wall
const INITIAL_POSTS = Array.from({ length: 25 }, (_, index) => ({
  id: `post_mock_${index + 1}`,
  content: `<p>This is an automated mock post number <b>${index + 1}</b>. It contains formatted text simulating a feed post.</p>`,
  thumbnail: index % 3 === 0 ? `https://picsum.photos/${index + 10}/800/400` : "",
  likes: Math.floor(Math.random() * 10),
  comments: [
    {
      id: `comment_mock_${index + 1}`,
      text: "Great post! I really love this modern user interface.",
      likes: 2,
      replies: [
        {
          id: `reply_mock_${index + 1}`,
          text: "I agree, looks amazing!",
          likes: 1
        }
      ]
    }
  ]
}));

function App() {
  // 2. Main application state (Load persisted posts if available, otherwise default to INITIAL_POSTS)
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('fb_wall_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({}); 
  const [expandedComments, setExpandedComments] = useState({}); 
  const [visibleCount, setVisibleCount] = useState(10);

  const [editingPostId, setEditingPostId] = useState(null);       
  const [editPostContent, setEditPostContent] = useState('');     

  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [editCommentText, setEditCommentText] = useState('');     

  // 3. Saving to localStorage on state change
  useEffect(() => {
    localStorage.setItem('fb_wall_posts', JSON.stringify(posts));
  }, [posts]);

  // 4. Scroll detection for infinite feed
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100) {
        setVisibleCount((prevCount) => prevCount + 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === ACTIONS FOR POSTS ===
  const handleAddPost = (content, thumbnail) => {
    const newPost = {
      id: `post_${Date.now()}`,
      content,
      thumbnail,
      likes: 0,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  };

  const startEditPost = (post) => {
    setEditingPostId(post.id);
    setEditPostContent(post.content);
  };

  const handleSaveEditPost = (postId, updatedContent) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, content: updatedContent } : post));
    setEditingPostId(null);
  };

  // === ACTIONS FOR COMMENTS ===
  const handleAddComment = (postId, text) => {
    if (!text || !text.trim()) return;
    const newComment = {
      id: `comment_${Date.now()}`,
      text: text,
      likes: 0,
      replies: []
    };
    setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, comments: post.comments.filter(c => c.id !== commentId) } : post));
  };

  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
        };
      }
      return post;
    }));
  };

  const handleSaveEditComment = (postId, commentId) => {
    if (!editCommentText.trim()) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => c.id === commentId ? { ...c, text: editCommentText } : c)
        };
      }
      return post;
    }));
    setEditingCommentId(null);
  };

  // === ACTIONS FOR REPLIES (2nd LEVEL) ===
  const handleAddReply = (postId, commentId, text) => {
    if (!text || !text.trim()) return;
    const newReply = {
      id: `reply_${Date.now()}`,
      text: text,
      likes: 0
    };
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c)
        };
      }
      return post;
    }));
    setExpandedComments(prev => ({ ...prev, [commentId]: true }));
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
  };

  const handleDeleteReply = (postId, commentId, replyId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return { ...c, replies: c.replies.filter(r => r.id !== replyId) };
            }
            return c;
          })
        };
      }
      return post;
    }));
  };

  const handleLikeReply = (postId, commentId, replyId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: c.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r)
              };
            }
            return c;
          })
        };
      }
      return post;
    }));
  };

  const togglePostComments = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleCommentReplies = (commentId) => {
    setExpandedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Bundle all required functions for the comment section
  const commentProps = {
    commentInputs, setCommentInputs,
    replyInputs, setReplyInputs,
    expandedComments, toggleCommentReplies,
    expandedPosts, togglePostComments,
    handleAddComment, handleDeleteComment, handleLikeComment,
    editingCommentId, editCommentText, setEditCommentText,
    startEditComment: setEditingCommentId, handleSaveEditComment,
    handleAddReply, handleDeleteReply, handleLikeReply
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 py-8 px-4 font-sans antialiased text-gray-900 dark:text-zinc-100">
      <div className="max-w-2xl mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight sm:text-4xl">Facebook "Wall"</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">Modular architecture with React and Tailwind CSS</p>
        </header>
        
        {/* Independent form usage */}
        <PostForm onAddPost={handleAddPost} />

        {/* Post feed list using modular cards */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Posts (Showing: {Math.min(visibleCount, posts.length)} of {posts.length})
          </h3>
          
          {posts.slice(0, visibleCount).map(post => (
            <PostCard 
              key={post.id}
              post={post}
              editingPostId={editingPostId}
              editPostContent={editPostContent}
              setEditPostContent={setEditPostContent}
              handleSaveEditPost={handleSaveEditPost}
              setEditingPostId={setEditingPostId}
              handleLikePost={handleLikePost}
              startEditPost={startEditPost}
              handleDeletePost={handleDeletePost}
              commentProps={commentProps}
            />
          ))}

          {visibleCount >= posts.length && posts.length > 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-zinc-400 pt-4">You have reached the end of the feed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
