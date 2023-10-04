import * as bodyParser from "body-parser";
import * as http from "http";
import * as express from "express";
import * as cors from "cors";

let app = express();

// middleware installation
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes.
app.get("/user/:userId", cors(), (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");

  const user1 = JSON.parse(`{
        "employeeId": "69",
        "username": "bill.brasky",
        "firstName": "Bill",
        "lastName": "Brasky",
        "emailAddress": "bill.brasky@gentex.com",
        "roles": ["role1", "role2"],
        "distributionLists": ["list1", "list2"],
        "isServiceAccount": false,
        "pager": "6969"}
        `);

  const user2 = JSON.parse(`{
        "employeeId": "12345",
        "username": "john.smith",
        "firstName": "John",
        "lastName": "Smith",
        "emailAddress": "john.smith@gentex.com",
        "roles": ["role1", "role2"],
        "distributionLists": ["list1", "list2"],
        "isServiceAccount": false,
        "pager": "123456"}
        `);

  const mesUser = JSON.parse(`{
        "employeeId": "42069",
        "username": "patrick.star",
        "firstName": "Patrick",
        "lastName": "Star",
        "emailAddress": "patrick.star@gentex.com",
        "roles": ["Test and Measurement Department", "MESWeb Administrator"],
        "distributionLists": ["list1", "list2"],
        "isServiceAccount": false,
        "pager": "69420"}
        `);

  if (req.params.userId === "bill.brasky") {
    res.send(user1);
  } else if (req.params.userId === "patrick.star") {
    res.send(mesUser);
  } else {
    res.send(user2);
  }
});

app.get("/employees/:employeeNumber", cors(), (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const user1 = JSON.parse(`{
        "employeeNumber": "69",
        "firstName": "Bill",
        "lastName": "Brasky",
        "username": "bill.brasky",
        "email": "bill.brasky@gentex.com",
        "cellPhone": "+16164206969",
        "workPhone": "+16164206969x1337",
        "location": "Centennial South",
        "locationId": "1019",
        "shift": "4",
        "jobTitle": "Software Engineer IX",
        "managerEmployeeNumber": "420",
        "directsEmployeeNumbers": [],
        "allEmployeesEmployeeNumbers": [],
        "level": "0"
      }
        `);

  const user2 = JSON.parse(`{
          "employeeNumber": "12345",
          "firstName": "John",
          "lastName": "Smith",
          "username": "john.smith",
          "email": "john.smith@gentex.com",
          "cellPhone": "+16165551234",
          "workPhone": "+16167721590x1234",
          "location": "Centennial East",
          "locationId": "1019",
          "shift": "1",
          "jobTitle": "Software Engineer II",
          "managerEmployeeNumber": "69",
          "directsEmployeeNumbers": [],
          "allEmployeesEmployeeNumbers": [],
          "level": "0"
        }
          `);

  if (req.params.employeeNumber === "69") {
    res.send(user1);
  } else {
    res.send(user2);
  }
});

app.get("/employees", cors(), (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const user1 = JSON.parse(`[{
        "employeeNumber": "69",
        "firstName": "Bill",
        "lastName": "Brasky",
        "username": "bill.brasky",
        "email": "bill.brasky@gentex.com",
        "cellPhone": "+16164206969",
        "workPhone": "+16164206969x1337",
        "location": "Centennial South",
        "locationId": "1019",
        "shift": "4",
        "jobTitle": "Software Engineer IX",
        "managerEmployeeNumber": "420",
        "directsEmployeeNumbers": [],
        "allEmployeesEmployeeNumbers": [],
        "level": "0"
      }]
        `);

  const user2 = JSON.parse(`[{
          "employeeNumber": "12345",
          "firstName": "John",
          "lastName": "Smith",
          "username": "john.smith",
          "email": "john.smith@gentex.com",
          "cellPhone": "+16165551234",
          "workPhone": "+16167721590x1234",
          "location": "Centennial East",
          "locationId": "1019",
          "shift": "1",
          "jobTitle": "Software Engineer II",
          "managerEmployeeNumber": "69",
          "directsEmployeeNumbers": [],
          "allEmployeesEmployeeNumbers": [],
          "level": "0"
        }]
          `);

  if (req.query.email === "bill.brasky@gentex.com") {
    res.send(user1);
  } else {
    res.send(user2);
  }
});

