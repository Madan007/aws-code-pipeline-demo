import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Budget } from "../../lib/constructs/budget";

test("Budget Construct", () => {
  const app = new App();
  const stack = new Stack(app, "Stack");

  new Budget(stack, "Budget", {
    budgetAmount: 1,
    emailAddress: "test@example.com",
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Budgets::Budget", {
    Budget: {
      BudgetLimit: {
        Amount: 1,
        Unit: "USD",
      },
    },
    NotificationsWithSubscribers: [
      {
        Subscribers: [
          {
            Address: "test@example.com",
            // SubscriptionType: "EMAIL",
          },
        ],
      },
    ],
  });
});
