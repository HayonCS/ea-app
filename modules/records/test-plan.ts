import * as DateTimeIso from "core/date-time-iso";
import * as DataLoader from "dataloader";
import * as _ from "lodash-es";
import * as stringify from "json-stable-stringify";
import { ElementRecord, TestPlanRecord } from "records/core";
import { Flavor } from "helpers";
import { RepositoryBase } from "records/core";
import { loaderOf } from "atomic-object/records/knex";
import {
  SemanticVersion,
  TestPlanSearchResult,
} from "graphql-api/server-types.gen";
import {
  getStationPrefixesForTesterType,
  TesterType,
} from "helpers/station-prefix";

export type TestPlanID = Flavor<number, "TestPlan id">;

export type TestPlanCreationResponse = {
  TestPlanID: Number;
  ReturnCode: Number;
  Message?: string;
};

export interface UnsavedTestPlanRecord {
  Revision: number;
  Name: string;
  RevisionLabel: string;
  SoftwareVersion: string;
  Visible: boolean;
}

export interface SavedTestPlanRecord extends UnsavedTestPlanRecord {
  TestPlanID: TestPlanID;
}

export const findSpecificRevision = (
  orderedTestPlans: Array<{
    TestPlanID: number;
    Name: string;
    Revision: number;
  }>,
  testPlanName: string,
  revisionNumber?: number | null
) => {
  if (orderedTestPlans && orderedTestPlans.length > 0) {
    return revisionNumber
      ? orderedTestPlans.find(
          (testPlan) =>
            testPlan.Revision === revisionNumber &&
            testPlan.Name == testPlanName
        ) || null
      : orderedTestPlans.find((testPlan) => testPlan.Name === testPlanName) ||
          null;
  }

  return null;
};

type TestPlanRevisionRow = {
  RevNumber: number;
  LastEditor: string;
  LastEdit: any;
  RevLabel: string;
  LogMessage?: string;
};

type TestPlanLibraryEntry = {
  PlanTitle: string;
  Type: String;
  Version: number;
  LastEditor: string;
  LastEdit: any;
  RevLabel: string;
};

export class TestPlanRecordRepository extends RepositoryBase(TestPlanRecord) {
  forElement = loaderOf(this).owning(ElementRecord, "TestPlanID");
  findMany = loaderOf(this).findManyByColumns(["Name"]);
  findRevision = new DataLoader<
    { testPlanName: string; revisionNumber?: number | null },
    number | null
  >(
    async (args) => {
      const records: Array<{
        TestPlanID: number;
        Name: string;
        Revision: number;
      }> = await this.db("TestPlans")
        .select("TestPlanID", "Name", "Revision")
        .whereIn(
          "Name",
          args.map((arg) => arg.testPlanName)
        )
        .orderBy("Revision", "desc");

      const byTestPlanName = _.groupBy(records, "Name");
      return args.map((arg) => {
        const specificRevision = findSpecificRevision(
          byTestPlanName[arg.testPlanName],
          arg.testPlanName,
          arg.revisionNumber
        );

        if (specificRevision) {
          return specificRevision.TestPlanID;
        }

        return null;
      });
    },
    { cacheKeyFn: stringify as any }
  );

  findByName = new DataLoader<
    { name_in: Array<string> },
    Array<SavedTestPlanRecord>
  >(
    async (args) => {
      const names = _.flatten(args.map((arg) => arg.name_in));

      const records = await this.table().whereIn("Name", names);

      const grouped = _.groupBy<SavedTestPlanRecord>(records, "Name");

      return args.map((arg) =>
        _.flatten(arg.name_in.map((name) => grouped[name]))
      );
    },
    {
      cacheKeyFn: stringify as any,
    }
  );

  async testPlanLatestRevision(testPlanName: string): Promise<number | null> {
    const latestRev: Array<{
      RevNumber: number;
    }> = await this.db.raw(`
    SELECT MAX( Revision ) AS RevNumber from TestPlans WHERE TestPlans.Name = '${testPlanName}'
    `);

    if (latestRev.length !== 0) {
      const revNumber = latestRev[0].RevNumber;
      return revNumber;
    }

    return null;
  }

  async testPlanRevisions(
    testPlanName: string
  ): Promise<Array<TestPlanRevisionRow>> {
    const result: Array<TestPlanRevisionRow> = await this.db.raw(`
    SELECT a.RevNumber, a.LastEditor, a.LastEdit, a.RevLabel, a.LogMessage   
    FROM (   
      SELECT 
        TestPlans.Name AS TestPlanName, 
        TestPlans.Revision AS RevNumber,
        TestPlans.RevisionLabel AS RevLabel,
        CAST(Logs.Message AS VARCHAR(1000)) AS LogMessage,
        Logs.TimeDateStamp AS LastEdit,
        Users.Name AS LastEditor
      FROM TestPlans
        INNER JOIN Logs ON Logs.TestPlanID = TestPlans.TestPlanID   
        INNER JOIN Users ON Users.UserID = Logs.UserID ) a   
      WHERE a.TestPlanName = '${testPlanName}'
      ORDER BY a.RevNumber DESC
    `);

    return result.map((row: TestPlanRevisionRow) => {
      const modificationTime = DateTimeIso.toIsoDateTime(
        new Date(row.LastEdit)
      );

      return { ...row, LastEdit: modificationTime };
    });
  }

