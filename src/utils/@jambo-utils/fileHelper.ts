export const getFileExtension = (filename:any) => {
  if (filename) return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  
return null;
};

export const getFileName = (fileUrl:any, removeExt = false) => {
  const filename = fileUrl.split('/').pop();

  if (removeExt) {
    return filename
      .split('.')
      .slice(0, -1)
      .join('.');
  }

  
return filename;
};

export const downloadFile = (fileUrl:any) => {
  const downloadFileName = getFileName(fileUrl);
  const link:any = document.createElement('a');

  link.href = fileUrl;
  link.target = '_blank';
  link.setAttribute('download', downloadFileName); //or any other extension
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export const getAssetsUrl = (fileUrl:any) => {
  return `/images/${fileUrl}`;
};
