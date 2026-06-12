import { neon } from "@neondatabase/serverless";
import { defaultConfig, PortfolioConfig } from "../data/defaultConfig";

export async function getLiveConfig(): Promise<PortfolioConfig> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("DATABASE_URL environment variable is not defined. Falling back to defaultConfig.");
    return defaultConfig;
  }

  try {
    const sql = neon(dbUrl);
    
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_config (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Fetch config
    const result = await sql`
      SELECT data FROM portfolio_config WHERE key = 'active' LIMIT 1
    `;

    if (result && result.length > 0) {
      // Return parsed data. Ensure it has correct structure.
      return result[0].data as PortfolioConfig;
    }

    // If no row exists, insert the default config and return it
    const configStr = JSON.stringify(defaultConfig);
    await sql`
      INSERT INTO portfolio_config (key, data)
      VALUES ('active', ${configStr}::jsonb)
      ON CONFLICT (key) DO NOTHING
    `;
    return defaultConfig;
  } catch (error) {
    console.error("Database connection or query failed in getLiveConfig:", error);
    return defaultConfig;
  }
}

export async function saveLiveConfig(config: PortfolioConfig): Promise<boolean> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL environment variable is not defined. Cannot save config.");
    return false;
  }

  try {
    const sql = neon(dbUrl);
    
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_config (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    const configStr = JSON.stringify(config);
    // Upsert the config
    await sql`
      INSERT INTO portfolio_config (key, data, updated_at)
      VALUES ('active', ${configStr}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE
      SET data = EXCLUDED.data, updated_at = NOW()
    `;
    return true;
  } catch (error) {
    console.error("Failed to save config to database:", error);
    return false;
  }
}
