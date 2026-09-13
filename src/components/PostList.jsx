import PostCard from './PostCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

function PostList({ posts, onLike, onDelete, onEdit, onAddComment, onDeleteComment, onLikeComment, onEditComment, onAddReply, onDeleteReply, onLikeReply }) {
  const visibleCount = useInfiniteScroll({ initialCount: 10, step: 10 });
  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Príspevky (Zobrazené: {Math.min(visibleCount, posts.length)} z {posts.length})
      </h3>

      {visiblePosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          onEdit={onEdit}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onLikeComment={onLikeComment}
          onEditComment={onEditComment}
          onAddReply={onAddReply}
          onDeleteReply={onDeleteReply}
          onLikeReply={onLikeReply}
        />
      ))}

      {visibleCount >= posts.length && posts.length > 0 && (
        <p className="text-center text-xs text-zinc-500 font-medium italic py-6">
          Dosiahli ste koniec nástenky.
        </p>
      )}
    </div>
  );
}

export default PostList;
