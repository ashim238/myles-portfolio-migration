export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "Myles Ashitey",
  title: "Product Designer Portfolio",
  description:
    "Portfolio of Myles Ashitey featuring product design case studies, process notes, and playful experiments.",
  headerKicker: "Myles — product designer",
  email: "ashim238@newschool.edu",
  resumeUrl: "/resume",
};

export const navItems: NavItem[] = [
  { label: "01. Work", href: "/#work" },
  { label: "02. About", href: "/#about" },
  { label: "03. Play", href: "/play" },
  { label: "04. Resume", href: siteConfig.resumeUrl },
  { label: "05. E-mail", href: `mailto:${siteConfig.email}` },
];
