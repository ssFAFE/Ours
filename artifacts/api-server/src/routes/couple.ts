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
  anniversary: "2023-06-17",
  togetherDays: 1195,
  distanceKm: 14,
  currentMood: "Soft & happy",
  photoStreak: 12,
  chatStreak: 28,
  reelsStreak: 7,
  todayPrompt: "What made you smile today?",
};

const memories = [
  {
    id: 1,
    title: "Alexandria, at golden hour",
    date: "June 16, 2026",
    type: "photo" as const,
    gradient: "sunset",
  },
  {
    id: 2,
    title: "A little voice note",
    date: "June 12, 2026",
    type: "note" as const,
    gradient: "lavender",
  },
  {
    id: 3,
    title: "That café we found",
    date: "June 07, 2026",
    type: "video" as const,
    gradient: "peach",
  },
];

const tasks = [
  { id: 1, title: "Plan our next weekend escape", completed: false },
  { id: 2, title: "Print our favorite photo", completed: true },
  { id: 3, title: "Try the new ramen place", completed: false },
];

let nextMoodId = 1;
let nextTaskId = 4;

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