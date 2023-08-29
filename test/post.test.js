import request from "supertest";
import app2 from "../src/app2.js";

describe("Testing post routes", () => {
  //   test("Should return 200", async () => {
  //     const response = await request(app2).get("/ping").send();
  //     expect(response.status).toBe(200);
  //   });
  //   test("Should return an array", async () => {
  //     const response = await request(app2).get("/pong").send();
  //     expect(response.body).toBeInstanceOf(Array);
  //   })
});

describe("POST /tasks", () => {
  describe("giving a title and a description", () => {
    const newTask = {
      task: "new task",
      description: "new description",
    };

    // should res with 200
    test("should res 200 status code", async () => {
      const response = await request(app2).post("/tasks").send(newTask);
      expect(response.statusCode).toBe(200);
    });

    //should res with content-type of app/json
    test("should habe a content type: app/json in header", async () => {
      const response = await request(app2).post("/tasks").send(newTask);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    //should res with a json obj with an id
    test("should res with a task ID", async () => {
      const response = await request(app2).post("/tasks").send(newTask);
      expect(response.body.id).toBeDefined();
    });
  });
});

describe("when title and description are not given", () => {
  const fields = [{}, { title: "test" }, { description: "test" }];
  for (const body of fields) {
    test("should res with 400 status code", async () => {
      const response = await request(app2).post("/taskss").send({ body });
      expect(response.statusCode).toBe(400);
    });
  }
});
