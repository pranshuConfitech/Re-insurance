declare module 'mui-file-dropzone' {
    import type React from 'react';
  
    export interface FileDropzoneProps {
      onChange?: (files: File[]) => void;
      filesLimit?: number;
      acceptedFiles?: string[];
      dropzoneText?: string;
      showPreviews?: boolean;
      showPreviewsInDropzone?: boolean;
      previewText?: string;
    }
  
    export const DropzoneArea: React.FC<FileDropzoneProps>;
  }
  