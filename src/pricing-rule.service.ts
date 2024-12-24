export class PricingRuleService {
	constructor() {}
	threeForTwo(quantity: number, price: number): number {
		if (quantity >= 3) {
			const twoTotal = Math.floor(quantity / 3) * 2 * price;
			return twoTotal + (quantity % 3) * price;
		}
		return quantity * price;
	}

	bulkDiscount(quantity: number, price: number): number {
		if (quantity < 4) {
			return price * quantity;
		} else {
			return (price - 50) * quantity;
		}
	}
}
