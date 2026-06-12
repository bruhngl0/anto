import { Metadata } from "next";
import { getLiveConfig } from "../lib/db";
import PortfolioApp from "../components/PortfolioApp";

// Generate SEO metadata dynamically from the active database configuration
export async function generateMetadata(): Promise<Metadata> {
  const config = await getLiveConfig();
  const title = config.artistName;
  const description = config.bio.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${config.artistName} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const config = await getLiveConfig();

  return <PortfolioApp initialConfig={config} />;
}
