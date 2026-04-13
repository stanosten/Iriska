const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!path) return basePath || "/";
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith(basePath)) return path;
  return path.startsWith("/") ? `${basePath}${path}` : `${basePath}/${path}`;
}
