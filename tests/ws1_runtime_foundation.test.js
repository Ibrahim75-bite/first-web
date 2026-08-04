import test from "node:test";
import assert from "node:assert/strict";
import config from "../src/config/index.js";
import { checkDatabaseHealth } from "../src/core/database/db.js";
import { requestContextStore, requestContextMiddleware } from "../src/core/common/context.js";

test("WS1 Config — Loads default development config safely", () => {
    assert.equal(typeof config.env, "string");
    assert.equal(typeof config.port, "number");
    assert.ok(config.port >= 1024 && config.port <= 65535);
    assert.equal(typeof config.database.max, "number");
    assert.ok(config.database.max >= 1 && config.database.max <= 100);
    assert.equal(typeof config.database.connectionTimeoutMillis, "number");
    assert.equal(typeof config.database.statementTimeoutMillis, "number");
    assert.equal(typeof config.database.queryTimeoutMillis, "number");
});

test("WS1 Config — Freeze prevents dynamic mutation", () => {
    assert.throws(() => {
        // @ts-ignore
        config.port = 9999;
    }, TypeError);
});

test("WS1 Database — Health check structure", async () => {
    const health = await checkDatabaseHealth();
    assert.ok(["UP", "DOWN"].includes(health.status));
    assert.equal(typeof health.latencyMs, "number");
});

test("WS1 Context — Generates UUID when X-Request-Id header is missing", async () => {
    const req = { headers: {} };
    const res = {
        headers: {},
        setHeader(name, val) {
            this.headers[name] = val;
        }
    };

    await new Promise((resolve) => {
        requestContextMiddleware(req, res, () => {
            assert.ok(res.headers["X-Request-Id"]);
            assert.match(res.headers["X-Request-Id"], /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            const ctx = requestContextStore.getStore();
            assert.ok(ctx);
            assert.equal(ctx.requestId, res.headers["X-Request-Id"]);
            resolve();
        });
    });
});

test("WS1 Context — Sanitizes and retains valid supplied X-Request-Id", async () => {
    const validId = "custom-trace-id-123456789";
    const req = { headers: { "x-request-id": validId } };
    const res = { headers: {}, setHeader() {} };

    await new Promise((resolve) => {
        requestContextMiddleware(req, res, () => {
            const ctx = requestContextStore.getStore();
            assert.equal(ctx.requestId, validId);
            resolve();
        });
    });
});
