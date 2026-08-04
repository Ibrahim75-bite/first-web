import { runMigrations } from "./migrator.js";

export async function initializeDatabase() {
    console.log("Checking database schema migrations...");
    return await runMigrations();
}

