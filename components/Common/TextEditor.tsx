import dynamic from 'next/dynamic';
import { FC } from 'react';
import 'quill/dist/quill.snow.css'; // Import từ Quill

// Import Quill dynamically để tránh SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  error?: string;
}

const TextEditor: FC<QuillEditorProps> = ({ value, onChange, onBlur, label, error }) => {
  const modules = {
    toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image']],
  };

  return (
    <>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <ReactQuill theme="snow" value={value} onChange={onChange} onBlur={onBlur} modules={modules} placeholder="Nhập mô tả..." className="h-[300px]" />
      {error && <p className="top-full mt-[2px] text-[13px] text-red-500">{error}</p>}
    </>
  );
};

export default TextEditor;
