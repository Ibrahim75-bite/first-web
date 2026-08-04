import test from "node:test";
import assert from "node:assert/strict";
import { formatLogEntry, maskSensitiveData } from "../src/core/middleware/logging.js";
import app from "../src/app.js";

test("WS5 Telemetry — Sensitive parameter masking", () => {
    const rawData = {
        username: "admin",
        password: "super-secret-password-123",
        token: "jwt-token-abcd",
        refreshToken: "refresh-token-xyz",
        nested: {
            creditCard: "4111111111111111",
            safeField: "keep-me"
        }
    };

    const masked = maskSensitiveData(rawData);
    assert.equal(masked.username, "admin");
    assert.equal(masked.password, "[REDACTED]");
    assert.equal(masked.token, "[REDACTED]");
    assert.equal(masked.refreshToken, "[REDACTED]");
    assert.equal(masked.nested.creditCard, "[REDACTED]");
    assert.equal(masked.nested.safeField, "keep-me");
});

test("WS5 Telemetry — Structured JSON log format", () => {
    const entryStr = formatLogEntry("INFO", "User logged in", { userId: 42, ip: "127.0.0.1" });
    const parsed = JSON.parse(entryStr);

    assert.equal(parsed.level, "INFO");
    assert.equal(parsed.message, "User logged in");
    assert.equal(parsed.userId, 42);
    assert.equal(parsed.ip, "127.0.0.1");
    assert.ok(parsed.timestamp);
});
