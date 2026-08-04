# Workstream 4 Architecture — Media Processing & SSRF Hardening

## Overview
WS4 protects the enterprise backend against Server-Side Request Forgery (SSRF), decompression bombs, malicious EXIF metadata payloads, and unauthorized filesystem traversal.

## Key Hardening Measures

### 1. Native SSRF Prevention (`src/core/common/ssrf.js`)
* **IP Range Blocking**: Rejects resolution to loopback (`127.0.0.0/8`, `::1`), private RFC 1918 networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), Link-Local metadata endpoints (`169.254.169.254`), and multicast ranges.
* **DNS Resolution Checks**: Performs async DNS lookup prior to initiating outbound HTTP requests.
* **Redirect Blocking**: Disables automatic HTTP redirects (`redirect: "error"`) to prevent SSRF bypass techniques.
* **Stream Limits**: Restricts total response body size to 10MB to prevent memory exhaustion attacks.

### 2. Media Processing & EXIF Stripping (`src/core/utils/image.js`)
* **Decompression Bomb Protection**: Restricts maximum allowed image dimensions to 4096x4096 pixels.
* **EXIF Sanitization**: Re-encodes uploaded image files through Sharp while stripping metadata headers and auto-orienting pixels.
* **Magic Byte Validation**: Validates image binary formats (`jpeg`, `png`, `webp`) beyond MIME header claims.
* **Filename Sanitization**: Enforces strict UUID-based filename structure to prevent path traversal attempts.
