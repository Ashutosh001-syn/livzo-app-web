export const siteConfig = {
  name: "LivZo",
  description: "A premium live streaming platform for creators and communities.",
  url: "https://livzo.com",
};

export const mainNav = [
  { label: "Discover", href: "/discover" },
  { label: "Categories", href: "/categories" },
  { label: "For creators", href: "/studio" },
] as const;

export const platformNav = [
  { label: "Creator Studio", href: "/studio" },
  { label: "Profile", href: "/profile" },
  { label: "VIP Pass", href: "/vip" },
] as const;
