const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  getUsersStats
} = require("../controllers/adminUsers.controller");

/* ADMIN PROTECTION */
router.use(authMiddleware);
router.use(isAdmin);


/* ROUTES */
router.get("/", getUsers);
router.get("/stats", getUsersStats);
router.get("/:id", getUserById);
router.post("/", createUser);

router.delete("/:id", deleteUser);

module.exports = router;