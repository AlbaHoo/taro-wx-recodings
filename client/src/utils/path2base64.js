import Taro from '@tarojs/taro';

function guessImageTypeFromBase64(str) {
  switch(str.charAt(0)) {
    case '/':
      return 'image/jpeg';
    case 'i':
      return 'image/png';
    case 'R':
      return 'image/gif';
    case 'U':
      return 'image/webp';
    case 'Q':
      return 'image/bmp';
    default:
      return null;
  }
}

function getCompleteImageBase64(str) {
  return 'data:' + (guessImageTypeFromBase64(str) || 'image/jpeg') + ';base64,' + str
}

const path2base64 = (path) => {
  const str = Taro.getFileSystemManager().readFileSync(path, "base64")
  return getCompleteImageBase64(str);
}

export default path2base64;
