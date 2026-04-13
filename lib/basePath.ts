const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function getRuntimeBasePath(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }

  return `/${segments[0]}`;
}

export function withBasePath(path: string): string {
  const basePath = envBasePath || getRuntimeBasePath();

  if (!path) return basePath || "/";
  if (/^https?:\/\//.test(path)) return path;
  if (!basePath) return path;
  if (path.startsWith(basePath)) return path;
  return path.startsWith("/") ? `${basePath}${path}` : `${basePath}/${path}`;
}
