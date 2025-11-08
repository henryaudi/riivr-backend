import express, { Express } from "express";
import { RiivrServer } from "./setupServer";

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: RiivrServer = new RiivrServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();