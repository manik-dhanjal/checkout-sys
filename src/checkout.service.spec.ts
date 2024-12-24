import { CheckoutService } from './checkout.service';
import { PricingRuleService } from './pricing-rule.service';
import { PricingRulesManagerService } from './pricing-rules-manager.service';
import { ProductService } from './product.service';

describe('Checkout', () => {
	let checkoutService: CheckoutService;
	beforeEach(() => {
		// Initialization of services
		const productService = new ProductService();
		const pricingRuleService = new PricingRuleService();
		const pricingRulesManager = new PricingRulesManagerService(
			productService,
			pricingRuleService
		);
		checkoutService = new CheckoutService(pricingRulesManager, productService);
	});
	it('calculates total for 3-for-2 Apple TVs', () => {
		checkoutService.scan('atv');
		checkoutService.scan('atv');
		checkoutService.scan('atv');
		expect(checkoutService.total()).toBe(219.0);
	});

	it('applies bulk discount for Super iPads', () => {
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		expect(checkoutService.total()).toBe(2499.95);
	});

	it('calculates total with mixed rules', () => {
		checkoutService.scan('atv');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		checkoutService.scan('atv');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		checkoutService.scan('ipd');
		expect(checkoutService.total()).toBe(2718.95);
	});
});
