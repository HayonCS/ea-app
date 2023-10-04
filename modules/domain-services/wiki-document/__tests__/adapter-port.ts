import * as Hexagonal from "atomic-object/hexagonal";
import * as DataLoader from "dataloader";
import {
  WikiDocumentPort,
  WikiDocumentPortGenerateInput,
  WikiDocumentPortGenerateOutput,
} from "../wiki-document-port";
import * as stringify from "json-stable-stringify";

const STATIC_WIKI = `
# Introduction
The Test Plan Editor (TPE) is a tool that is used to create and modify test plans. This Wiki page provides instructions on how to use parts of the editor.

## Login Page <div id="LogIn" />

The login page allows users to provide their Gentex credentials to gain access to the site. In some 
dev/qa modes the username is enough; in production it is required to use proper 2FA.

![login-page-1.jpg](/TPE-Web-App/.attachments/login-page-1.jpg)

## Action Bar <div id="ActionBar" />


## Inserting Elements <div id="InsertElementButton" />

This button appears when hovering next to an element line in the table. It will only appear if the 
given element can contain children. The types will pop up in a drop down when this element is 
clicked. 

### Adding to Part Numbers <!-- type is universalPartNumber -->

When clicking InsertElementButton on a PartNumber the user can add Groups, Configurations, Subroutines, and Measurements. 

| Button | Description   |
|--------|---------------|
| Cfg    | Add the Configuration element to PartNumber <!-- id -->. Only one can be added per PartNumber.|
| Gr     | Adds a Group to the top of PartNumber <!-- id -->. |
| Msr    | Adds a Measurement to the top of PartNumber <!-- id -->. |
| Sub    | Adds a Subroutine to the top of PartNumber <!-- id -->. |

### Adding to Groups <!-- type is group -->

When clicking InsertElementButton on a Group the user can add Evaluations, BindingCalls, or sibling Groups. 

| Button | Description   |
|--------|---------------|
| Ev     | Adds a new Evaluation to the end of Group <!-- id -->. |
| Bc     | Adds a new BindingCall to the end of Group <!-- id -->. |
| Gr     | Adds a sibling Group after Group <!-- id -->. |

## Import <div id="ImportButton" />

Used to import a test plan.

## References
`;

export const wikiDocumentStaticAdapter = Hexagonal.adapter({
  port: WikiDocumentPort,
  build: () => {
    return {
      retrieve: new DataLoader<
        WikiDocumentPortGenerateInput,
        WikiDocumentPortGenerateOutput
      >(
        async () => {
          return Promise.resolve([
            {
              wiki: STATIC_WIKI,
            },
          ]);
        },
        {
          cacheKeyFn: stringify,
        }
      ),
    };
  },
});
