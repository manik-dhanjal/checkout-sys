import { PricingRulesManagerService } from './pricing-rules-manager.service';
import { ProductService } from './product.service';
import { PricingRuleService } from './pricing-rule.service';
import { PricingRuleName } from './enums/pricing-rule-name.enum';

describe('PricingRulesManagerService', () => {
	let pricingRulesManagerService: PricingRulesManagerService;
	let productService: ProductService;
	let pricingRuleService: PricingRuleService;

	const mockProduct = { sku: 'atv', name: 'Apple TV', price: 109.5 };

	beforeEach(() => {
		productService = new ProductService();
		pricingRuleService = new PricingRuleService();
		pricingRulesManagerService = new PricingRulesManagerService(
			productService,
			pricingRuleService
		);
	});

	describe('addRule()', () => {
		it('should add a rule for a valid product SKU', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(mockProduct);
			const sku = 'atv';
			const rule = PricingRuleName.THREE_FOR_TOW;

			pricingRulesManagerService.addRule(sku, rule);

			expect(pricingRulesManagerService['productRule'][sku]).toBe(rule);
		});

		it('should throw an error when adding a rule for an invalid SKU', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(undefined);
			const sku = 'invalid-sku';
			const rule = PricingRuleName.THREE_FOR_TOW;

			expect(() => pricingRulesManagerService.addRule(sku, rule)).toThrow(
				'invalid-sku is not a valid product SKU'
			);
		});

		it('should throw an error when an invalid rule is provided', () => {
			const sku = 'atv';
			const rule = 'INVALID_RULE' as PricingRuleName;

			expect(() => pricingRulesManagerService.addRule(sku, rule)).toThrow(
				'INVALID_RULE is not a valid Pricing Rule'
			);
		});
	});

	describe('removeRule()', () => {
		it('should remove an existing rule', () => {
			pricingRulesManagerService.addRule('atv', PricingRuleName.THREE_FOR_TOW);
			pricingRulesManagerService.removeRule('atv');

			expect(pricingRulesManagerService['productRule']['atv']).toBeUndefined();
		});

		it('should throw an error when removing a rule for an invalid SKU', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(undefined);

			expect(() =>
				pricingRulesManagerService.removeRule('invalid-sku')
			).toThrow('invalid-sku is not a valid product SKU');
		});
	});

	describe('getRule()', () => {
		it('should return the correct pricing rule for an SKU', () => {
			pricingRulesManagerService.addRule('atv', PricingRuleName.THREE_FOR_TOW);

			const rule = pricingRulesManagerService.getRule('atv');
			expect(rule).toBe(PricingRuleName.THREE_FOR_TOW);
		});

		it('should return null if no rule exists for the SKU', () => {
			const rule = pricingRulesManagerService.getRule('nonexistent-sku');
			expect(rule).toBeNull();
		});
	});

	describe('applyRuleOnProduct()', () => {
		it('should apply THREE_FOR_TOW rule and call the pricingRuleService.threeForTwo method', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(mockProduct);
			pricingRulesManagerService.addRule('atv', PricingRuleName.THREE_FOR_TOW);
			jest.spyOn(pricingRuleService, 'bulkDiscount').mockReturnValue(219.0); // Mocked return value
			const spyOnThreeForTwo = jest.spyOn(pricingRuleService, 'threeForTwo');
			const result = pricingRulesManagerService.applyRuleOnProduct(
				'atv',
				3,
				109.5
			);

			expect(result).toBe(219.0);
			expect(spyOnThreeForTwo).toHaveBeenCalledWith(3, 109.5);
		});

		it('should apply BULK_DISCOUNT rule and call the pricingRuleService.bulkDiscount method', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(mockProduct);
			pricingRulesManagerService.addRule('ipd', PricingRuleName.BULK_DISCOUNT);

			jest.spyOn(pricingRuleService, 'bulkDiscount').mockReturnValue(499.99); // Mocked return value

			const result = pricingRulesManagerService.applyRuleOnProduct(
				'ipd',
				5,
				1399.99
			);

			expect(result).toBe(499.99);
			expect(pricingRuleService.bulkDiscount).toHaveBeenCalledWith(5, 1399.99);
		});

		it('should return the original price if no rule is applied', () => {
			jest.spyOn(productService, 'findOne').mockReturnValueOnce(mockProduct);

			const result = pricingRulesManagerService.applyRuleOnProduct(
				'vga',
				1,
				30.0
			);

			expect(result).toBe(30.0);
		});
	});
});
