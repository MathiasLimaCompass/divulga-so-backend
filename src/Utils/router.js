const { Router } = require("express");
const UserController = require("../Controllers/UserController");
const validateToken = require("./auth");
const PostController = require("../Controllers/PostController");

const router = Router();
const upload = require("../Config/multer");

// Criar usuário
router.post("/users", UserController.createUser);
router.get("/users", validateToken, UserController.getUsers);
router.post("/login", UserController.login);
// Fazer logout
// Dados de um usuário

// Ver todos posts
router.get("/posts", PostController.getPosts);

// Postar uma postagem
router.post(
  "/posts",
  validateToken,
  upload.single("file"),
  PostController.createPost
);

// Deletar uma postagem
// Ver postagens de um usuário
router.get("/posts/:id", PostController.getUserPosts);

router.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
