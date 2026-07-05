import ReactQuill from 'react-quill-new';
import CommentSection from './CommentSection';

function PostCard({
  post,
  editingPostId,
  editPostContent,
  setEditPostContent,
  handleSaveEditPost,
  setEditingPostId,
  handleLikePost,
  startEditPost,
  handleDeletePost,
  // Všetky props, ktoré len pretečú hlbšie do CommentSection
  commentProps
}) {
  const isEditingThisPost = editingPostId === post.id;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl p-5 sm:p-6 transition hover:shadow-md">
      
      {/* Zobrazenie miniatúry, ak existuje */}
      {post.thumbnail && (
        <div className="mb-4 overflow-hidden rounded-lg max-h-[300px] border border-gray-100 dark:border-zinc-800">
          <img src={post.thumbnail} alt="Miniatúra príspevku" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Editačný režim / Normálne zobrazenie príspevku */}
      {isEditingThisPost ? (
        <div className="mb-4 space-y-3 bg-gray-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-gray-200 dark:border-zinc-800">
          <ReactQuill theme="snow" value={editPostContent} onChange={setEditPostContent} />
          <div className="flex gap-2">
            <button type="button" onClick={() => handleSaveEditPost(post.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition cursor-pointer">Uložiť</button>
            <button type="button" onClick={() => setEditingPostId(null)} className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded transition cursor-pointer">Zrušiť</button>
          </div>
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-zinc-200 break-words leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
      )}
      
      {/* Akcie pod príspevkom */}
      <div className="mt-5 flex gap-2 items-center border-t border-b border-gray-100 dark:border-zinc-800 py-2 text-sm">
        <button type="button" onClick={() => handleLikePost(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-semibold rounded-lg transition-colors cursor-pointer">
          👍 Páči sa mi to ({post.likes})
        </button>
        {!isEditingThisPost && (
          <button type="button" onClick={() => startEditPost(post)} className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 font-medium rounded-lg transition-colors cursor-pointer">
            ✏️ Upraviť
          </button>
        )}
        <button type="button" onClick={() => handleDeletePost(post.id)} className="flex items-center gap-1 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors cursor-pointer">
          🗑️ Vymazať
        </button>
      </div>

      {/* Vnorená sekcia komentárov */}
      <CommentSection post={post} {...commentProps} />
    </div>
  );
}

export default PostCard;
