export class DataCatalogManager {
    constructor() {
        this.items = new Map();
    }
    add(item) {
        this.items.set(item.id, item);
    }
    addMany(items) {
        for (const item of items) {
            this.items.set(item.id, item);
        }
    }
    getById(id) {
        return this.items.get(id);
    }
    getAll() {
        return Array.from(this.items.values());
    }
    filter(predicate) {
        return this.getAll().filter(predicate);
    }
    update(id, changes) {
        const existing = this.items.get(id);
        if (!existing) {
            return undefined;
        }
        const updated = { ...existing, ...changes };
        this.items.set(id, updated);
        return updated;
    }
    remove(id) {
        return this.items.delete(id);
    }
    count() {
        return this.items.size;
    }
}
