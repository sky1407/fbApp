import { usePosts } from './hooks/usePosts';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function App() {
  const {
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
  } = usePosts();

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 font-sans antialiased text-zinc-100">
      <div className="max-w-2xl mx-auto">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent tracking-tight sm:text-4xl">
            Facebook "Wall"
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Ultra moderná verzia pre rok 2026 s čistým UI</p>
        </header>

        <PostForm onAddPost={addPost} />

        <PostList
          posts={posts}
          onLike={likePost}
          onDelete={deletePost}
          onEdit={editPost}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
          onLikeComment={likeComment}
          onEditComment={editComment}
          onAddReply={addReply}
          onDeleteReply={deleteReply}
          onLikeReply={likeReply}
        />
      </div>
    </div>
  );
}

export default App;
