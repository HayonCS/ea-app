import { GroupResolvers } from "graphql-api/server-types.gen";
import { excludeNils } from "helpers/nil-helpers";
import { ResolverBoilerPlate } from "./helpers/resolver-boilerplate";

const groupResolvers: GroupResolvers = {
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

  interstitialLoopDelay: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.interstitialLoopDelay
        ? element.interstitialLoopDelay.value
        : null;
    });
  },

  interstitialRetryDelay: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.interstitialRetryDelay
        ? element.interstitialRetryDelay.value
        : null;
    });
  },

  loop: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.loop ? element.loop.value : null;
    });
  },

  postExecuteDelay: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.postExecuteDelay
        ? element.postExecuteDelay.value
        : null;
    });
  },

  preExecuteDelay: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.preExecuteDelay
        ? element.preExecuteDelay.value
        : null;
    });
  },

  retry: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.retry ? element.retry.value : null;
    });
  },

  skipped: async (parent, args, ctx) => {
    return ResolverBoilerPlate("group", parent, args, ctx, (element: any) => {
      return element && element.skipped ? element.skipped.value : null;
    });
  },

  children: async (parent, args, ctx) => {
    const [
      domain,
      testPlanName,
      revisionNumber,
      parentIdentifier,
    ] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });
    const testPlanDocument: any = {};

    if (!testPlanDocument) {
      return [];
    }

    const element = testPlanDocument.document.elements[parentIdentifier];
    if (!element) {
      return [];
    }

    const structuralItem =
      testPlanDocument.document.structure[parentIdentifier];
    if (!structuralItem) {
      return [];
    }

    return excludeNils(
      structuralItem.children.map((childElementIdentifier: any) => {
        const id = `${domain}:${testPlanName}:${revisionNumber}:${childElementIdentifier}`;

        const childElement =
          testPlanDocument.document.elements[childElementIdentifier];
        if (!childElement) {
          return null;
        }

        return {
          id,
          __typename:
            childElement.type === "bindingCall" ? "BindingCall" : "Evaluation",
        };
      })
    );
  },
};

export default groupResolvers;
