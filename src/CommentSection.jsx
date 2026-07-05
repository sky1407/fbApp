import { useState } from 'react';

function CommentSection({
  post,
  commentInputs,
  setCommentInputs,
  replyInputs,
  setReplyInputs,
  expandedComments,
  toggleCommentReplies,
  expandedPosts,
  togglePostComments,
  handleAddComment,
  handleDeleteComment,
  handleLikeComment,
  editingCommentId,
  editCommentText,
  setEditCommentText,
  startEditComment,
  handleSaveEditComment,
  handleAddReply,
  handleDeleteReply,
  handleLikeReply
}) {
  const isExpanded = expandedPosts[post.id];
  const displayedComments = isExpanded ? post.comments : post.comments.slice(0, 2);
  const hasMoreComments = post.comments.length > 2;

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
        Comments ({post.comments.length})
      </h4>
      
      <div className="space-y-3">
        {displayedComments.map(comment => {
          const isCommentExpanded = expandedComments[comment.id];
          const isEditingThisComment = editingCommentId === comment.id;

          return (
            <div key={comment.id} className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-3.5 space-y-2">
              
              {/* Editing mode / Comment display */}
              {isEditingThisComment ? (
                <div className="space-y-2">
                  <textarea 
                    value={editCommentText} 
                    onChange={(e) => setEditCommentText(e.target.value)} 
                    className="w-full text-sm p-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleSaveEditComment(post.id, comment.id)} className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition cursor-pointer">Save</button>
                    <button type="button" onClick={() => startEditComment(null)} className="px-2.5 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded transition cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 break-words">{comment.text}</p>
              )}
              
              {/* Actions below main comment */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <button type="button" onClick={() => handleLikeComment(post.id, comment.id)} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Like ({comment.likes})</button>
                {!isEditingThisComment && <button type="button" onClick={() => startEditComment(comment)} className="hover:text-gray-700 dark:hover:text-zinc-300 cursor-pointer">Edit</button>}
                <button type="button" onClick={() => handleDeleteComment(post.id, comment.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                {comment.replies && comment.replies.length > 0 && (
                  <button type="button" onClick={() => toggleCommentReplies(comment.id)} className="text-gray-700 dark:text-zinc-300 font-bold hover:underline cursor-pointer">
                    {isCommentExpanded ? `Hide replies` : `Show replies (${comment.replies.length})`}
                  </button>
                )}
              </div>

              {/* Rendering replies (2nd level) */}
              {isCommentExpanded && comment.replies && comment.replies.map(reply => (
                <div key={reply.id} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 ml-6 mt-2 space-y-1.5 shadow-xs">
                  <p className="text-sm text-gray-700 dark:text-zinc-300 break-words">
                    <span className="text-gray-400 mr-1">↪️</span> {reply.text}
                  </p>
                  <div className="flex gap-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    <button type="button" onClick={() => handleLikeReply(post.id, comment.id, reply.id)} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Like ({reply.likes})</button>
                    <button type="button" onClick={() => handleDeleteReply(post.id, comment.id, reply.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                  </div>
                </div>
              ))}

              {/* Form for adding a reply */}
              <div className="ml-6 mt-3 flex gap-2 items-center">
                <textarea 
                  placeholder="Reply..." 
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                  className="w-full text-xs p-2 h-8 resize-none bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
                <button type="button" onClick={() => handleAddReply(post.id, comment.id, replyInputs[comment.id])} className="px-3 py-1.5 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0">Reply</button>
              </div>

            </div>
          );
        })}
      </div>

      {hasMoreComments && (
        <button type="button" onClick={() => togglePostComments(post.id)} className="w-full text-center py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors cursor-pointer">
          {isExpanded ? 'Collapse comments' : `Show more comments (${post.comments.length - 2})`}
        </button>
      )}

      {/* Form for adding a main comment */}
      <div className="flex gap-2 items-start pt-2">
        <textarea 
          placeholder="Write a comment..." 
          value={commentInputs[post.id] || ''}
          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
          className="w-full text-sm p-2.5 h-10 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
        />
        <button type="button" onClick={() => handleAddComment(post.id, commentInputs[post.id])} className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0">Comment</button>
      </div>
    </div>
  );
}

export default CommentSection;
