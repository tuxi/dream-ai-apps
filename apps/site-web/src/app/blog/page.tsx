import { PostGrid } from "@/components/sections/post-grid"
import { getSitePosts } from "@/lib/api/site"

export const metadata = {
  title: "Blog | DreamAI",
}

export default async function BlogPage() {
  const posts = await getSitePosts()

  return <PostGrid posts={posts.items} title="Blog and product notes" />
}