  async testPlanRevision(
    testPlanName: string,
    testPlanRev: number
  ): Promise<TestPlanRevisionRow | null> {
    const result: Array<TestPlanRevisionRow> = await this.db.raw(`
    SELECT a.RevNumber, a.LastEditor, a.LastEdit, a.RevLabel, a.LogMessage   
    FROM (   
      SELECT 
        TestPlans.Name AS TestPlanName, 
        TestPlans.Revision AS RevNumber,
        TestPlans.RevisionLabel AS RevLabel,
        Logs.Message AS LogMessage,
        Logs.TimeDateStamp AS LastEdit,
        Users.Name AS LastEditor
      FROM TestPlans
        INNER JOIN Logs ON Logs.TestPlanID = TestPlans.TestPlanID   
        INNER JOIN Users ON Users.UserID = Logs.UserID ) a   
      WHERE a.TestPlanName = '${testPlanName}' 
      AND a.RevNumber = '${testPlanRev}'
    `);

    if (result.length !== 0) {
      const modificationTime = DateTimeIso.toIsoDateTime(
        new Date(result[0].LastEdit)
      );

      return { ...result[0], LastEdit: modificationTime };
    }

    return null;
  }

  async testPlanLibrary(
    domain: string,
    includeHidden?: boolean
  ): Promise<Array<TestPlanLibraryEntry>> {
    const result: Array<TestPlanLibraryEntry> = includeHidden
      ? await this.db.raw(`
    SELECT
      "LatestTestPlans"."Name" AS "PlanTitle",
      "TestPlans"."Revision" AS "Version",
      "Users"."Name" AS "LastEditor",
      "Logs"."TimeDateStamp" AS "LastEdit",
      "TestPlans"."RevisionLabel" AS "RevLabel"
    FROM 
    (
      SELECT       
        "TestPlans"."Name",
           MAX("TestPlans"."TestPlanID") as "TestPlanID"          
              FROM TestPlans     
      GROUP BY
        "TestPlans"."Name"
   
    ) "LatestTestPlans"
    JOIN "TestPlans" ON "TestPlans"."TestPlanID" = "LatestTestPlans"."TestPlanID"
    JOIN "Logs" ON "Logs"."TestPlanID" = "LatestTestPlans"."TestPlanID"
    JOIN "Users" ON "Users".UserID = "Logs"."UserID"
    ORDER BY
       "LatestTestPlans"."Name"
    `)
      : await this.db.raw(`
    SELECT
      "LatestTestPlans"."Name" AS "PlanTitle",
      "TestPlans"."Revision" AS "Version",
      "Users"."Name" AS "LastEditor",
      "Logs"."TimeDateStamp" AS "LastEdit",
      "TestPlans"."RevisionLabel" AS "RevLabel"
    FROM 
    (
      SELECT       
        "TestPlans"."Name",
           MAX("TestPlans"."TestPlanID") as "TestPlanID"          
              FROM TestPlans     
                WHERE
                    "TestPlans"."Visible" = 1
      GROUP BY
        "TestPlans"."Name"
   
    ) "LatestTestPlans"
    JOIN "TestPlans" ON "TestPlans"."TestPlanID" = "LatestTestPlans"."TestPlanID"
    JOIN "Logs" ON "Logs"."TestPlanID" = "LatestTestPlans"."TestPlanID"
    JOIN "Users" ON "Users".UserID = "Logs"."UserID"
    ORDER BY
       "LatestTestPlans"."Name"
    `);

    return result.map((row: TestPlanLibraryEntry) => {
      const modificationTime = DateTimeIso.toIsoDateTime(
        new Date(row.LastEdit)
      );

      return { ...row, Type: domain, LastEdit: modificationTime };
    });
  }

  async createTestPlan(
    testPlanName: string,
    userName: string,
    softwareVersion: string
  ): Promise<TestPlanCreationResponse> {
    let creationResponse: TestPlanCreationResponse = {
      TestPlanID: -1,
      ReturnCode: -1,
    };

    const response: Array<{ "": Array<Number> }> = await this.db
      .raw(
        `DECLARE @testPlanID int;DECLARE @returnCode int;EXEC @returnCode = sp_NewTestPlan "${userName}", "${softwareVersion}", "${testPlanName}", @testPlanID = @testPlanID OUTPUT;SELECT @testPlanID,@returnCode`
      )
      .catch((error) => {
        const err = JSON.stringify(error);
        creationResponse.Message = err;
        return creationResponse;
      });

    if (response) {
      if (response.length > 0) {
        if (response[0][""].length > 0) {
          creationResponse.TestPlanID = response[0][""][0];
          creationResponse.ReturnCode = response[0][""][1];
          creationResponse.Message = "The test plan was created successfully.";
        }
      }
    }
    return creationResponse;
  }

