import pool from "./db.js";

/**
 * Enterprise Transaction Manager with Post-Commit Deferred Execution Queue.
 * Enforces atomic transaction scope, automated error rollback, resource release,
 * and post-commit side-effect execution (ARCH-01 & ARCH-02).
 */
export async function withTransaction(callback) {
    const client = await pool.connect();
    const postCommitHooks = [];

    const tx = {
        client,
        /**
         * Register a side-effect (e.g. storage file deletion) to be executed
         * ONLY after the database transaction has successfully committed.
         * @param {Function} fn Async or sync function to execute post-commit
         */
        onCommit(fn) {
            if (typeof fn === "function") {
                postCommitHooks.push(fn);
            }
        }
    };

    try {
        await client.query("BEGIN");
        const result = await callback(tx);
        await client.query("COMMIT");

        // Execute post-commit hooks safely after successful commit
        for (const hook of postCommitHooks) {
            try {
                await hook();
            } catch (hookErr) {
                console.error("Post-commit hook execution error:", hookErr.message);
            }
        }

        return result;
    } catch (err) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackErr) {
            console.error("Transaction rollback failed:", rollbackErr.message);
        }
        throw err;
    } finally {
        client.release();
    }
}

export default withTransaction;
