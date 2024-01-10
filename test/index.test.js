// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Mock the cart-related functions
const { fetchCartData } = require("../src/dataService");
jest.mock('../src/dataService', () => ({
  ...jest.requireActual('../src/dataService'),
  fetchCartData: jest.fn(),
}));

// Mock axios for handling API calls
jest.mock('axios');
const axios = require('axios');

// Product API Testing
describe('Product API Testing', () => {
  let products;

  // Setup: Fetch product data before running the tests
  beforeAll(async () => {
    // Mock axios.get to return dummy data
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Product 1",
          price: 100,
          discountPercentage: 10,
          thumbnail: "product1.jpg",
        },
      ],
    });

    // Fetch product data
    const productData = await fetchProductsData();
    products = setProductsCards(productData);
  });

  // Test Case 1: should return product data with id 1
  test('should return product data with id 1', () => {
    const productId = 1;
    const productWithId1 = products.find((product) => product.id === productId);
    expect(productWithId1).toBeDefined();
  });

  // Test Case 2: should check products.length with limit
  test('should check products.length with limit', () => {
    const limit = 5; // Set your desired limit
    expect(products.length).toBeLessThanOrEqual(limit);
  });

  // Test Case 3: should have at least one product with discount
  test('should have at least one product with discount', () => {
    const discountedProduct = products.find((product) => product.after_discount > 0);
    expect(discountedProduct).toBeDefined();
  });

  // Teardown
  afterAll(() => {
    jest.restoreAllMocks(); // Restore mocked functions to their original implementations
  });
});

// Cart API Testing
describe('Cart API Testing', () => {
  let carts;

  // Setup: Fetch cart data before running the tests
  beforeAll(async () => {
    // Mock the return value of fetchCartData with dummy data
    jest.mock('../src/dataService', () => ({
      ...jest.requireActual('../src/dataService'),
      fetchCartData: jest.fn(),
    }));

    // Mock the return value of fetchCartData with dummy data
    fetchCartData.mockReturnValue(cartData);

    // Call the function that uses fetchCartData (for example, a function that processes cart data)
    carts = await fetchCartData(); // Replace with the actual function
  });

  // Test Case 1: Compare the length of the dummy carts data with the total
  test('should compare the length of carts data with total', () => {
    // Compare the length of the dummy carts data with the processed data
    expect(carts.length).toBe(cartData.length);
  });

  // Teardown
  afterAll(() => {
    
  });
});

// Product Utility Testing
describe('Product Utility Testing', () => {
  let products;

  // Setup: Fetch product data before running the tests
  beforeAll(async () => {
    const productData = await fetchProductsData();
    products = setProductsCards(productData);
  });

// Test Case 1: convertToRupiah - should convert dollars to rupiah correctly
test('should convert dollars to rupiah correctly (positive case)', () => {
  const priceInDollars1 = 100;
  const convertedPrice1 = convertToRupiah(priceInDollars1);
  const expectedFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(priceInDollars1 * 15436);

  expect(convertedPrice1).toEqual(expectedFormat);
});

// Test Case 2: convertToRupiah - should handle zero dollars gracefully
test('should handle zero dollars gracefully', () => {
  const priceInDollars2 = 0;
  const convertedPrice2 = convertToRupiah(priceInDollars2);
  const expectedFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(priceInDollars2 * 15436);

  expect(convertedPrice2).toEqual(expectedFormat);
});

// Test Case 3: countDiscount - should calculate discount correctly
test('should calculate discount correctly (positive case)', () => {
  const price = 200;
  const discountPercentage = 20;
  const discountedAmount = countDiscount(price, discountPercentage);
  // Update the expectation to match the received format
  expect(discountedAmount).toEqual(160);
});

// Test Case 4: countDiscount - should handle zero discount gracefully
test('should handle zero discount gracefully', () => {
  const price = 200;
  const discountPercentage = 0;
  const discountedAmount = countDiscount(price, discountPercentage);
  // Update the expectation to match the received format
  expect(discountedAmount).toEqual(200);
});

  // Test Case 5: setProductsCard - should have a 'title' key in the first product
  test('should have a "title" key in the first product', () => {
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty('title');
  });

  // Teardown
  afterAll(() => {
    jest.restoreAllMocks();
  });
});

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous


// Mocking
// https://jestjs.io/docs/mock-functions


// Setup & Teardown
// https://jestjs.io/docs/setup-teardown
