import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageComponent from './Image';
import ButtonDelete from './ButtonIcon/ButtonDelete';

interface ImageUploaderOneProps {
  image: File | null | string;
  setImage: (file: File | null | string) => void;
}

const ImageUploaderOne: React.FC<ImageUploaderOneProps> = ({ image, setImage }) => {
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

  useEffect(() => {
    if (typeof image === 'string') {
      setPreview(image);
    } else if (image) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    return () => {
      if (preview && typeof image !== 'string') {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, image]);

  return (
    <div className="flex items-center gap-4">
      <div
        className=" w-[160px]"
        {...getRootProps({
          className: 'border rounded-full w-[160px] h-[160px] text-center bg-slate-100 cursor-pointer flex items-center justify-center',
        })}>
        <input {...getInputProps()} />
        {preview ? (
          <ImageComponent src={preview} width={150} height={150} alt="Preview" className="h-full w-full rounded-full object-cover" />
        ) : isDragActive ? (
          <p>Thả file vào đây...</p>
        ) : (
          <AccountCircleIcon sx={{ fontSize: 120 }} color="action" />
        )}
      </div>

      {preview && <ButtonDelete onClick={handleRemoveImage} />}
    </div>
  );
};

export default ImageUploaderOne;

{
  /* <Stack>
  <Chip label={typeof image === 'string' ? 'Current Image' : image?.name || 'No file selected'} onDelete={handleRemoveImage} className="font-bold" />
</Stack>; */
}
