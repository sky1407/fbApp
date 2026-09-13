import { useState } from 'react';
import { Heart, Trash2, Edit2, MessageSquare, Reply } from 'lucide-react';

function CommentItem({ postId, comment, onDelete, onLike, onEdit, onAddReply, onDeleteReply, onLikeReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');

  const startEditing = () => {
    setDraftText(comment.text);
    setIsEditing(true);
  };

  const saveEdit = () => {
    onEdit(postId, comment.id, draftText);
    setIsEditing(false);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    onAddReply(postId, comment.id, replyText);
    setReplyText('');
    setShowReplies(true);
  };

  return (
    <div className="group space-y-1.5 transition-all">
      <div className="flex items-start gap-2.5">
        {/* Užívateľský kruh / Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0 mt-0.5">
          U
        </div>

        <div className="space-y-1 max-w-[85%]">
          {/* Četová bublina s vysokým zaoblením (2026 Style) */}
          <div className="bg-zinc-800/80 dark:bg-zinc-900 border border-zinc-700/30 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-xs text-zinc-100">
            {isEditing ? (
              <div className="space-y-2 min-w-[200px]">
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-full text-sm p-2 border border-zinc-700 rounded-xl bg-zinc-950 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={saveEdit} className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">Uložiť</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-600 transition cursor-pointer">Zrušiť</button>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed break-words">{comment.text}</p>
            )}
          </div>

          {/* Akcie pod bublinou */}
          <div className="flex items-center gap-4 px-2 text-xs font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => onLike(postId, comment.id)}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${comment.likes > 0 ? 'text-rose-500 font-semibold' : 'hover:text-rose-400'}`}
            >
              <Heart className={`w-3 h-3 ${comment.likes > 0 ? 'fill-rose-500' : ''}`} />
              <span>{comment.likes > 0 ? `Páči sa mi (${comment.likes})` : 'Páči sa mi'}</span>
            </button>

            {!isEditing && (
              <button type="button" onClick={startEditing} className="hover:text-zinc-200 flex items-center gap-1 cursor-pointer">
                <Edit2 className="w-3 h-3" /> Upraviť
              </button>
            )}

            <button type="button" onClick={() => onDelete(postId, comment.id)} className="hover:text-red-400 flex items-center gap-1 cursor-pointer text-zinc-500">
              <Trash2 className="w-3 h-3" /> Vymazať
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button type="button" onClick={() => setShowReplies((prev) => !prev)} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer">
                <MessageSquare className="w-3 h-3" />
                <span>{showReplies ? 'Skryť odpovede' : `Odpovede (${comment.replies.length})`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vykreslenie reakcií (2. úroveň) */}
      {showReplies && comment.replies && comment.replies.map((reply) => (
        <div key={reply.id} className="flex items-start gap-2.5 ml-9 mt-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-[10px] shadow-xs shrink-0 mt-0.5">
            R
          </div>
          <div className="space-y-1 max-w-[80%]">
            <div className="bg-zinc-800/40 border border-zinc-700/20 rounded-2xl rounded-tl-sm px-3.5 py-2 shadow-xs text-zinc-200 text-sm">
              <p className="break-words">{reply.text}</p>
            </div>
            <div className="flex gap-4 px-2 text-[11px] font-medium text-zinc-500">
              <button
                type="button"
                onClick={() => onLikeReply(postId, comment.id, reply.id)}
                className={`flex items-center gap-1 cursor-pointer ${reply.likes > 0 ? 'text-rose-500' : 'hover:text-rose-400'}`}
              >
                <Heart className={`w-2.5 h-2.5 ${reply.likes > 0 ? 'fill-rose-500' : ''}`} />
                <span>{reply.likes > 0 ? `Like (${reply.likes})` : 'Like'}</span>
              </button>
              <button type="button" onClick={() => onDeleteReply(postId, comment.id, reply.id)} className="hover:text-red-400 flex items-center gap-1 cursor-pointer">
                <Trash2 className="w-2.5 h-2.5" /> Vymazať
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Formulár pre pridanie reakcie (Kompaktný Input) */}
      <div className="ml-9 mt-2 flex gap-2 items-center max-w-[85%]">
        <input
          type="text"
          placeholder="Odpovedať užívateľovi..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="w-full text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
        <button type="button" onClick={submitReply} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-full transition-colors cursor-pointer shrink-0">
          <Reply className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CommentItem;
