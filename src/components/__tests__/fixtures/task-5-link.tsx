import { forwardRef, type AnchorHTMLAttributes } from "react";

type Task5LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

const Task5Link = forwardRef<HTMLAnchorElement, Task5LinkProps>(
  function Task5Link({ href, ...props }, ref) {
    return <a ref={ref} href={href} {...props} />;
  },
);

export default Task5Link;
