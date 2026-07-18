export function isWorkPath(pathname: string) {
  return pathname === "/" || pathname === "/work" || pathname.startsWith("/work/");
}
