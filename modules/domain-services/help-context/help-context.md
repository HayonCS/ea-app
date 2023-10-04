# Introduction

The help-context feature allows users/developers to query information 
about different components and abilities in the Test Plan Editor (TPE).
This document covers [How HelpContext Works](#how-it-is-implemented), 
[Where The Wiki Is Sourced](#where-it-is-sourced), 
[Wiki Formatting Reference](#wiki-formatting-reference), and 
[Query Examples](#query-examples).

This document does not contain any information about how the front-end
website uses or presents the help documentation. 

<h1 id="how-it-is-implemented">How HelpContext Works</h1>

This section is set up based upon the roles that participate in 
accessing or providing help information. The roles include: Help Documenter,
Help Requester, and an Automated Handler. 

<h2 id="where-it-is-sourced">Help Documenter (HD)</h2>

The Help Documenter (HD) job is to write the TPE Wiki Page. This wiki page 
is located at:

[TPE Wiki Page](https://dev.azure.com/gentex/gtm_core_software/_wiki/wikis/GTM-Core-Software.wiki/5158/Test-Plan-Editor)

This document is primarily written in Markdown but requires special HTML 
annotations. The special annotations are used to do the following:

* Identification of Help Context Keys.
* Hints that can map different help sections to a type (or multiple types).
* Places where you may want to insert some specific text.

## Help Requester (HR)

The Help Requester (HR) is responsible for making a query to the backend 
web service for help on a specific feature. A specific feature is:

* An actual component that is on the website. 
* Must be visible under some conditions.
* Could be disabled.
* Has a unique string-based name. 
* Can have different behavior based on element type.

Here are some examples of specific features:

Insert Button
: The insert button shows up when a user hovers over an element in the 
  table. It's a visible button that shows up that is used for adding 
  elements to the test plan.
: It's behavior can change based on what element we are trying to add to.
  For example with Groups you would only be able to insert Binding Calls,
  Evaluations, etc. With PartNumbers you can only add Groups, Configurations,
  or Subroutines.

## Automated Handler (AH)

The Automated Handler (AH) is not so much a role as it is the mechanism 
behind taking the wiki document obtained from the Help Documenter (HD)
and providing the means to produce help information to the Help Requester 
when queries are made. The way this feature works is through two adapters:
wiki-document and help-context.

### wiki-document

This adapter is used to obtain the wiki document from "somewhere". Our 
team had discussed the possibility of using the Azure REST API to obtain
this document and monitor it's modification. After some research I found
this was probably not going to work. Therefore it was setup to use git 
and Personal Access Tokens to obtain the wiki page. 

Since this code was structured as an adapter into the hexagonal object
we could easily change this out later. This is the main benefit behind 
using a hexagonal pattern. This is currently also being utilized as a 
way to provide a fake wiki page during testing.

The git version of this adapter stores a cached version of the wiki in 
the `/tmp` directory. It can then do a fetch followed by a diff to check 
if there were any changes applied to the wiki page. If changes have been
applied the code will invalidate all cache entries in regards to the help
context and pull the new document changes into the local file.

### help-context

The help-context adapter blindly consumes the wiki page document contents
and parses it out into a dictionary. The dictionary is keyed by the 
==help context key==. The "help context key" is a unique string that maps
to help information. This may sound familiar as earlier in the document 
it was specified that the Help Documenter (HD) would tag different 
components in the wiki page with the same unique names. This is how the 
two pieces of information are linked. 

Once the dictionary has been put into place it's cached. When the Help 
Requester (HR) does a query it will access the cached dictionary for help 
info, apply some late text processing, and return the HelpContext that 
was requested.

<h1 id="wiki-formatting-reference">Wiki Formatting Reference</h1>

This section will walk through how to format the wiki in order to successfully
map HelpContext keys to help sections. 

## Main Component Mapping

This is the most basic case- the user has a visible component on the screen 
that they want to provide help for. In this example there is going to be a
button called `Party Button`. It would be part of the main page and always
visible. 

In the wiki page, a new section placed appropriately would be:

```
## The Party Button

When this is pressed an order is sent out to have a Pizza Party.
```

In order to start mapping this to a HelpContext, this section of the document
would need a new unique identifier set. To achieve this, use a basic div with 
an id:

```
## The Party Button <div id="PartyButton" />

When this is pressed an order is sent out to have a Pizza Party.
```

This marking does two things:

1. It tags this section with "PartyButton". Any HR that queries for the HelpContext
   "PartyButton" will now obtain all of the information that is under this section 
   of the wiki.
2. Users can now navigate to the Wiki Page url using "PartyButton" as part of the 
   URL. For example:

`https://dev.azure.com/gentex/gtm_core_software/_wiki/wikis/GTM-Core-Software.wiki/5158/Test-Plan-Editor#PartyButton`

   That would automatically navigate to the wiki page to the PartyButton section. 
   This feature will be useful later.

## Subsections for Specific Types

Building upon the last example, "The Party Button" does different things when 
the user has focused on Evaluations versus BindingCalls. The example wiki could 
look like this:

```
## The Party Button <div id="PartyButton" />

When this is pressed an order is sent out to have a Pizza Party.

### Evaluation Parties

Having some fun with evaluations!

### BindingCall Parties

How are these even a thing?
```

Each variant of the Party Button has its own section. To help the Automated 
Handler each section can be tagged with the types they would be associated with:

```
## The Party Button <div id="PartyButton" />

When this is pressed an order is sent out to have a Pizza Party.

### Evaluation Parties <!-- type is evaluation -->

Having some fun with evaluations!

### BindingCall Parties <!-- type is bindingCall -->

How are these even a thing?
```

Each subsection that has a type associated with it would be tagged with:

```html
<!-- type is XXX -->
```

Where XXX is the type name identifier that is used inside of the client 
API. This structure is an HTML comment and thus does not show up in the 
rendered markdown wiki. Multiple types can be tagged on a singular element:

```html
<!-- type is bindingCall --> <!-- type is evaluation --> <!-- type is group -->
```
## Assisted Actions

The idea behind assisted actions are to provide a simplified-obvious way 
to guide a user to trigger an action in the app. An example that exists in 
the current wiki page is the "InsertElementButton". The button produces a 
menu dropdown that gives the user a choice of what type of element to insert.

To add a variety of different actions a table is used to do this mapping:

```markdown
## Inserting Elements <div id="InsertElementButton" />

Description of the button that pops the menu up. 

### Adding to Part Numbers <!-- type is universalPartNumber -->

When clicking InsertElementButton on a PartNumber the user can add Groups, Configurations, Subroutines, and Measurements. 

| Button | Description   |
|--------|---------------|
| Cfg    | Add the Configuration element to PartNumber <!-- id -->. Only one can be added per PartNumber.|
| Gr     | Adds a Group to the top of PartNumber <!-- id -->. |
| Msr    | Adds a Measurement to the top of PartNumber <!-- id -->. |
| Sub    | Adds a Subroutine to the top of PartNumber <!-- id -->. |
```

Notice the `<!-- id -->` part of the text; this will replace that tag with 
the id that was passed in through the clues. 

<h1 id="query-examples">Query Examples</h1>

The basic format of the query for the HelpContext is:

```graphql
query {
  helpInformation(context:{
    key: "UniqueKeyName", 
    clues:[]
}) {
    key
    titleText
    body {
      helpType
      title
      text
    }
  }
}
```

Here's an example with some additional clues added:

```graphql
query {
  helpInformation(context:{
    key: "InsertElementButton", 
    clues:[{name:"id", value: "group1"}, {name: "type", value:"group"}]
}) {
    key
    titleText
    body {
      helpType
      title
      text
    }
  }
}
```

