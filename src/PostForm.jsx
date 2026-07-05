import { useState } from 'react';
import ReactQuill from 'react-quill-new';

function PostForm({ onAddPost }) {
  const [editorContent, setEditorContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editorContent.trim() || editorContent === '<p><br></p>') {
      alert('Príspevok nemôže byť prázdny!');
      return;
    }
    onAddPost(editorContent, thumbnailUrl.trim());
    setEditorContent('');
    setThumbnailUrl('');
  };

  return (
    <div className="mb-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-xl p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-4">Vytvoriť nový príspevok</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">URL obrázka (miniatúra)</label>
          <input 
            type="text" 
            placeholder="https://example.com" 
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent transition"
          />
        </div>

        <div className="prose max-w-none">
          <ReactQuill 
            theme="snow" 
            value={editorContent} 
            onChange={setEditorContent}
            placeholder="Čo máte na mysli?" 
            className="bg-white dark:bg-zinc-800 rounded-lg text-black dark:text-white"
          />
        </div>
        
        <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer">
          Publikovať
          </button>
      </form>
    </div>
  );
}

export default PostForm;
