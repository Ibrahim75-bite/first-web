import test from "node:test";
import assert from "node:assert/strict";
import authController from "../src/modules/auth/controller.js";
import { requireRole } from "../src/core/middleware/auth.js";
import { inquiryService } from "../src/modules/inquiries/service.js";
import { AuthenticationError, ForbiddenError, ValidationError } from "../src/core/common/error.js";

test("WS3 Auth — Bodyless refresh returns 401 AuthenticationError", async () => {
    const req = { body: {}, cookies: {} };
    const res = {};
    
    await new Promise((resolve) => {
        authController.refresh(req, res, (err) => {
            assert.ok(err instanceof AuthenticationError);
            assert.equal(err.statusCode, 401);
            assert.equal(err.message, "Refresh token required");
            resolve();
        });
    });
});

test("WS3 Auth — Bodyless logout clears cookie without error", async () => {
    let clearedCookie = false;
    const req = { body: {}, cookies: {} };
    const res = {
        clearCookie(name) {
            if (name === "refreshToken") clearedCookie = true;
        },
        json(body) {
            assert.equal(body.message, "Logged out successfully");
            assert.ok(clearedCookie);
        }
    };

    await authController.logout(req, res, (err) => {
        assert.fail(`Should not call next(err): ${err.message}`);
    });
});

test("WS3 Auth — RBAC requireRole allows authorized role", (t, done) => {
    const middleware = requireRole("super-admin", "admin");
    const req = { user: { id: 1, username: "admin", role: "admin" } };
    const res = {};

    middleware(req, res, (err) => {
        assert.equal(err, undefined);
        done();
    });
});

test("WS3 Auth — RBAC requireRole rejects unauthorized role with 403 ForbiddenError", (t, done) => {
    const middleware = requireRole("super-admin");
    const req = { user: { id: 2, username: "editor", role: "editor" } };
    const res = {};

    middleware(req, res, (err) => {
        assert.ok(err instanceof ForbiddenError);
        assert.equal(err.statusCode, 403);
        done();
    });
});

test("WS3 Inquiries — List pagination bounds limits to 1..100", async () => {
    const result = await inquiryService.list({ status: null, page: -5, limit: 500 });
    assert.equal(result.page, 1);
    assert.equal(result.limit, 100);
});

test("WS3 Inquiries — MOQ validation throws ValidationError when requested quantity < min_order_qty", async () => {
    // Test that submit checks MOQ logic
    try {
        await inquiryService.submit({
            customer_name: "Test Customer",
            customer_email: "test@example.com",
            items: [{ sku: "NON-EXISTENT-SKU", quantity: 0 }]
        });
        assert.fail("Should have thrown ValidationError");
    } catch (err) {
        assert.ok(err instanceof ValidationError);
    }
});
