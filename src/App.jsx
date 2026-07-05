import { useState, useEffect } from 'react';
import PostForm from './PostForm'; 
import PostCard from './PostCard';

// 1. Automatický generátor testovacích príspevkov na nástenke
const INITIAL_POSTS = Array.from({ length: 25 }, (_, index) => ({
  id: `post_mock_${index + 1}`,
  content: `<p>Toto je automatický testovací príspevok číslo <b>${index + 1}</b>. Obsahuje formátovaný text, ktorý simuluje príspevok na sieti.</p>`,
  thumbnail: index % 3 === 0 ? `https://picsum.photos{index + 10}/800/400` : "",
  likes: Math.floor(Math.random() * 10),
  comments: [
    {
      id: `comment_mock_${index + 1}`,
      text: "Skvelý príspevok! Veľmi sa mi páči toto moderné používateľské rozhranie.",
      likes: 2,
      replies: [
        {
          id: `reply_mock_${index + 1}`,
          text: "Súhlasím, vyzerá to super!",
          likes: 1
        }
      ]
    }
  ]
}));

function App() {
  // 2. Hlavný stav aplikácie (State Management)
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('fb_wall_posts');
    return savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS;
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

  // 3. Ukladanie do localStorage pri zmene stavu
  useEffect(() => {
    localStorage.setItem('fb_wall_posts', JSON.stringify(posts));
  }, [posts]);

  // 4. Detekcia skrolovania pre nekonečnú nástenku
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100) {
        setVisibleCount((prevCount) => prevCount + 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === AKCIE PRE PRÍSPEVKY ===
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

  // === AKCIE PRE KOMENTÁRE ===
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

  // === AKCIE PRE ODPOVEDE (2. ÚROVEŇ) ===
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

  // Zbalenie všetkých potrebných funkcií pre sekciu komentárov do jedného balíka
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
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">Modulárna architektúra s Reactom a Tailwind CSS</p>
        </header>
        
        {/* Využitie samostatného formulára */}
        <PostForm onAddPost={handleAddPost} />

        {/* Zoznam príspevkov pomocou modulárnych kariet */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Príspevky (Zobrazené: {Math.min(visibleCount, posts.length)} z {posts.length})
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
            <p className="text-center text-sm text-gray-400 font-medium italic py-4">Dosiahli ste koniec nástenky.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
