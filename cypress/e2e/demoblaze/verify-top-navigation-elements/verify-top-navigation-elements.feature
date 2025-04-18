Feature: Verify top navigation elements

  Background:
    Given the user is on the homepage

  Scenario Outline: Navigation element is visible and shows expected content when clicked
    When the user clicks the "<navText>" navigation element
    Then the page should display the expected content for "<navText>"

    Examples:
      | navText   |
      | Home      |
      | Contact   |
      | About us  |
      | Cart      |
      | Log in    |
      | Sign up   |
