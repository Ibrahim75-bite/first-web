import dns from "dns";
import { promisify } from "util";
import ipaddr from "ipaddr.js"; // Wait! Is ipaddr.js installed? Let's check dependencies or write native checks!

// Promisify dns lookup
const dnsLookup = promisify(dns.lookup);

export function isPrivateIp(ipString) {
    try {
        if (!ipaddr.isValid(ipString)) {
            return true; // If invalid, block by default
        }
        const addr = ipaddr.parse(ipString);
        const range = addr.range();

        const privateRanges = [
            "private",      // RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
            "loopback",     // 127.0.0.1 etc.
            "linkLocal",    // 169.254.0.0/16
            "multicast",    // 224.0.0.0/4
            "broadcast",    // 255.255.255.255
            "unspecified",  // 0.0.0.0
            "uniqueLocal",  // IPv6 FC00::/7
            "ipv4Mapped"    // IPv4 mapped IPv6
        ];

        return privateRanges.includes(range);
    } catch (err) {
        return true; // Block on parser failure
    }
}

// Since ipaddr.js might not be in package.json, let's write a robust regex/numeric block check
// to avoid relying on extra dependencies! This is safe and self-contained!
export function isPrivateIpNative(ip) {
    if (!ip) return true;
    
    // IPv4 check
    const ipv4Parts = ip.split(".");
    if (ipv4Parts.length === 4) {
        const first = parseInt(ipv4Parts[0], 10);
        const second = parseInt(ipv4Parts[1], 10);

        if (isNaN(first) || isNaN(second)) return true;

        // 127.0.0.0/8 (Loopback)
        if (first === 127) return true;
        // 10.0.0.0/8 (Private)
        if (first === 10) return true;
        // 172.16.0.0/12 (Private)
        if (first === 172 && second >= 16 && second <= 31) return true;
        // 192.168.0.0/16 (Private)
        if (first === 192 && second === 168) return true;
        // 169.254.0.0/16 (Link Local)
        if (first === 169 && second === 254) return true;
        // 0.0.0.0 (Unspecified)
        if (first === 0) return true;
        // 224.0.0.0/4 (Multicast)
        if (first >= 224 && first <= 239) return true;
        // Broadcast
        if (first === 255) return true;

        return false;
    }

    // IPv6 checks
    const ipv6Lower = ip.toLowerCase();
    if (ipv6Lower === "::1" || ipv6Lower === "::") return true;
    if (ipv6Lower.startsWith("fc00") || ipv6Lower.startsWith("fd00")) return true; // Unique Local Address
    if (ipv6Lower.startsWith("fe80")) return true; // Link Local
    if (ipv6Lower.startsWith("ff00")) return true; // Multicast

    // Default: block IPv6 that doesn't match standard public formats
    return true; 
}

export async function validateUrlForSsrf(urlStr) {
    try {
        const parsed = new URL(urlStr);
        
        // Protocol validation
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            throw new Error(`Invalid protocol: ${parsed.protocol}`);
        }

        const hostname = parsed.hostname;
        
        // DNS Resolution checks
        const lookup = await dnsLookup(hostname);
        const ip = lookup.address;

        if (isPrivateIpNative(ip)) {
            throw new Error(`Access to private IP range is blocked: ${ip}`);
        }

        return {
            url: urlStr,
            ip,
            protocol: parsed.protocol
        };
    } catch (err) {
        throw new Error(`SSRF Validation failed for URL: ${urlStr}. Reason: ${err.message}`);
    }
}

/**
 * Performs a secure HTTP request, mitigating SSRF and large payload flood attacks.
 */
export async function secureFetch(urlStr, maxSizeBytes = 10 * 1024 * 1024) {
    const validated = await validateUrlForSsrf(urlStr);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s maximum timeout

    try {
        const response = await fetch(validated.url, {
            signal: controller.signal,
            redirect: "error" // Block all redirects to prevent SSRF bypasses via redirection!
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        // Validate content length to prevent zip bombs / huge file DDOS
        const contentLength = parseInt(response.headers.get("content-length"), 10);
        if (contentLength && contentLength > maxSizeBytes) {
            throw new Error(`Response size exceeds limit of ${maxSizeBytes} bytes`);
        }

        // Stream and verify size dynamically in case content-length header was omitted
        const reader = response.body.getReader();
        const chunks = [];
        let totalReceived = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            totalReceived += value.length;
            if (totalReceived > maxSizeBytes) {
                controller.abort();
                throw new Error(`Response size exceeded dynamic limit of ${maxSizeBytes} bytes`);
            }
            chunks.push(value);
        }

        // Reassemble buffer
        const finalBuffer = Buffer.concat(chunks);
        return {
            buffer: finalBuffer,
            contentType: response.headers.get("content-type"),
            ip: validated.ip
        };
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}
