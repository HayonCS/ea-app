# GraphQL Authorization

POST an HTTP request to the `auth/graphql` endpoint with `user_name` and `app_specific_key` query parameters:

```
https://testplaneditor-qa.gentex.com/auth/graphql?user_name=bill.brasky&app_specific_key=sierra117
```

- `user_name`: Must be an active Gentex Employee and already exist in the Users table of the Test Plan database.
- `user_name`: Must have write permissions in the Test Plan database in order to perform Mutations.
- `app_specific_key`: A unique key will be provided to each 3rd party application that wants to access the GraphQL API.
- `app_specific_key`: Treat this like a password. Do not share. Do not store in source code.

## Responses

**`Auth Success`** - Returns a JSON document with a signed auth token:

```
{
    "auth": true,
    "token": "XXXXXX.XXXXXX"
}
```

- Note that this token will expire after 1 day.
- Use this token as the `Bearer` token in the `Authorization` headers for all HTTP requests sent to https://testplaneditor-qa.gentex.com/graphql

**`Auth Failure`** - Returns an HTML error page:

```
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Error</title>
</head>

<body>
	<pre>User not found: &quot;bill.brasky&quot;</pre>
</body>

</html>
```

# GraphQL Queries

Example HTTP `Request Body` for a GraphQL query:

```
query GetServerInfo {
  serverInfo {
    endpoint
    prodDatabaseServer
    prodDatabaseName
    engDatabaseServer
    engDatabaseName
  }
}
```

Example HTTP `Authorization Header` for a GraphQL query:

```
Authorization: "Bearer XXXXXX.XXXXXX"
```

## Responses

**`200 OK`**

```
{
    "data": {
        "serverInfo": {
            "endpoint": "dev",
            "prodDatabaseServer": "q-mssql02.gentex.com",
            "prodDatabaseName": "TestPlan-PROD-QA",
            "engDatabaseServer": "q-mssql02.gentex.com",
            "engDatabaseName": "TestPlan-Eng-QA",
        }
    }
}
```

**`400 Bad Request`**

```
{
    "errors": [
        {
            "message": "Cannot query field \"serverInfo2\" on type \"Query\". Did you mean \"serverInfo\" or \"mesUserInfo\"?",
            "locations": [
                {
                    "line": 2,
                    "column": 3
                }
            ]
        }
    ]
}
```

**`401 Unauthorized`**

- Expired Token

**`500 Internal Server Error`**

- User does not exist in the Users table of the Test Plan database.
- The request is a mutation and the user does not have write permissions in the Users table of the Test Plan database.
- The user is not an active Gentex employee (does not have an employee number in the Users table of the Test Plan database).
