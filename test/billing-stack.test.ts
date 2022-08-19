import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BillingStack } from "../lib/billing-stack";

test("Billing Stack", () => {
  const app = new App();

  //Create Billing Stack
  const billingStack = new BillingStack(app, "BillingStack", {
    budgetAmount: 1,
    emailAddress: "test@example.com",
  });

  //Prepare the stack for assertions
  const template = Template.fromStack(billingStack);

  //Assert the template matches the snapshot.
  expect(template.toJSON()).toMatchSnapshot();
});
