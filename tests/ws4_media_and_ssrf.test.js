import test from "node:test";
import assert from "node:assert/strict";
import { isPrivateIp, validateUrlForSsrf } from "../src/core/common/ssrf.js";
import { assertSafeImageName } from "../src/core/utils/image.js";
import { ValidationError } from "../src/core/common/error.js";

test("WS4 SSRF — Blocks loopback IP range", () => {
    assert.equal(isPrivateIp("127.0.0.1"), true);
    assert.equal(isPrivateIp("::1"), true);
});

test("WS4 SSRF — Blocks private RFC 1918 IPv4 ranges", () => {
    assert.equal(isPrivateIp("10.0.0.1"), true);
    assert.equal(isPrivateIp("172.16.0.1"), true);
    assert.equal(isPrivateIp("172.31.255.255"), true);
    assert.equal(isPrivateIp("192.168.1.100"), true);
});

test("WS4 SSRF — Blocks AWS Cloud Metadata Service (169.254.169.254)", () => {
    assert.equal(isPrivateIp("169.254.169.254"), true);
});

test("WS4 SSRF — Allows public IPv4 addresses", () => {
    assert.equal(isPrivateIp("8.8.8.8"), false);
    assert.equal(isPrivateIp("1.1.1.1"), false);
});

test("WS4 SSRF — Rejects non-HTTP/HTTPS protocols", async () => {
    await assert.rejects(
        async () => {
            await validateUrlForSsrf("file:///etc/passwd");
        },
        /SSRF Validation failed/
    );
});

test("WS4 Image — assertSafeImageName validates UUID filename formats", () => {
    const validName = "12345678-1234-1234-1234-123456789abc.jpg";
    assert.doesNotThrow(() => assertSafeImageName(validName));

    const invalidName = "../../../etc/passwd";
    assert.throws(() => assertSafeImageName(invalidName), ValidationError);
});
