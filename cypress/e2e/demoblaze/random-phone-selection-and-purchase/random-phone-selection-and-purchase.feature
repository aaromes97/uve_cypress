  Feature: Random phone selection and complete purchase

  Scenario: Select a random phone, add to cart, and complete purchase
    Given the user is on the homepage
    When the user navigates to the Phones category
    And the user selects a random phone
    Then the product title should match the selected one
    When the user adds the phone to the cart
    And the user navigates to the cart
    And the user clicks on place order
    And the user fills in the order details and confirms the purchase
    Then the user should see the message "THANK YOU FOR YOUR PURCHASE!"