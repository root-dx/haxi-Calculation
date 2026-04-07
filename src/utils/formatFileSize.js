/**
 * 格式化文件大小 - 自适应存储容量单位转换规范实现
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 * 
 * 规范要点：
 * - B: 不保留小数，整数
 * - KB: 不保留小数，整数（四舍五入）
 * - MB: 保留1位小数
 * - GB/TB/PB: 保留2位小数
 * - 数值和单位之间保留一个空格
 */
export function formatFileSize(bytes) {
  // 异常处理：负数、非数字、空值按 0 处理
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }
  
  if (bytes === 0) {
    return '0 B';
  }

  // 单位定义（二进制进制 1024）
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;
  
  // 计算单位层级
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1
  );
  
  // 计算数值
  const value = bytes / Math.pow(k, i);
  const unit = units[i];
  
  // 根据单位格式化小数位
  switch (unit) {
    case 'B':
      // B: 不保留小数，显示为整数
      return `${Math.round(value)} B`;
    
    case 'KB':
      // KB: 不保留小数，整数（四舍五入）
      return `${Math.round(value)} KB`;
    
    case 'MB':
      // MB: 保留1位小数
      return `${(Math.round(value * 10) / 10).toFixed(1)} MB`;
    
    case 'GB':
    case 'TB':
    case 'PB':
      // GB/TB/PB: 保留2位小数
      return `${(Math.round(value * 100) / 100).toFixed(2)} ${unit}`;
    
    default:
      return `${Math.round(value)} B`;
  }
}
