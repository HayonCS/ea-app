import {
  Domain,
  Revision,
  TestPlanResolvers,
} from "graphql-api/server-types.gen";
// import { RepositoriesPort } from "records";

import { SavedTestPlanRecord } from "records/test-plan";

export type MinimalTestPlan = Omit<SavedTestPlanRecord, "TestPlanID"> & {
  id: string;
  domain: Domain;
};

export type MinimalTestPlanRevision = Revision;

const testPlanResolvers: TestPlanResolvers = {
  id: (parent) => {
    return parent.id;
  },

  name: (parent) => {
    return parent.Name;
  },

  revision: (parent) => {
    return {
      revisionNumber: parent.Revision,
      label: parent.RevisionLabel,
    };
  },

  configurationData: async (parent) => {
    return {
      name: parent.Name,
    };
  },

  tests: async () => {
    // const [domain, testPlanName, revisionNumber] = parent.id.split(":");

    // const testPlanDocument = await ctx.testPlanDocument.find.load({
    //   domain: domain as any,
    //   testPlanName,
    //   revisionNumber: Number.parseInt(revisionNumber),
    // });

    // if (!testPlanDocument) {
    //   return null;
    // }

    // const testsElement = testPlanDocument.document.elements["tests"];
    // if (!testsElement) {
    //   return null;
    // }

    // const id = `${domain}:${testPlanName}:${revisionNumber}:tests`;

    // return {
    //   ...testsElement,
    //   id,
    // };
    return {};
  },

  document: async () => {
    // const doc = await ctx.testPlanDocument.find.load({
    //   domain: parent.domain,
    //   testPlanName: parent.Name,
    //   revisionNumber: parent.Revision,
    // });

    // return doc ? doc.document : null;
    return null;
  },

  metadata: async () => {
    // const doc = await ctx.testPlanDocument.find.load({
    //   domain: parent.domain,
    //   testPlanName: parent.Name,
    //   revisionNumber: parent.Revision,
    // });

    // const latestTestPlanRevision = await ctx
    //   .get(RepositoriesPort)
    //   .domain(parent.domain, async (domainRepos) => {
    //     return await domainRepos.testPlans.testPlanLatestRevision(parent.Name);
    //   });

    // const revisionLatest =
    //   doc !== null &&
    //   doc.metadata.revisionNumber !== null &&
    //   latestTestPlanRevision !== null &&
    //   doc.metadata.revisionNumber === latestTestPlanRevision;

    // return doc ? { ...doc.metadata, revisionLatest } : null;
    return null;
  },

  // configuration: (parent, args, ctx) =>
  //   ctx.testPlanConfiguration.find.load({
  //     domain: parent.domain,
  //     testPlanName: parent.Name,
  //     revisionNumber: parent.Revision,
  //   }),
};

export default testPlanResolvers;
