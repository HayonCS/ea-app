# Introduction

<style>
table {
	background: white;
	border: 1px solid black;
	border-spacing: 0px;
}
th {
	background: #0d51a6;
	color: white;
	border-spacing: 0px;
}
tr {
	color: black;
	border-spacing: 0px;
} 
tr:nth-child(2n) {
	color: black;
	background: #f6f3e7;
	border-spacing: 0px;
} 
</style>

# Test Plans

This section is about how to navigate to a TestPlan and its elements.

## Test Plan

`/<domain>/<testplan>/<revision>`

| Parameter    | Description                                                     | Example Values                                                                                  |
| :----------- | :-------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `<domain>`   | Description of the database the testplan should be loaded from. | `eng` or `prod`                                                                                 |
| `<testplan>` | The TestPlan name.                                              | 700-0653-000                                                                                    |
| `<revision>` | The Revision.                                                   | `latest` can be used to obtain the current working copy. Otherwise a numeric value (1, 2, 3...) |

Examples:

- http://localhost:3001/eng/700-0653-000/8
- http://localhost:3001/prod/700-0653-000/latest

## Test Plan Element

`/<domain>/<testplan>/<revision>/<element identifier>`

| Parameter              | Description                                                     | Example Values                                                                                  |
| :--------------------- | :-------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `<domain>`             | Description of the database the testplan should be loaded from. | `eng` or `prod`                                                                                 |
| `<testplan>`           | The TestPlan name.                                              | 700-0653-000                                                                                    |
| `<revision>`           | The Revision.                                                   | `latest` can be used to obtain the current working copy. Otherwise a numeric value (1, 2, 3...) |
| `<element identifier>` | The element id.                                                 | `evaluation123`, `bindingCall2`, `managedPartNumber1`                                           |

Examples:

- http://localhost:3001/eng/700-0653-000/10/station4
- http://localhost:3001/prod/700-0653-000/latest/group1

# Analyze

`/analyze/<d1>/<tp1>/<r1>`

This page allows the user to inspect committed versions of test plans.

| Parameter | Description                                           | Example Values                       |
| :-------- | :---------------------------------------------------- | :----------------------------------- |
| `<d1>`    | Description of the database the testplan exists in.   | `eng` or `prod`                      |
| `<tp1>`   | The TestPlan that is being inspected.                 | 700-0653-000                         |
| `<r1>`    | The Revision of the TestPlan that is being inspected. | Numeric value (1, 2, 3...), `latest` |

Example:

- http://localhost:3001/analyze
- http://localhost:3001/analyze/eng/700-0653-000/10

# Changes

`/changes/<d1>/<tp1>/<r1>/<st1>/<pn1>/<d2>/<tp2>/<r2>/<st2>/<pn2>`

This page allows users to continue editing changes that are currently not applied to a revision. The right hand side of the diff view shows the current staged changes while the left hand side shows a different revision of a testplan.

| Parameter | Description                                                                                                                                       | Example Values                                |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------- |
| `<d1>`    | Description of the database the testplan that is being modified is loaded from.                                                                   | `eng` or `prod`                               |
| `<tp1>`   | The TestPlan that is being modified.                                                                                                              | 700-0653-000                                  |
| `<r1>`    | The Revision. This should be the latest working copy revision.                                                                                    | Numeric value (1, 2, 3...)                    |
| `<st1>`   | The station identifier, this is the current station being worked under.                                                                           | `station1`                                    |
| `<pn1>`   | The part number identifier, this the current part number being worked under.                                                                      | `managedPartNumber12`, `universalPartNumber3` |
| `<d2>`    | Description of the database the TestPlan that is being compared against. This populates the read-only side of the diff - currently the left side. | `eng` or `prod`                               |
| `<tp2>`   | The TestPlan that is being compared against.                                                                                                      | 700-0653-000                                  |
| `<r2>`    | The Revision of the TestPlan to compare against.                                                                                                  | Numeric value (1, 2, 3...)                    |
| `<st2>`   | The station identifier to compare against.                                                                                                        | `station1`                                    |
| `<pn2>`   | The part number identifier to compare against.                                                                                                    | `managedPartNumber12`, `universalPartNumber`  |

Example:

- http://localhost:3001/changes/eng/700-0653-000/10/station4/universalPartNumber/eng/700-0653-000/10/station4/universalPartNumber

# Code View

`/code/<d1>/<tp1>/<r1>/<st1>/<pn1>`

