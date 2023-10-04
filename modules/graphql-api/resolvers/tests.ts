import { TestsResolvers } from "graphql-api/server-types.gen";

const testsResolvers: TestsResolvers = {
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

  description: async () => {
    // const [
    //   domain,
    //   testPlanName,
    //   revisionNumber,
    //   elementIdentifier,
    // ] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });

    // if (!testPlanDocument) {
    //   return "";
    // }

    // const element = testPlanDocument.document.elements[elementIdentifier];
    // if (!element) {
    //   return "";
    // }

    // return element.description || "";
    return "";
  },

  stations: async () => {
    // const [
    //   domain,
    //   testPlanName,
    //   revisionNumber,
    //   parentIdentifier,
    // ] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });

    // if (!testPlanDocument) {
    //   return [];
    // }

    // const element = testPlanDocument.document.elements[parentIdentifier];
    // if (!element) {
    //   return [];
    // }

    // const structuralItem =
    //   testPlanDocument.document.structure[parentIdentifier];
    // if (!structuralItem) {
    //   return [];
    // }

    // return structuralItem.children.map((childElementIdentifier: any) => {
    //   const id = `${domain}:${testPlanName}:${revisionNumber}:${childElementIdentifier}`;

    //   return {
    //     id,
    //   };
    // });
    return [];
  },
};

export default testsResolvers;
