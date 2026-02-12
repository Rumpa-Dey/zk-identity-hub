import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { registerAgeRoutes } from "./components/age";
import { registerPhoneRoutes } from "./components/phone";
import { registerEmailRoutes } from "./components/email";




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// register modules
registerAgeRoutes(app);
registerPhoneRoutes(app);
registerEmailRoutes(app);

app.listen(4000, () => {
  console.log("🚀 Backend running at http://localhost:4000");
});
