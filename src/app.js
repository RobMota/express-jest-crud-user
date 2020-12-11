const express = require("express");
const app = express();
const { v4: uuid, validate } = require("uuid");

app.use(express.json());

const users = [];

app.get("/user", (req, res) => {
  return res.json(users);
});

app.post("/user", (req, res) => {
  const { name, email, password } = req.body;

  const user = {
    id: uuid(),
    name,
    email,
    password,
  };
  users.push(user);
  return res.json(user);
});

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const userId = users.findIndex((user) => user.id == id);

  if (userId == -1) {
    return res.status(404).json({ error: "User does not exist" });
  }

  const updateUser = {
    id,
    name,
    email,
    password,
  };

  users[userId] = updateUser;

  return res.json(updateUser);
});

app.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  const userId = users.findIndex((user) => user.id == id);

  if (userId == -1) {
    return res.status(404).json({
      error: "User does not exist",
    });
  }

  users.splice(userId, 1)

  return res.status(200).json({ message: "User successfully deleted!" });
});

module.exports = app;
