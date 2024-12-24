
# Pricing Rules CLI

This repository implements a Command-Line Interface (CLI) tool to manage products, pricing rules, and a checkout system. The CLI allows users to scan products, view the cart, apply pricing rules, and place orders. It utilizes a set of services to manage products, pricing rules, and checkout logic.

## Features

- **Scan Products**: Add products to the cart by their SKU.
- **View Cart**: Display the current products in the cart.
- **View Total**: Calculate the total price of products in the cart.
- **Place Order**: Complete the order and clear the cart.
- **Add Pricing Rules**: Apply a pricing rule to a product (e.g., "Three for Two", "Bulk Discount").
- **Remove Pricing Rules**: Remove a pricing rule from a product.
- **List Pricing Rules**: View the current available pricing rules.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/manik-dhanjal/checkout-sys.git
   ```

2. Navigate to the project directory:

   ```bash
   cd checkout-sys
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To start the CLI application, simply run:

```bash
npm start
```

This will open the CLI prompt where you can enter the following commands:

### Available Commands

- `scan <sku>`: Add a product to the cart.
- `cart`: View the current cart.
- `total`: View the total price of the cart.
- `place_order`: Place the order and clear the cart.
- `add_rule <sku> <rule_name>`: Add a pricing rule to a product.
- `remove_rule <sku>`: Remove a pricing rule from a product.
- `list_rules`: List all pricing rules.
- `exit`: Exit the application.

### Example Workflow

1. **Scan Products**:
   - Command: `scan ipd`
   - Output: `Product with SKU 'ipd' added to the cart.`

2. **View Cart**:
   - Command: `cart`
   - Output: `Current cart: ['ipd']`

3. **Add a Pricing Rule**:
   - Command: `add_rule ipd BULK_DISCOUNT`
   - Output: `Rule 'BULK_DISCOUNT' added successfully for product ipd.`

4. **Place Order**:
   - Command: `place_order`
   - Output: `Order placed: Order placed successfully!`

## Services

### `ProductService`
- Manages the product catalog, including adding, deleting, finding, and updating products.

### `PricingRuleService`
- Handles the logic for applying pricing rules like "Three for Two" and "Bulk Discount".

### `PricingRulesManagerService`
- Manages the application and removal of pricing rules to products.

### `CheckoutService`
- Manages the shopping cart, including scanning products, calculating total price, and placing orders.

## Tests

Unit tests are implemented using Jest. To run the tests, use the following command:

```bash
npm test
```

### Test Coverage

The tests cover:

- Command handling in the CLI.
- Service interactions, including adding/removing products, applying pricing rules, and calculating totals.
- Error handling for invalid commands and scenarios.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
