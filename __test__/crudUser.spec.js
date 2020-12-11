const app = require("../src/app");
const request = require("supertest");
const { validate } = require("uuid");

describe("CRUD", () => {
  it("must allow to create a new user", async () => {
    //create a new user
    const responseNewUser = await request(app).post("/user").send({
      name: "joao da silva",
      email: "email@email.com",
      password: "123",
    });
    expect(validate(responseNewUser.body.id)).toBe(true);

    expect(responseNewUser.body).toMatchObject({
      name: "joao da silva",
      email: "email@email.com",
      password: "123",
    });
  });

  it("must list users", async () => {
    //create a new user
    const responseNewUser = await request(app).post("/user").send({
      name: "joao da silva",
      email: "email@email.com",
      password: "123",
    });
    const responseGetUsers = await request(app).get("/user");

    //expect get all users with key in object
    expect(responseGetUsers.body).toEqual(
      expect.arrayContaining([
        {
          id: responseNewUser.body.id,
          name: "joao da silva",
          email: "email@email.com",
          password: "123",
        },
      ])
    );
  });

  it("must update user ", async () => {
    //create a new user
    const responseNewUser = await request(app).post("/user").send({
      name: "joao da silva",
      email: "email@email.com",
      password: "123",
    });

    //change info from user
    const responsePutUser = await request(app)
      .put(`/user/${responseNewUser.body.id}`)
      .send({
        name: "Pedro da silva",
        email: "pedro@email.com",
        password: "123123",
      });
    expect(validate(responsePutUser.body.id)).toBe(true);

    //expects the user change to be true
    expect(responsePutUser.body).toMatchObject({
      name: "Pedro da silva",
      email: "pedro@email.com",
      password: "123123",
    });
  });

  it(" must not let update user information that does not exist", async () => {
    //User does not exist
    await request(app).put(`/user/111`).expect(404);
  });

  it("must delete the user ", async () => {
    //create a new user
    const responseNewUser = await request(app).post("/user").send({
      name: "joao da silva",
      email: "email@email.com",
      password: "123",
    });
    expect(validate(responseNewUser.body.id)).toBe(true);

    // //delete user
    await request(app).delete(`/user/${responseNewUser.body.id}`).expect(200);

    // get all users
    const users = await request(app).get("/user");

    // search for user that expect not exist
    const user = users.body.find((r) => r.id === responseNewUser.body.id);

    expect(user).toBe(undefined);
  });

  it(" must not let delete user that does not exist", async () => {
    //User does not exist
    await request(app).delete(`/user/111`).expect(404);
  });
});
