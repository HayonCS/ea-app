import { BindingCallResolvers } from "graphql-api/server-types.gen";
import { ResolverBoilerPlate } from "./helpers/resolver-boilerplate";

const bindingCallResolvers: BindingCallResolvers = {
  id: (parent) => {
    return parent.id;
  },

  identifier: (parent) => {
    const [
      domain,
      testPlanName,
      revisionNumber,
      elementIdentifier,
    ] = parent.id.split(":");

    domain;
    testPlanName;
    revisionNumber;

    return elementIdentifier;
  },

  description: async (parent, args, ctx) => {
    const [
      domain,
      testPlanName,
      revisionNumber,
      elementIdentifier,
    ] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });
    const testPlanDocument: any = {};

    if (!testPlanDocument) {
      return "";
    }

    const element = testPlanDocument.document.elements[elementIdentifier];
    if (!element) {
      return "";
    }

    return element.description || "";
  },

  jumpOnError: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "bindingCall",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.jumpOnError
          ? element.jumpOnError.value
          : null;
      }
    );
  },

  method: async (parent, args, ctx) => {
    const [
      domain,
      testPlanName,
      revisionNumber,
      elementIdentifier,
    ] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });
    const testPlanDocument: any = {};

    if (!testPlanDocument) {
      return "";
    }

    const element = testPlanDocument.document.elements[elementIdentifier];
    if (!element) {
      return "";
    }

    if (element.type !== "bindingCall") {
      throw new Error("Element type is not a binding call");
    }

    return element.method ? element.method.value : null;
  },
};

export default bindingCallResolvers;
