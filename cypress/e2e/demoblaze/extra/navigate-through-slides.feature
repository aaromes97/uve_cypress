  Feature: Slide navigation in the carousel

  Scenario: User navigates through all slides
    Given the user is on the homepage
    When the user navigates forward through all slides
    Then the user should be on the first slide again