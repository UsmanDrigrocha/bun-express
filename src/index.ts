import express, { type Request, type Response } from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from './user/routes/index.routes.js';

connectDB();

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server running - localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "working" });
});

export default app;