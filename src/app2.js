import express from "express";
import { v4 } from "uuid";
const app = express();
app.use(express.json());


app.post("/tasks", (req, res) => {
  const { title, description } = req.body;


  res.json({
    title,
    description,
    id: v4(),
  });
});


app.post("/taskss", (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) return res.sendStatus(400);
  
    res.json({
      title,
      description,
      id: v4(),
    });
  });

export default app;
