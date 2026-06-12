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
      const data = result[0].data as any;
      let migrated = false;

      // Migrate older keys to new category names
      if (data.press !== undefined && data.films === undefined) {
        data.films = data.press;
        delete data.press;
        migrated = true;
      }
      if (data.speaking !== undefined && data.music === undefined) {
        data.music = data.speaking;
        delete data.speaking;
        migrated = true;
      }
      if (data.podcasts !== undefined && data.fashion === undefined) {
        data.fashion = data.podcasts;
        delete data.podcasts;
        migrated = true;
      }
      if (data.links !== undefined && data.blogs === undefined) {
        data.blogs = data.links;
        delete data.links;
        migrated = true;
      }

      if (migrated) {
        console.log("Migrated portfolio config structure in database to new category fields.");
        try {
          const configStr = JSON.stringify(data);
          await sql`
            INSERT INTO portfolio_config (key, data, updated_at)
            VALUES ('active', ${configStr}::jsonb, NOW())
            ON CONFLICT (key) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
          `;
        } catch (saveError) {
          console.error("Failed to save auto-migrated config to database:", saveError);
        }
      }

      return data as PortfolioConfig;
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
