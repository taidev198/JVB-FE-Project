import { Chip, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import BackupIcon from '@mui/icons-material/Backup';
interface ImageUploaderProps {
  images: File[];
  setImages: (files: File[]) => void;
  existingImages?: { id: number; imageUrl: string }[]; // Mảng đối tượng với id và imageUrl
  removeExistingImage?: (id: number) => void; // Hàm xóa ảnh theo id
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, existingImages = [], removeExistingImage }) => {
  const [newPreviews, setNewPreviews] = useState<string[]>([]); // Chỉ lưu previews của ảnh mới

  useEffect(() => {
    // Chỉ khởi tạo previews của ảnh mới khi `images` thay đổi
    const previews = images.map(file => URL.createObjectURL(file));
    setNewPreviews(previews);
  }, [images]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, 5); // Tối đa 5 file
      setImages(newFiles); // Cập nhật trạng thái `images`
    },
    [images, setImages]
  );

  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      // Nếu là ảnh cũ
      const removedImage = existingImages[index];
      removeExistingImage?.(removedImage.id); // Gọi hàm xóa ảnh đã lưu theo `id`
    } else {
      // Nếu là ảnh mới
      const adjustedIndex = index - existingImages.length;
      const updatedImages = images.filter((_, i) => i !== adjustedIndex);
      setImages(updatedImages); // Cập nhật `images`
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 5,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <label htmlFor="" className="mb-1 block text-sm font-semibold text-gray-700">
        Chọn ảnh
      </label>
      <div
        {...getRootProps({
          className: 'border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer h-20 flex items-center justify-center',
        })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>
            <BackupIcon color="success" fontSize="large" />
            <p>Thả file vào đây...</p>
          </div>
        ) : (
          <div>
            <CloudDownloadIcon color="success" fontSize="large" />
            <p>Kéo thả file vào đây hoặc click để chọn file (tối đa 10MB) (tối đa 5)</p>
          </div>
        )}
      </div>

      {/* Hiển thị ảnh */}
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {existingImages.map((img, index) => (
          <div key={`existing-${img.id}`} className="text-center">
            <img src={img.imageUrl} alt={`Existing ${index + 1}`} className="mx-auto mb-2 h-32 w-32 rounded border object-cover" />
            <Stack>
              <Chip label={`Ảnh đã lưu ${index + 1}`} onDelete={() => handleRemoveImage(index)} />
            </Stack>
          </div>
        ))}

        {newPreviews.map((preview, index) => (
          <div key={`new-${index}`} className="text-center">
            <img src={preview} alt={`New Preview ${index + 1}`} className="mx-auto mb-2 h-32 w-32 rounded border object-cover" />
            <Stack>
              <Chip label={images[index]?.name || ''} onDelete={() => handleRemoveImage(existingImages.length + index)} />
            </Stack>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
