import express from "express";
import cors from "cors";
import {
  getEmployeeDirectoryRedis,
  getUserData,
  processDataFromRedis,
  processDataFunction,
  updateUserData,
} from "./redis";
import { getUserInfoLumen } from "./MES";

processDataFunction();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/employeeDirectory", async (req, res) => {
  if (req.method === "GET") {
    const data = await getEmployeeDirectoryRedis();
    res.json({ data: JSON.stringify(data) });
  }
});

app.get("/api/user/:user", async (req, res) => {
  if (req.method === "GET") {
    const user = req.params.user;
    const key = `userData:${user}`;
    const data = await getUserData(key);
    res.json({ data: JSON.stringify(data) });
  }
});

app.post("/api/user/:user", async (req, res) => {
  if (req.method === "POST") {
    const user = req.params.user;
    const data = req.body;
    const result = await updateUserData(user, data);
    res.json({ data: result });
  }
});

app.get("/api/lumen/:userId", async (req, res) => {
  if (req.method === "GET") {
    const user = req.params.userId;
    const result = await getUserInfoLumen(user);
    res.json({ data: JSON.stringify(result) });
  }
});

app.get("/api/processdata/:asset/:date", async (req, res) => {
  const asset = req.params.asset;
  const date = req.params.date;
  const key = `${asset}:${date}`;
  const data = await processDataFromRedis(key);
  res.json({ data: data });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
