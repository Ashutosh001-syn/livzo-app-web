import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "@/components/layout/page-frame";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Categories" };
const categories = ["Gaming", "Music", "Talk", "Creative", "Sports"];

export default function CategoriesPage() {
  return <PageFrame><main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-12 sm:py-16"><h1 className="text-[clamp(32px,3vw,48px)] font-semibold text-white">Categories</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Link key={category} href={`/discover?category=${category.toLowerCase()}`} className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"><Card className="p-5 transition-colors hover:border-violet-400/50 sm:p-6"><h2 className="text-xl font-medium text-white">{category}</h2><p className="mt-2 text-sm text-zinc-500">Explore {category.toLowerCase()} live rooms.</p></Card></Link>)}</div></main></PageFrame>;
}
