import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ThumbsUp, Pencil, Trash2, Calendar, Share2 } from 'lucide-react';
import CommentSection from './CommentSection';

function PostCard({ post, onLike, onDelete, onEdit, onAddComment, onDeleteComment, onLikeComment, onEditComment, onAddReply, onDeleteReply, onLikeReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(post.content);

  const startEditing = () => {
    setDraftContent(post.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    onEdit(post.id, draftContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-zinc-700/60 hover:shadow-2xl">

      {/* Užívateľská hlavička príspevku */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
          FB
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-100">Filip Baláž</h4>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>Práve teraz</span>
          </div>
        </div>
      </div>

      {/* Miniatúra / Obrázok príspevku */}
      {post.thumbnail && (
        <div className="mb-4 overflow-hidden rounded-xl max-h-[340px] border border-zinc-800 shadow-inner group">
          <img
            src={post.thumbnail}
            alt="Miniatúra"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </div>
      )}

      {/* Telo príspevku (Editačný režim vs Zobrazenie) */}
      {isEditing ? (
        <div className="mb-4 space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <ReactQuill theme="snow" value={draftContent} onChange={setDraftContent} />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={saveEdit} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-md transition cursor-pointer">Uložiť</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition cursor-pointer">Zrušiť</button>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none text-zinc-200 text-[15px] break-words leading-relaxed tracking-wide" dangerouslySetInnerHTML={{ __html: post.content }} />
      )}

      {/* Spodná lišta akcií (Like, Edit, Delete, Share) */}
      <div className="mt-5 flex items-center justify-between border-t border-b border-zinc-800/60 py-2 text-xs font-semibold text-zinc-400">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all w-full cursor-pointer ${post.likes > 0 ? 'bg-blue-600/10 text-blue-400 font-bold' : 'hover:bg-zinc-800 hover:text-zinc-200'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${post.likes > 0 ? 'fill-blue-400/20' : ''}`} />
          <span>Páči sa mi to ({post.likes})</span>
        </button>

        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all w-full cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Upraviť</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(post.id)}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-rose-950/30 hover:text-rose-400 transition-all w-full cursor-pointer text-zinc-500"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vymazať</span>
        </button>

        <button
          type="button"
          className="hidden sm:flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all w-full cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Zdieľať</span>
        </button>
      </div>

      {/* Sekcia komentárov */}
      <CommentSection
        post={post}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        onLikeComment={onLikeComment}
        onEditComment={onEditComment}
        onAddReply={onAddReply}
        onDeleteReply={onDeleteReply}
        onLikeReply={onLikeReply}
      />
    </div>
  );
}

export default PostCard;
