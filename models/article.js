const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/.test(v);
      },
      message: 'Ссылка невалидна',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((w{3}\.)*[\w.-]+\.[a-z]{2,3}))(:[1-9]\d{1,4})*(\/)?(([\w]{1,}(\/)?)+(#)?)?/.test(v);
      },
      message: 'Ссылка невалидна',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('article', articleSchema);
