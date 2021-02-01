const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articleRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getArticles);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/),
    image: Joi.string().required().regex(/https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/),
  }),
}), createArticle);

articleRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), deleteArticle);

module.exports = articleRouter;
