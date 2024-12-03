import { Chip, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [setImage]
  );

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
  });

  return (
    <div>
      <div
        {...getRootProps({
          className: 'border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer h-20 flex items-center justify-center',
        })}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Thả file vào đây...</p> : <p>Kéo thả một số file vào đây hoặc click để chọn file</p>}
      </div>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="mx-auto mb-2 h-32 w-32 rounded border object-cover" />
          <Stack>
            <Chip label={image?.name || ''} onDelete={handleRemoveImage} className="font-bold" />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
