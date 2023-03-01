interface SizeProp {
  size: number;
}

export const validateSize = (file: SizeProp) => {
  if (!file) return
  if (file.size > 10000000) {
      return true
  } else {
      return false
  }
}

const getExtension = (filename: string) => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

export const isVideo = (filename: string) => {
  const ext = getExtension(filename) || '';
  switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
      case 'webm':
          return true;
  }
  return false;
}

export const isImage = (filename: string) => {
  const ext = getExtension(filename) || ''; 
  switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'jpeg':
          return true;
  }
  return false;
}