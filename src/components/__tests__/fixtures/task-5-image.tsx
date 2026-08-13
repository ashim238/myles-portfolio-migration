import type { ImgHTMLAttributes } from "react";

type Task5ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  priority?: boolean;
  preload?: boolean;
};

export default function Task5Image({
  alt = "",
  src,
  priority,
  preload,
  ...props
}: Task5ImageProps) {
  void priority;
  void preload;
  // The fixture keeps the production component's real source, dimensions,
  // sizes, and alt contract while replacing only Next's image optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={src} alt={alt} />;
}
