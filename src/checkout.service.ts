import { CartItem } from './interfaces/cart.interface';
import { Product } from './interfaces/product.interface';
import { PricingRulesManagerService } from './pricing-rules-manager.service';
import { ProductService } from './product.service';

// Checkout class
export class CheckoutService {
	private cart: Record<string, CartItem> = {};

	constructor(
		private readonly pricingRulesManager: PricingRulesManagerService,
		private readonly productService: ProductService
	) {}

	scan(sku: string): void {
		const product = this.productService.findOne({ sku });
		if (!product) {
			throw new Error(`Product with SKU ${sku} not found.`);
		}
		if (this.cart[sku]) {
			this.cart[sku].quantity++;
		} else {
			this.cart[sku] = {
				...product,
				quantity: 1,
			};
		}
	}

	getCart(): CartItem[] {
		return Object.values(this.cart);
	}

	emptyCart(): void {
		this.cart = {};
	}

	total(): number {
		const total = Object.entries(this.cart).reduce(
			(curTotal: number, [sku, product]) =>
				curTotal +
				this.pricingRulesManager.applyRuleOnProduct(
					sku,
					product.quantity,
					product.price
				),
			0
		);
		return total;
	}

	placeOrder(): { items: Product[]; total: number } {
		const order = {
			items: this.getCart(),
			total: this.total(),
		};
		this.cart = {}; // Clear cart after order placement
		return order;
	}
}
