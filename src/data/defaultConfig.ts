export interface TextItem {
  type: 'text';
  id: string;
  num: string;
  symbol: string;
  name: string;
  category: string;
  url?: string;
}

export interface MediaItem {
  type: 'media';
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
}

export interface EmptyItem {
  type: 'empty';
  id: string;
}

export type GridItem = TextItem | MediaItem | EmptyItem;

export interface PortfolioConfig {
  artistName: string;
  initials: string;
  email: string;
  bio: string;
  press: Array<{ id: string; num: string; name: string; url?: string }>;
  speaking: Array<{ id: string; num: string; name: string; url?: string }>;
  podcasts: Array<{ id: string; num: string; name: string; url?: string }>;
  links: Array<{ id: string; num: string; name: string; url?: string }>;
  gridItems: GridItem[];
}

export const defaultConfig: PortfolioConfig = {
  artistName: "Antoinette Fernandas",
  initials: "Af",
  email: "antoinette@magicfabricblog.com",
  bio: "I started in fashion, cutting patterns, building garments, understanding the body. Over time I moved into emerging technologies, not to leave that world behind but to expand what it could be. The craft background stays with me. It shapes how I approach AI, with the same conviction that making something means leaving something of yourself in it.",
  press: [
    { id: "p1", num: "01", name: "Al Sweden", url: "#" },
    { id: "p2", num: "02", name: "Vogue" },
    { id: "p3", num: "03", name: "Elle" },
    { id: "p4", num: "04", name: "Dezeen", url: "#" },
    { id: "p5", num: "05", name: "Trendland", url: "#" },
    { id: "p6", num: "06", name: "Coveteur", url: "#" },
    { id: "p7", num: "07", name: "Dagens Industri", url: "#" },
    { id: "p8", num: "08", name: "Scandinavian Mind", url: "#" },
    { id: "p9", num: "09", name: "SR / P3 News", url: "#" },
    { id: "p10", num: "10", name: "Visual Atelier 8", url: "#" },
    { id: "p11", num: "11", name: "Women of Wearables" },
    { id: "p12", num: "12", name: "SR / Studio Ett" },
    { id: "p13", num: "13", name: "Blowup Guild", url: "#" },
  ],
  speaking: [
    { id: "s1", num: "01", name: "PI Apparel", url: "#" },
    { id: "s2", num: "02", name: "Hyper Island" },
    { id: "s3", num: "03", name: "H&M Global 3D Forum" },
    { id: "s4", num: "04", name: "Sw. School of Textiles" },
    { id: "s5", num: "05", name: "Board of Innovation", url: "#" },
    { id: "s6", num: "06", name: "HDK / University of Gothenburg", url: "#" },
    { id: "s7", num: "07", name: "FutureGames" },
    { id: "s8", num: "08", name: "Swedish Fashion Council" },
    { id: "s9", num: "09", name: "Gravity Sketch", url: "#" },
  ],
  podcasts: [
    { id: "pod1", num: "01", name: "Scandinavian Mind", url: "#" },
    { id: "pod2", num: "02", name: "Future Squish", url: "#" },
  ],
  links: [
    { id: "l1", num: "01", name: "LinkedIn", url: "#" },
    { id: "l2", num: "02", name: "Magic Fabric", url: "#" },
    { id: "l3", num: "03", name: "Instagram", url: "#" },
  ],
  gridItems: [
    // Row 1
    {
      type: "text",
      id: "g0",
      num: "01",
      symbol: "Se",
      name: "Stockholm, Sweden",
      category: "LOCATION"
    },
    {
      type: "media",
      id: "g1",
      mediaUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Generative Organic Structure"
    },
    {
      type: "media",
      id: "g2",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Green Fluid Dynamic Simulation"
    },
    {
      type: "text",
      id: "g3",
      num: "02",
      symbol: "Fd",
      name: "Fashion Design",
      category: "PRACTICE"
    },
    {
      type: "text",
      id: "g4",
      num: "03",
      symbol: "Ga",
      name: "Generative AI",
      category: "PRACTICE"
    },
    {
      type: "media",
      id: "g5",
      mediaUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Cyberpunk Haute Couture"
    },
    {
      type: "media",
      id: "g6",
      mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Future Human Concept"
    },
    {
      type: "media",
      id: "g7",
      mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Architectural 3D Garment"
    },
    {
      type: "media",
      id: "g8",
      mediaUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Liquid Pearl Gemstone"
    },
    {
      type: "media",
      id: "g9",
      mediaUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Future Flora Render"
    },
    // Row 2
    {
      type: "media",
      id: "g10",
      mediaUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Geothermal Landscapes"
    },
    {
      type: "text",
      id: "g11",
      num: "04",
      symbol: "Cd",
      name: "Creative Direction",
      category: "PRACTICE"
    },
    {
      type: "text",
      id: "g12",
      num: "05",
      symbol: "Et",
      name: "Emerging Tech",
      category: "PRACTICE"
    },
    {
      type: "media",
      id: "g13",
      mediaUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Dynamic Kinetic Form"
    },
    {
      type: "text",
      id: "g14",
      num: "06",
      symbol: "Ma",
      name: "Magic Fabric",
      category: "BLOG",
      url: "https://magicfabricblog.com"
    },
    {
      type: "text",
      id: "g15",
      num: "07",
      symbol: "Sh",
      name: "Shell",
      category: "ARCHIVE · 2009",
      url: "#"
    },
    {
      type: "empty",
      id: "g16"
    },
    {
      type: "text",
      id: "g17",
      num: "09",
      symbol: "Cb",
      name: "Cross-Bearer",
      category: "ARCHIVE · 2011",
      url: "#"
    },
    {
      type: "media",
      id: "g18",
      mediaUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      title: "Avant-Garde Makeup Concept"
    },
    {
      type: "text",
      id: "g19",
      num: "10",
      symbol: "Ft",
      name: "Futures Thinking",
      category: "PRACTICE"
    }
  ]
};
