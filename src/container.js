import pool from "./core/database/db.js";
import cache from "./core/common/cache.js";
import storageService from "./core/common/storage.js";
import auditLogger from "./core/common/audit.js";

import { ProductRepository, productRepository } from "./modules/products/repositories/product.repository.js";
import { VariantRepository, variantRepository } from "./modules/products/repositories/variant.repository.js";
import { TagRepository, tagRepository } from "./modules/products/repositories/tag.repository.js";
import { InquiryRepository, inquiryRepository } from "./modules/inquiries/repository.js";
import { AuthRepository, authRepository } from "./modules/auth/repository.js";

import { ProductService, productService } from "./modules/products/services/product.service.js";
import { VariantService, variantService } from "./modules/products/services/variant.service.js";
import { TagService, tagService } from "./modules/products/services/tag.service.js";
import { InquiryService, inquiryService } from "./modules/inquiries/service.js";
import { AuthService, authService } from "./modules/auth/service.js";
import { ImportService, importService } from "./modules/imports/service.js";

/**
 * Enterprise Application Service Container (DI Composition Root - ARCH-03)
 * Provides centralized dependency registration, lifecycle management, and unit test isolation capabilities.
 */
export class Container {
    constructor() {
        this.services = new Map();

        // Default Infrastructure Registration
        this.register("pool", pool);
        this.register("cache", cache);
        this.register("storage", storageService);
        this.register("auditLogger", auditLogger);

        // Repositories Registration
        this.register("productRepo", productRepository);
        this.register("variantRepo", variantRepository);
        this.register("tagRepo", tagRepository);
        this.register("inquiryRepo", inquiryRepository);
        this.register("authRepo", authRepository);

        // Services Registration
        this.register("productService", productService);
        this.register("variantService", variantService);
        this.register("tagService", tagService);
        this.register("inquiryService", inquiryService);
        this.register("authService", authService);
        this.register("importService", importService);
    }

    register(name, instance) {
        this.services.set(name, instance);
    }

    get(name) {
        if (!this.services.has(name)) {
            throw new Error(`Service '${name}' not found in container registration`);
        }
        return this.services.get(name);
    }

    /**
     * Creates a custom composition root with overridden dependencies (ideal for mock testing).
     */
    createCustomScope(overrides = {}) {
        const customContainer = new Container();
        for (const [key, value] of Object.entries(overrides)) {
            customContainer.register(key, value);
        }
        return customContainer;
    }
}

export const container = new Container();
export default container;
