const { validationResult } = require('express-validator/check');

const Speaker = require('../models/speaker');

exports.getSpeakers = (req, res, next) => {
  Speaker.find()
    .then(speakers => {
      res.status(200).json({
        message: 'Speakers fetched successfully.',
        speakers: speakers
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSpeaker = (req, res, next) => {
  const speakerId = req.params.speakerId;
  Speaker.findById(speakerId)
    .then(speaker => {
      if (!speaker) {
        const error = new Error('Could not find speaker.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Speaker fetched.', speaker: speaker });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//plugs into to database schema, must have same properties

exports.postSpeaker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const name = req.body.name;
  const email = req.body.email;
  const position = req.body.position;
  const company = req.body.company;
  const biography = req.body.biography;
  const speaker = new Speaker({
    name: name,
    email: email,
    imageUrl: imageUrl,
    position: position,
    company: company,
    biography: biography
  });
  speaker
    .save()
    .then(speaker => {
      res.status(200).json({
        message: 'Speaker created successfully!',
        speaker: speaker
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// exports.createComment = (req, res, next) => {
//   const content = req.body.content;
//   const postId = req.body.postId;
//   const author = req.body.author;
//   console.log(author);
//   const comment = new Comment({
//     content: content,
//     postId: postId,
//     author: author
//   });
//   comment
//     .save()
//     .then(result => {
//       res.status(201).json({
//         message: 'Comment created successfully!',
//         comment: result
//       });
//     })
//     .then(
//       Post.findByIdAndUpdate(postId, { $push: { comments: comment } }).then(
//         post => post.comments.push(comment)
//       )
//     )
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.voted = (req, res, next) => {
//   const postId = req.body.postId;
//   const votes = req.body.votes;
//   console.log(postId, votes);
//   Post.findByIdAndUpdate(postId, { votes: votes })
//     .then(post => console.log(post))
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.getCategory = (req, res, next) => {
//   const category = req.params.category;
//   console.log(category);
//   Post.find({ category: category })
//     .then(post => {
//       if (!post) {
//         const error = new Error('No posts in this category.');
//         error.statusCode = 404;
//         throw error;
//       }
//       res.status(200).json({ message: 'Posts fetched.', post: post });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };
