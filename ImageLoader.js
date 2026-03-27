
import path from "path";

export default function ImageLoader({ src }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  const width = 100
  if (basePath && path.isAbsolute(src)) {
    return `${basePath}${src}?width=${width}`;
  }
  return `${src}?width=${width}`
}