  async searchForTestPlanByLibrary(
    libraryName: string,
    version?: SemanticVersion
  ): Promise<Array<TestPlanSearchResult>> {
    const response: {
      Name: string;
      Revision: number;
      RevisionLabel: string;
      PropertyValue: string;
    }[] = await this.db.raw(`
    
    SELECT TestPlans.Revision, TestPlans.Name, TestPlans.RevisionLabel, Properties.Value as PropertyValue FROM TestPlans INNER JOIN Elements ON TestPlans.TestPlanID = Elements.TestPlanID 
  INNER JOIN Properties ON Elements.ElementID = Properties.ElementID 
  WHERE Properties.Value LIKE '${libraryName}%'
    `);

    if (version) {
      const filtered = response.filter((entry) => {
        return entry.PropertyValue?.match(
          `${version.major ?? "\\d"}.${version.minor ?? "\\d"}.${
            version.patch ?? "\\d"
          }`
        );
      });

      return Object.values(
        filtered.reduce(
          (
            acc: {
              [key: string]: {
                Name: string;
                Revision: number;
                RevisionLabel: string;
              };
            },
            curr
          ) => {
            acc[curr.Name] =
              acc[curr.Name] && acc[curr.Name].Revision > curr.Revision
                ? acc[curr.Name]
                : curr;
            return acc;
          },
          {}
        )
      );
    } else {
      return Object.values(
        response.reduce(
          (
            acc: {
              [key: string]: {
                Name: string;
                Revision: number;
                RevisionLabel: string;
              };
            },
            curr
          ) => {
            acc[curr.Name] =
              acc[curr.Name] && acc[curr.Name].Revision > curr.Revision
                ? acc[curr.Name]
                : curr;
            return acc;
          },
          {}
        )
      );
    }
  }

  async searchForTestPlanByElementDescription(
    description: string
  ): Promise<Array<TestPlanSearchResult>> {
    const response: {
      Revision: number;
      Name: string;
      RevisionLabel: string;
    }[] = await this.db.raw(
      `SELECT DISTINCT TestPlans.Name, TestPlans.Revision,  TestPlans.RevisionLabel FROM TestPlans INNER JOIN Elements on TestPlans.TestPlanID = Elements.TestPlanID WHERE Elements.Description = '${description}'`
    );
    if (response.length > 0) {
      return Object.values(
        response.reduce(
          (
            acc: {
              [key: string]: {
                Name: string;
                Revision: number;
                RevisionLabel: string;
              };
            },
            curr
          ) => {
            acc[curr.Name] =
              acc[curr.Name] && acc[curr.Name].Revision > curr.Revision
                ? acc[curr.Name]
                : curr;
            return acc;
          },
          {}
        )
      );
    }
    return [];
  }

  async searchForTestPlanByTesterType(
    testerType: TesterType,
    includeHidden?: boolean
  ): Promise<Array<TestPlanSearchResult>> {
    const allStations: {
      Description: string;
      Revision: number;
      Name: string;
      RevisionLabel: string;
    }[] = includeHidden
      ? await this.db.raw(
          `SELECT DISTINCT Elements.Description, TestPlans.Revision, TestPlans.Name, TestPlans.RevisionLabel FROM Elements INNER JOIN TestPlans ON TestPlans.TestPlanID = Elements.TestPlanID WHERE Elements.ElementTypeID = 8`
        )
      : await this.db.raw(
          `SELECT DISTINCT Elements.Description, TestPlans.Revision, TestPlans.Name, TestPlans.RevisionLabel FROM Elements INNER JOIN TestPlans ON TestPlans.TestPlanID = Elements.TestPlanID WHERE Elements.ElementTypeID = 8 AND TestPlans.Visible = 1`
        );
    const prefixes = getStationPrefixesForTesterType(testerType);

    if (prefixes) {
      //Find all test plans for the tester type.
      const matches = allStations.filter((element) => {
        let found = false;
        prefixes.forEach((prefix) => {
          if (element.Description?.startsWith(prefix)) {
            found = true;
          }
        });
        return found;
      });

      if (matches.length > 0) {
        //Find unique ones and return them.
        const uniques = _.uniqBy(
          matches,
          (val) => val.Name + val.Revision.toString()
        );

        const sortByName = uniques.sort(
          (a, b) =>
            +(a.Name > b.Name) ||
            +(a.Name === b.Name) - 1 ||
            +(a.Revision > b.Revision) ||
            +(a.Revision === b.Revision) - 1
        );

        return Object.values(
          sortByName.reduce(
            (
              acc: {
                [key: string]: {
                  Name: string;
                  Revision: number;
                  RevisionLabel: string;
                };
              },
              curr
            ) => {
              acc[curr.Name] =
                acc[curr.Name] && acc[curr.Name].Revision > curr.Revision
                  ? acc[curr.Name]
                  : curr;
              return acc;
            },
            {}
          )
        );
      }
    }

    return [];
  }
}
