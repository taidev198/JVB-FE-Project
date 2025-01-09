import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Chip, Stack, Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const UploadFile = ({ image, setImage }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      // Do something with the files
      setImage(acceptedFiles[0]);
    },
    [setImage]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div>
      <Tooltip arrow title="Đính kèm tệp">
        <div
          {...getRootProps({
            className: 'hover:bg-slate-100 p-1 rounded-md transition-colors text-center cursor-pointer flex items-center justify-center',
          })}>
          <input {...getInputProps()} />
          <AttachFileIcon />
        </div>
      </Tooltip>

      {/* {image && (
        <Stack className="mt-2">
          <Chip label={image.name} onDelete={() => setImage(null)} className="font-bold" />
        </Stack>
      )} */}
    </div>
  );
};

export default UploadFile;
