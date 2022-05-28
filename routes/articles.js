const express = require("express");
const router = express.Router();
const Article = require("../models/article");

//New Article
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

//edit
router.get("/edit/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.render("articles/editPage", {
      article: article,
    });
  } catch (e) {
    console.log(e);
  }
});

//Read More
router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

router.post(
  "/",
  (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`/articles/${path}`, { article: article });
    }
  };
}

//Delete
router.delete("/:slug", async (req, res) => {
  try {
    await Article.deleteOne({ slug: req.params.slug });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
