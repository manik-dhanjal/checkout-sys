import { Product } from './interfaces/product.interface';

// Product service
export class ProductService {
	// Product catalog
	private catalog: Product[] = [
		{ sku: 'ipd', name: 'Super iPad', price: 549.99 },
		{ sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
		{ sku: 'atv', name: 'Apple TV', price: 109.5 },
		{ sku: 'vga', name: 'VGA adapter', price: 30.0 },
	];

	constructor() {}

	create(product: Product): Product {
		if (this.catalog.find((item) => item.sku === product.sku)) {
			throw new Error(`Product with SKU ${product.sku} already exists.`);
		}
		this.catalog.push(product);
		return product;
	}

	delete(sku: string): void {
		const index = this.catalog.findIndex((item) => item.sku === sku);
		if (index === -1) {
			throw new Error(`Product with SKU ${sku} not found.`);
		}
		this.catalog.splice(index, 1);
	}

	findOne(filter: Partial<Product>): Product | undefined {
		return this.catalog.find((product) => {
			return Object.entries(filter).every(
				([key, value]) => product[key as keyof Product] === value
			);
		});
	}

	find(filter: Partial<Product>): Product[] {
		return this.catalog.filter((product) => {
			return Object.entries(filter).every(
				([key, value]) => product[key as keyof Product] === value
			);
		});
	}

	update(sku: string, updates: Partial<Product>): Product {
		const product = this.findOne({ sku });
		if (!product) {
			throw new Error(`Product with SKU ${sku} not found.`);
		}
		return Object.assign(product, updates);
	}
}
