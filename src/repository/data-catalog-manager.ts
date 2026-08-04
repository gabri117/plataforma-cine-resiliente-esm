export class DataCatalogManager<T extends { id: string | number }> {
    private items: Map<string | number, T> = new Map();

    add(item: T): void {
        this.items.set(item.id, item);
    }

    addMany(items: T[]): void {
        for (const item of items) {
            this.items.set(item.id, item);
        }
    }

    getById(id: string | number): T | undefined {
        return this.items.get(id);
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    filter(predicate: (item: T) => boolean): T[] {
        return this.getAll().filter(predicate);
    }

    update(id: string | number, changes: Partial<T>): T | undefined {
        const existing = this.items.get(id);
        if (!existing) {
            return undefined;
        }
        const updated: T = { ...existing, ...changes };
        this.items.set(id, updated);
        return updated;
    }

    remove(id: string | number): boolean {
        return this.items.delete(id);
    }

    count(): number {
        return this.items.size;
    }
}
