import { createSHA256, createSM3 } from 'hash-wasm';

/** 单文件上传上限 2GB */
export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

/** 浏览器端：流式计算 SHA-256，支持大文件且不占满内存 */
async function calculateSHA256Streaming(file) {
  const sha256 = await createSHA256();
  sha256.init();

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    sha256.update(new Uint8Array(buffer));
    offset += CHUNK_SIZE;
  }

  return sha256.digest('hex');
}

/**
 * 计算文件的 SHA-256 哈希值（自动选择 Electron 流式或浏览器流式）
 */
export async function calculateSHA256(file) {
  const fileWithPath = file;
  if (typeof window !== 'undefined' && window.electronAPI?.hashFile && fileWithPath.path) {
    const result = await window.electronAPI.hashFile(fileWithPath.path, 'SHA-256');
    if (result != null) return result;
  }
  return calculateSHA256Streaming(file);
}

/** 流式计算 SM3，支持大文件且不占满内存 */
async function calculateSM3Streaming(file) {
  const sm3 = await createSM3();
  sm3.init();

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    sm3.update(new Uint8Array(buffer));
    offset += CHUNK_SIZE;
  }

  return sm3.digest('hex');
}

/**
 * 计算文件的 SM3 哈希值（支持 ≤2GB 大文件流式计算）
 */
export async function calculateSM3(file) {
  return calculateSM3Streaming(file);
}

/**
 * 根据算法类型计算文件哈希值（支持 ≤2GB 单文件，流式计算无性能问题）
 */
export async function calculateHash(file, algorithm) {
  if (algorithm === 'SHA-256') {
    return calculateSHA256(file);
  }
  return calculateSM3(file);
}
