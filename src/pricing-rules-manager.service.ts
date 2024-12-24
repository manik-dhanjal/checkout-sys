import { PricingRuleName } from './enums/pricing-rule-name.enum';
import { PricingRuleService } from './pricing-rule.service';
import { ProductService } from './product.service';

const initialProductRules = {
	atv: PricingRuleName.THREE_FOR_TOW,
	ipd: PricingRuleName.BULK_DISCOUNT,
};

// Query-based Pricing Rules Manager
export class PricingRulesManagerService {
	constructor(
		private readonly productService: ProductService,
		private readonly pricingRuleService: PricingRuleService
	) {}
	private productRule: Record<string, PricingRuleName> = {
		...initialProductRules,
	};

	addRule(sku: string, rule: PricingRuleName): void {
		const product = this.productService.findOne({ sku });
		if (!product) {
			throw new Error(`${sku} is not a valid product SKU`);
		}
		if (!Object.values(PricingRuleName).includes(rule)) {
			throw new Error(`${rule} is not a valid Pricing Rule`);
		}
		this.productRule[sku] = rule;
	}

	removeRule(sku: string): void {
		const product = this.productService.findOne({ sku });
		if (!product) {
			throw new Error(`${sku} is not a valid product SKU`);
		}
		delete this.productRule[sku];
	}

	getRule(sku: string): PricingRuleName | null {
		return this.productRule[sku] || null;
	}

	getRules(): string[] {
		return Array.from(Object.keys(PricingRuleName));
	}

	applyRuleOnProduct(sku: string, quantity: number, price: number): number {
		const rule = this.getRule(sku);
		if (!rule) return price * quantity;

		switch (rule) {
			case PricingRuleName.THREE_FOR_TOW:
				return this.pricingRuleService.threeForTwo(quantity, price);
			case PricingRuleName.BULK_DISCOUNT:
				return this.pricingRuleService.bulkDiscount(quantity, price);
			default:
				return price * quantity;
		}
	}
}
