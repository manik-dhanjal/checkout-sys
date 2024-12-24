import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';

describe('ProductService', () => {
	let productService: ProductService;

	beforeEach(() => {
		productService = new ProductService();
	});

	describe('create()', () => {
		it('should add a new product to the catalog', () => {
			const newProduct: Product = {
				sku: 'xyz',
				name: 'New Product',
				price: 199.99,
			};
			const result = productService.create(newProduct);

			expect(result).toEqual(newProduct);
			expect(productService['catalog']).toContainEqual(newProduct);
		});

		it('should throw an error when product with the same SKU already exists', () => {
			const existingProduct: Product = {
				sku: 'ipd',
				name: 'Super iPad',
				price: 549.99,
			};

			expect(() => productService.create(existingProduct)).toThrowError(
				'Product with SKU ipd already exists.'
			);
		});
	});

	describe('delete()', () => {
		it('should delete an existing product by SKU', () => {
			const skuToDelete = 'ipd';
			productService.delete(skuToDelete);

			expect(productService['catalog']).not.toContainEqual(
				expect.objectContaining({ sku: skuToDelete })
			);
		});

		it('should throw an error if product with given SKU is not found', () => {
			expect(() => productService.delete('nonexistent-sku')).toThrowError(
				'Product with SKU nonexistent-sku not found.'
			);
		});
	});

	describe('findOne()', () => {
		it('should return a product that matches the given filter', () => {
			const result = productService.findOne({ sku: 'mbp' });
			expect(result).toEqual({
				sku: 'mbp',
				name: 'MacBook Pro',
				price: 1399.99,
			});
		});

		it('should return undefined if no product matches the filter', () => {
			const result = productService.findOne({ sku: 'nonexistent-sku' });
			expect(result).toBeUndefined();
		});
	});

	describe('find()', () => {
		it('should return an array of products that match the given filter', () => {
			const result = productService.find({ price: 109.5 });
			expect(result).toEqual([{ sku: 'atv', name: 'Apple TV', price: 109.5 }]);
		});

		it('should return an empty array if no products match the filter', () => {
			const result = productService.find({ name: 'Nonexistent Product' });
			expect(result).toEqual([]);
		});
	});

	describe('update()', () => {
		it('should update an existing product', () => {
			const updates = { price: 199.99 };
			const updatedProduct = productService.update('ipd', updates);

			expect(updatedProduct).toEqual({
				sku: 'ipd',
				name: 'Super iPad',
				price: 199.99,
			});
		});

		it('should throw an error if the product to update is not found', () => {
			const updates = { price: 199.99 };

			expect(() =>
				productService.update('nonexistent-sku', updates)
			).toThrowError('Product with SKU nonexistent-sku not found.');
		});
	});
});
