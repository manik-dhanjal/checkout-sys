import readline from 'readline';
import { PricingRulesManagerService } from './pricing-rules-manager.service';
import { ProductService } from './product.service';
import { PricingRuleName } from './enums/pricing-rule-name.enum';
import { PricingRuleService } from './pricing-rule.service';
import { CheckoutService } from './checkout.service';
// CLI setup
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Initialization of services
const productService = new ProductService();
const pricingRuleService = new PricingRuleService();
const pricingRulesManager = new PricingRulesManagerService(
	productService,
	pricingRuleService
);
const checkoutService = new CheckoutService(
	pricingRulesManager,
	productService
);

const commands = `
Available commands:
  scan <sku> - Add a product to the cart.
  cart - View the current cart.
  total - View the total price of the cart.
  place_order - Place the order and clear the cart.
  add_rule <sku> <rule_name> - Add a pricing rule to a product.
  remove_rule <sku> <rule_name> - Remove a pricing rule from a product.
  list_rules - List all pricing rules.
  exit - Exit the application.
`;

// CLI logic
function processCommand(input: string): void {
	const [command, ...args] = input.split(' ');
	switch (command) {
		case 'scan':
			checkoutService.scan(args[0]);
			console.log(`Product with SKU '${args[0]}' added to the cart.`);
			break;
		case 'cart':
			console.log('Current cart:', checkoutService.getCart());
			break;
		case 'total':
			console.log(`Total price: $${checkoutService.total()}`);
			break;
		case 'place_order':
			console.log('Order placed:', checkoutService.placeOrder());
			break;
		case 'add_rule': {
			try {
				pricingRulesManager.addRule(args[0], args[1] as PricingRuleName);
				console.log(
					`Rule '${args[1]}' added successfully for product ${args[0]}.`
				);
			} catch (error) {
				console.error((error as Error).message);
			}
			break;
		}
		case 'remove_rule':
			try {
				pricingRulesManager.removeRule(args[0]);
				console.log(`${args[0]} product rule removed`);
			} catch (error) {
				console.error((error as Error).message);
			}
			break;
		case 'list_rules':
			console.log('Current Pricing Rules:');
			console.log(pricingRulesManager.getRules());
			break;
		case 'exit':
			console.log('Exiting...');
			rl.close();
			break;
		default:
			console.log('Unknown command. Please try again.');
	}
}

// Start CLI
console.log('Pricing Rules CLI');
console.log(commands);
rl.on('line', (input) => processCommand(input));
