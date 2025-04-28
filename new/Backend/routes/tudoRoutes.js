import express from "express";
import { addTodo, editTodo, deleteTodo, getTodos } from "../controllers/todoController.js";

const router = express.Router(); // <-- Yeh line add karo

router.post("/add", addTodo);
router.post("/edit", editTodo);
router.get("/delete", deleteTodo);
router.get("/get", getTodos);

export default router;