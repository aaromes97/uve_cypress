Feature: Responsive Design

  Scenario Outline: Visit the homepage on different screen sizes
    Given I visit the homepage on the "<viewport>"
    Then I should see the login button visible

    Examples:
      | viewport          |
      | Small mobile      |
      | Standard mobile   |
      | Tablet portrait   |
      | Tablet landscape  |
      | Laptop            |
      | Large desktop     |
