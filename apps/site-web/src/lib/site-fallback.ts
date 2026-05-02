import {
  SiteConfig,
  SiteDownloadLink,
  SiteFaq,
  SiteFeature,
  SitePost,
  SitePostList,
} from "@/types/site"

const now = Math.floor(Date.now() / 1000)

export const fallbackSiteConfig: SiteConfig = {
  brand_name: "DreamAI",
  app_name: "DreamAI",
  site_title: "DreamAI | AI Video Generator",
  site_subtitle:
    "Create video ideas, motion shots, and commerce-ready storytelling from a single mobile workflow.",
  hero_title: "AI video creation for creators, brands, and merchants.",
  hero_subtitle:
    "DreamAI turns text, images, motion intent, and product storytelling into polished short-form video concepts you can ship faster.",
  primary_cta_text: "Download on the App Store",
  primary_cta_link: "https://apps.apple.com/",
  secondary_cta_text: "Explore Features",
  secondary_cta_link: "/features",
  contact_email: "support@dreamlog.com",
  footer_text: "DreamAI — AI video creation, built by an indie developer.",
  seo_title: "DreamAI | AI Video Generator",
  seo_description:
    "Discover DreamAI's text-to-video, image-to-video, motion control, and commerce video workflows.",
}

export const fallbackSiteFeatures: SiteFeature[] = [
  {
    id: 1,
    key: "text-to-video",
    title: "Text to Video",
    subtitle: "Turn prompts into storyboard-ready motion concepts",
    description:
      "Start with an idea, campaign line, or script fragment and turn it into a visual video concept faster.",
    detail_content:
      "Built for rapid ideation when you need to move from concept to a watchable draft without waiting on a full production cycle.",
    tags: ["Prompting", "Storyboarding", "Fast iteration"],
    sort: 1,
    is_published: true,
  },
  {
    id: 2,
    key: "image-to-video",
    title: "Image to Video",
    subtitle: "Animate product, poster, and scene assets",
    description:
      "Use a still image as the visual anchor, then add motion and atmosphere for launch content, product pages, or social clips.",
    detail_content:
      "A practical fit for brands and merchants who already have visual assets and want to extend them into short-form video.",
    tags: ["Image animation", "Product visuals", "Social content"],
    sort: 2,
    is_published: true,
  },
  {
    id: 3,
    key: "motion-control",
    title: "Motion Control",
    subtitle: "Shape camera energy and subject movement",
    description:
      "Dial in movement direction and motion feel for more expressive clips across lifestyle, product, and creator scenarios.",
    detail_content:
      "Helps teams create footage that feels more intentional than generic animation, especially in ad and creator workflows.",
    tags: ["Camera language", "Motion direction", "Creative control"],
    sort: 3,
    is_published: true,
  },
  {
    id: 4,
    key: "commerce-video",
    title: "Commerce Video Workflow",
    subtitle: "Tell product stories with less production overhead",
    description:
      "Generate clips for product highlights, detail shots, and marketing narratives tuned for conversion-oriented content.",
    detail_content:
      "Mapped to the current backend's commerce and goods-video capabilities so the site copy stays aligned with real product direction.",
    tags: ["E-commerce", "Product storytelling", "Conversion"],
    sort: 4,
    is_published: true,
  },
]

export const fallbackSiteFaqs: SiteFaq[] = [
  {
    id: 1,
    question: "What is DreamAI?",
    answer:
      "DreamAI is an AI video creation product by Dreamlog focused on helping creators and merchants move from idea to video concept faster.",
    sort: 1,
    is_published: true,
  },
  {
    id: 2,
    question: "Can I generate videos on the website?",
    answer:
      "Not in phase one. The website is currently for product discovery, feature education, and app download conversion.",
    sort: 2,
    is_published: true,
  },
  {
    id: 3,
    question: "Which workflows does DreamAI focus on?",
    answer:
      "The current product direction emphasizes text-to-video, image-to-video, motion control, start/end frame control, and commerce-oriented video creation.",
    sort: 3,
    is_published: true,
  },
]

export const fallbackSitePosts: SitePost[] = [
  {
    id: 1,
    title: "Launching the DreamAI brand site",
    slug: "launching-the-dreamai-brand-site",
    summary:
      "Why the first web release focuses on brand clarity, feature education, and app download conversion.",
    content_markdown:
      "# Launching the DreamAI brand site\n\nThe first website release is built to explain the product clearly, showcase core video workflows, and direct users to the App Store.\n\nWe are starting with a lean content system so the team can update features, FAQs, blog posts, and download links without rebuilding the architecture later.",
    status: "published",
    seo_title: "Launching the DreamAI brand site",
    seo_description:
      "A quick look at the goals and structure of the first DreamAI website release.",
    published_at: now,
  },
  {
    id: 2,
    title: "How DreamAI approaches commerce video creation",
    slug: "how-dreamai-approaches-commerce-video-creation",
    summary:
      "A product-oriented look at how DreamAI supports product storytelling and merchant scenarios.",
    content_markdown:
      "# How DreamAI approaches commerce video creation\n\nDreamAI is being positioned not only for creators, but also for merchants who need product storytelling with less production overhead.\n\nThat is why the first website highlights motion, product visuals, and commerce-ready workflows together instead of treating them as separate stories.",
    status: "published",
    seo_title: "How DreamAI approaches commerce video creation",
    seo_description:
      "See how DreamAI frames product storytelling and commerce-oriented video creation.",
    published_at: now - 86400,
  },
]

export const fallbackPostList: SitePostList = {
  items: fallbackSitePosts,
  page: 1,
  page_size: 10,
  total: fallbackSitePosts.length,
}

export const fallbackDownloadLinks: SiteDownloadLink[] = [
  {
    id: 1,
    platform: "ios",
    title: "Download on the App Store",
    url: "https://apps.apple.com/",
    is_enabled: true,
    sort: 1,
  },
]
