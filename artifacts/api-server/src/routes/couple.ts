import { Router, type IRouter } from "express";
import {
  CreateMoodBody,
  CreateMoodResponse,
  CreateTaskBody,
  CreateTaskResponse,
  GetCoupleOverviewResponse,
  GetMemoriesResponse,
  GetTasksResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const overview = {
  names: "Ahmed & Mariam",
  anniversary: "Add your date",
  togetherDays: 0,
  distanceKm: 0,
  currentMood: "No mood yet",
  photoStreak: 0,
  chatStreak: 0,
  reelsStreak: 0,
  todayPrompt: "Add today's prompt",
};

const memories: Array<{
  id: number;
  title: string;
  date: string;
  type: "photo" | "video" | "note";
  gradient: string;
}> = [];

const tasks: Array<{ id: number; title: string; completed: boolean }> = [];

let nextMoodId = 1;
let nextTaskId = 1;

router.get("/couple/overview", (_req, res) => {
  res.json(GetCoupleOverviewResponse.parse(overview));
});

router.post("/couple/moods", (req, res) => {
  const body = CreateMoodBody.parse(req.body);
  const mood = CreateMoodResponse.parse({
    id: nextMoodId++,
    ...body,
    createdAt: new Date().toISOString(),
  });

  overview.currentMood = mood.mood;
  res.status(201).json(mood);
});

router.get("/couple/memories", (_req, res) => {
  res.json(GetMemoriesResponse.parse(memories));
});

router.get("/couple/tasks", (_req, res) => {
  res.json(GetTasksResponse.parse(tasks));
});

router.post("/couple/tasks", (req, res) => {
  const body = CreateTaskBody.parse(req.body);
  const task = CreateTaskResponse.parse({
    id: nextTaskId++,
    title: body.title,
    completed: false,
  });

  tasks.unshift(task);
  res.status(201).json(task);
});

export default router;