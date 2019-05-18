'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
const Issue = require('./../models/Issues');

// Basic Config
require('dotenv').config({ path: 'process.env' });

let env = process.env.NODE_ENV || 'production';

if (env === 'development') {
  process.env.MONGODB_URI = process.env.MONGODB_LOCAL;
  console.log('Logged in.........');
} else if (env === 'production') {
  process.env.MONGODB_URI = `mongodb+srv://afsal:${
    process.env.PASSWORD
  }@issue-tracker-ptxul.mongodb.net/test?retryWrites=true`;
}
// DB Config
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log('connected on mongodb server'))
  .catch(err => console.log(err));

module.exports = function(app) {
  app
    .route('/api/issues/:project')
    .post(function(req, res) {
      let { title, text, creator, assigned, status } = req.body;
      let newIssue = new Issue({
        title,
        text,
        creator,
        assigned,
        status
      });
      newIssue
        .save()
        .then(doc => {
          return res.status(200).json(doc);
        })
        .catch(err => res.status(404).json({ msg: 'Data Insufficient' }));
    })

    .put(async function(req, res) {
      let { id } = req.body;
      var update = { $set: {} };
      var keys = Object.keys(req.body).filter(key => key !== '_id');
      keys.forEach(key => {
        if (req.body[key] !== '') {
          update.$set[key] = req.body[key];
          // noFieldSent = false;
        }
      });

      update.$set.updated_on = new Date();
      Issue.findOneAndUpdate({ _id: id }, update, { new: true })
        .then(user => {
          if (user) {
            return res.status(200).json({ msg: 'Successfully Updated' });
          }
          res.status(401).json({ msg: 'Invalid Request' });
        })
        .catch(err => res.status(404).json({ msg: 'User id not Found' }));
    })

    .delete(function(req, res) {
      let { id } = req.body;
      console.log(req.body);
      console.log('id', id);
      Issue.findOneAndDelete({ _id: id })
        .then(user => {
          if (user) {
            res.status(200).json({ msg: 'Successfully Deleted' });
          }
          res.status(401).json({ msg: 'Bad Request' });
        })
        .catch(err => res.status(404).json({ msg: 'Invalid ID' }));
    });

  app.route('/api/issues').get(async function(req, res) {
    let { title } = req.query;

    let issue = await Issue.findOne({ title: title })
      .then(issue => {
        if (issue) {
          return issue;
        }
        return false;
      })
      .catch(err => null);

    if (issue) {
      return res.status(200).json(issue);
    }
    res.status(200).json({ error: 'No such titles exist' });
  });
};
