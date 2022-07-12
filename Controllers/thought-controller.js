const { Thought, User } = require('../models');

const thoughtController = {
   
      getAllThoughts(req, res) {
        Thought.find({})
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },
     
      getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'We could not find a thought with this ID, please try again.' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },

      createThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'We could not find a user with this ID, please try again.' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
     
      updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'We could not find a thought with this ID, please try again.' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
      },

      deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'We could not find a thought with this ID, please try again.' });
            }
            return User.findOneAndUpdate(
              { username: username },
              { $pull: { thoughts: params.id } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'We could not find a user with this ID, please try again.' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
     
      addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId }, { $push: { reactions: body } }, { new: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'We could not find a thought with this ID, please try again.' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },
     
      removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId }, { $pull: { reactions: { reactionId: params.reactionId } } }, { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      },
     
  };

module.exports = thoughtController;
  