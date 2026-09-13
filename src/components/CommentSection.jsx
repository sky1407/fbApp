import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';

function CommentSection({ post, onAddComment, onDeleteComment, onLikeComment, onEditComment, onAddReply, onDeleteReply, onLikeReply }) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);
  const hasMoreComments = post.comments.length > 2;

  const submitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="mt-6 pt-4 border-t border-zinc-800/60 space-y-5">
      <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Diskusia ({post.comments.length})</span>
      </div>

      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            postId={post.id}
            comment={comment}
            onDelete={onDeleteComment}
            onLike={onLikeComment}
            onEdit={onEditComment}
            onAddReply={onAddReply}
            onDeleteReply={onDeleteReply}
            onLikeReply={onLikeReply}
          />
        ))}
      </div>

      {hasMoreComments && (
        <button type="button" onClick={() => setShowAllComments((prev) => !prev)} className="w-full text-center py-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/60 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer">
          {showAllComments ? 'Zbaliť komentáre' : `Zobraziť staršie komentáre (${post.comments.length - 2})`}
        </button>
      )}

      {/* Formulár pre pridanie hlavného komentára (Moderný zaoblený panel) */}
      <div className="flex gap-2 items-center pt-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
          ME
        </div>
        <div className="w-full flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
          <input
            type="text"
            placeholder="Napíšte komentár..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full text-sm py-1.5 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button type="button" onClick={submitComment} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer shrink-0">
            Odoslať
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
