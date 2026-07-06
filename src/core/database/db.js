import pg from "pg";
import config from "../../config/index.js";

const { Pool } = pg;

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.name,
    password: config.database.password,
    port: config.database.port,
});

export default pool;
