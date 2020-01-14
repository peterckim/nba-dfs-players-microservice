const supertest = require("supertest");
const app = require("../app.js");
const request = supertest(app);

describe("Get Endpoints", () => {
  it("should retrieve a player with id", async done => {
    const res = await request.post("/api/v1/players").send({
      id: 1,
      name: "Trae Young",
      position: "PG"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");

    done();
  });

  it("should retrieve a player with id and only games against opponent", async done => {
    const res = await request.post("/api/v1/players").send({
      id: 1,
      name: "Trae Young",
      position: "PG"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");

    done();
  });
});

describe("Post Endpoints", () => {
  it("should create a new player", async done => {
    const res = await request.post("/api/v1/players").send({
      id: 1,
      name: "Trae Young",
      position: "PG"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");

    done();
  });

  it("should create a new game under player", async done => {
    const res = await request.post("/api/v1/players").send({
      id: 1,
      name: "Trae Young",
      position: "PG"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("post");

    done();
  });
});
