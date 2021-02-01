require('dotenv').config();
const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner = req.user._id,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail(new Error('Not Found'))
    .then((article) => {
      if (req.user._id.toString() !== article.owner.toString()) {
        throw new ForbiddenError('Невозможно удалить статью, которую вы не добавляли');
      } else {
        Article.deleteOne(article)
          .then(() => res.send({ data: article }))
          .catch((err) => {
            if (err.message === 'CastError') {
              next(new BadRequestError('Некорректные данные'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new NotFoundError('Карточки нет в базе.'));
      } else {
        next(err);
      }
    });
};
