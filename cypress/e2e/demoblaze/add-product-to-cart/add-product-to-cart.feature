Feature: Add product to the cart

  Scenario: Add a product to the cart and verify actions
    Given the user is on the homepage
    When the user navigates to the Laptops category
    And the user selects a product
    Then the product title should match the selected one
    When the user clicks on the add to cart button
    When the user navigates to the cart
    And the user deletes the product from the cart
    Then the cart should be empty