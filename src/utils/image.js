// 图片处理工具函数

/**
 * 将 File 对象转换为 base64 字符串
 * @param {File} file - 图片文件
 * @returns {Promise<string>} base64 字符串
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 检查是否是图片文件
 * @param {File} file - 文件对象
 * @returns {boolean}
 */
export function isImageFile(file) {
  return file.type.startsWith('image/');
}

/**
 * 验证图片大小（默认最大 5MB）
 * @param {File} file - 文件对象
 * @param {number} maxSizeMB - 最大大小（MB）
 * @returns {boolean}
 */
export function validateImageSize(file, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}