This page allows the user to edit the TestPlan in a text-only view.

| Parameter | Description                                         | Example Values                                |
| :-------- | :-------------------------------------------------- | :-------------------------------------------- |
| `<d1>`    | Description of the database the testplan exists in. | `eng` or `prod`                               |
| `<tp1>`   | The TestPlan that is being edited.                  | 700-0653-000                                  |
| `<r1>`    | The Revision of the TestPlan that is being edited.  | Numeric value (1, 2, 3...), `latest`          |
| `<st1>`   | The station identifier.                             | `station1`                                    |
| `<pn1>`   | The part number identifier.                         | `managedPartNumber12`, `universalPartNumber3` |

Example:

- http://localhost:3001/code/eng/700-0653-000/10/station4/universalPartNumber

# Diff View

`/diff/<d1>/<tp1>/<r1>/<st1>/<pn1>/<d2>/<tp2>/<r2>/<st2>/<pn2>`

This page shows diffs between two different TestPlans. This is a read-only view.

| Parameter | Description                                                                                                                                       | Example Values                                |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------- |
| `<d1>`    | Description of the database the testplan exists in.                                                                                               | `eng` or `prod`                               |
| `<tp1>`   | The TestPlan that is loaded into the left hand side of the diff view.                                                                             | 700-0653-000                                  |
| `<r1>`    | The Revision of the TestPlan that is loaded on the left side.                                                                                     | Numeric value (1, 2, 3...)                    |
| `<st1>`   | The station identifier. Can also use underscores if the station is not selected yet.                                                              | `station1`, `_`                               |
| `<pn1>`   | The part number identifier. Can also use underscores if the part number is not selected yet.                                                      | `managedPartNumber12`, `universalPartNumber3` |
| `<d2>`    | Description of the database the TestPlan that is being compared against. This populates the read-only side of the diff - currently the left side. | `eng` or `prod`                               |
| `<tp2>`   | The TestPlan that is being compared against.                                                                                                      | 700-0653-000                                  |
| `<r2>`    | The Revision of the TestPlan to compare against.                                                                                                  | Numeric value (1, 2, 3...)                    |
| `<st2>`   | The station identifier to compare against.                                                                                                        | `station1`                                    |
| `<pn2>`   | The part number identifier to compare against.                                                                                                    | `managedPartNumber12`, `universalPartNumber`  |

Example:

- http://localhost:3001/diff/eng/700-0653-000/9/station4/universalPartNumber/eng/700-0653-000/10/station4/universalPartNumber

# QML Viewer

`/qml/<domain>/<testplan>/<revision>/<station>/<partnumber>`

This page will show users what the equivalent TestPlan in QML looks like. This does not show TestPlans that were used in the legacy TestPlanEditor/TestExecutive tools.

| Parameter      | Description                                                         | Example Values                                                                                  |
| :------------- | :------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------- |
| `<domain>`     | Description of the database the testplan should be loaded from.     | `eng` or `prod`                                                                                 |
| `<testplan>`   | The TestPlan name.                                                  | 700-0653-000                                                                                    |
| `<revision>`   | The Revision.                                                       | `latest` can be used to obtain the current working copy. Otherwise a numeric value (1, 2, 3...) |
| `<station>`    | The station identifier (not the station name: DBG_ST1).             | `station1`                                                                                      |
| `<partnumber>` | The part number identifier(not the part number name: 700-0625-000). | `managedPartNumber12`                                                                           |

Example:

- http://localhost:3001/qml/prod/700-0653-000/latest/station1/managedPartNumber1

# Station Watchers

The server tracks the StationWatchers that are connected. We have two different views that serve different purposes: the dashboard and the functional view.

## Station Watchers (Dashboard)

`/stationwatchers_dashboard`

Example:

- http://localhost:3001/stationwatchers_dashboard

This view will show all of the Station Watchers that are connected. It's a read-only view with the information shown being a summary of what is going on in the system. This could be useful later when we want to monitor the health of our testers.

## Station Watchers (Functional View)

`/stationwatchers`

This view will bring up all of the Station Watchers that are connected and allows users to issue commands to them.

Example:

- http://localhost:3001/stationwatchers

# Health

`/health`

This page shows the current status of the connection to the server. In cases where the connection to the server is lost you can navigate to http://localhost:3001/health to verify the connection has been lost. This display updates by issuing a fetch every 3 seconds and updating if an error was encountered.