app.get("/user/image/:employeeId", (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.params.employeeId === "69") {
    res.sendFile("/usr/src/app/billbrasky.jpg");
  } else {
    res.sendFile("/usr/src/app/johnsmith.jpg");
  }
});

app.get("/manager/:userId", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const message = JSON.parse(`{
        "employeeId": "420",
        "username": "mary.jane",
        "firstName": "Mary",
        "lastName": "Jane",
        "emailAddress": "mary.jane@gentex.com",
        "roles": ["role1", "role2"],
        "distributionLists": ["list1", "list2"],
        "isServiceAccount": false,
        "pager": "420420"}
        `);

  res.send(message);
});

// gets MES registry key based on given path
app.get("/mes/key", (req, res, next) => {
  const path = req.query.path;
  const key1 = JSON.parse(`{
      "path": "${path}",
      "description": ${null},
      "values": []
    }`);
  const key2 = JSON.parse(`{
      "path": "${path}",
      "description": ${null},
      "values": [
        {
          "name": "prop1",
          "value": "a value"
        },
        {
          "name": "prop2",
          "value": "another value"
        }
      ]
    }`);
  if (path === "Key1/TestKey1" || path === "Key1/TestKey2") {
    res.send(key2);
  } else {
    res.send(key1);
  }
});

// gets all subkeys of the given path
app.get("/mes/subkeys", (req, res, next) => {
  const path = req.query.path;
  const subkeys1 = JSON.parse(`[]`);
  const subkeys2 = JSON.parse(`[
    {
      "name": "sub1",
      "description": ${null}
    },
    {
      "name": "sub2",
      "description": ${null}
    },
    {
      "name": "sub3",
      "description": ${null}
    }
  ]`);
  if (path === "Key1/TestKey1" || path === "Key1/TestKey3") {
    res.send(subkeys2);
  } else {
    res.send(subkeys1);
  }
});

// renames the given MES registry key
app.put("/mes/key", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: { path: string; newName: string } = JSON.parse(
    JSON.stringify(req.body)
  );
  if (data.path === "Key1/OldKey" && data.newName === "NewKey") {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// updates the given MES key's description
app.put("/mes/key/description", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: { path: string; description: string } = JSON.parse(
    JSON.stringify(req.body)
  );
  if (data.path === "Key1/SubKey") {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// add values to a registry key
app.post("/mes/values", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: {
    path: string;
    values: { name: string; value: string }[];
  } = JSON.parse(JSON.stringify(req.body));
  if (data.path) {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// copy a registry to a new path
app.post("/mes/key/copy", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: { path: string; newPath: string } = JSON.parse(
    JSON.stringify(req.body)
  );
  if (data.path === "Key1/SubKey") {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// deletes a given registry key
app.delete("/mes/key", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: { path: string } = JSON.parse(JSON.stringify(req.body));
  if (data.path) {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// deletes values of a given registry key
app.delete("/mes/values", (req, res, next) => {
  res.type("application/json");
  res.set("Access-Control-Allow-Origin", "*");
  const data: { path: string; valueNames: string[] } = JSON.parse(
    JSON.stringify(req.body)
  );
  if (data.path && data.path === "Key1/SubKey") {
    res.send(true);
  } else {
    res.status(500);
    res.send(false);
  }
});

// user route
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// handle undefined routes
app.use("*", (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send("URL is not correct, try localhost:3070/user/user1");
});

const port = 3070;
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
