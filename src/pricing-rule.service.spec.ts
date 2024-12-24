import { PricingRuleService } from './pricing-rule.service';

describe('PricingRuleService', () => {
	let pricingRuleService: PricingRuleService;

	beforeEach(() => {
		pricingRuleService = new PricingRuleService();
	});

	describe('threeForTwo', () => {
		it('applies the 3-for-2 rule when quantity is a multiple of 3', () => {
			const result = pricingRuleService.threeForTwo(6, 100);
			expect(result).toBe(400); // 6 items => 4 * 100
		});

		it('applies the 3-for-2 rule and charges the remainder', () => {
			const result = pricingRuleService.threeForTwo(7, 100);
			expect(result).toBe(500); // 6 items => 4 * 100, 1 remaining => +100
		});

		it('does not apply the rule when quantity is less than 3', () => {
			const result = pricingRuleService.threeForTwo(2, 100);
			expect(result).toBe(200); // No rule applied, 2 * 100
		});
	});

	describe('bulkDiscount', () => {
		it('applies a bulk discount when quantity is 4 or more', () => {
			const result = pricingRuleService.bulkDiscount(5, 200);
			expect(result).toBe(750); // (200 - 50) * 5
		});

		it('does not apply a discount when quantity is less than 4', () => {
			const result = pricingRuleService.bulkDiscount(3, 200);
			expect(result).toBe(600); // 3 * 200
		});
	});
});
