import { EvaluationResolvers } from "graphql-api/server-types.gen";
import { ResolverBoilerPlate } from "./helpers/resolver-boilerplate";

const evaluationResolvers: EvaluationResolvers = {
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

  evaluationType: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.evaluationType
          ? element.evaluationType.value
          : null;
      }
    );
  },

  highLimit: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.highLimit ? element.highLimit.value : null;
      }
    );
  },

  jump: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.jump ? element.jump.value : null;
      }
    );
  },

  jumpOnFail: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.jumpOnFail ? element.jumpOnFail.value : null;
      }
    );
  },

  jumpOnPass: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.jumpOnPass ? element.jumpOnPass.value : null;
      }
    );
  },

  jumpReturn: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.jumpReturn ? element.jumpReturn.value : null;
      }
    );
  },

  loop: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.loop ? element.loop.value : null;
      }
    );
  },

  lowLimit: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.lowLimit ? element.lowLimit.value : null;
      }
    );
  },

  onEvaluate: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.onEvaluate ? element.onEvaluate.value : null;
      }
    );
  },

  retry: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.retry ? element.retry.value : null;
      }
    );
  },

  runtimeResume: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.runtimeResume
          ? element.runtimeResume.value
          : null;
      }
    );
  },

  skipped: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.skipped ? element.skipped.value : null;
      }
    );
  },

  subroutine: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.subroutine ? element.subroutine.value : null;
      }
    );
  },

  target: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.target ? element.target.value : null;
      }
    );
  },

  tolerance: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.tolerance ? element.tolerance.value : null;
      }
    );
  },

  updateTestMetrics: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.updateTestMetrics
          ? element.updateTestMetrics.value
          : null;
      }
    );
  },

  value: async (parent, args, ctx) => {
    return ResolverBoilerPlate(
      "evaluation",
      parent,
      args,
      ctx,
      (element: any) => {
        return element && element.value ? element.value.value : null;
      }
    );
  },
};

export default evaluationResolvers;
