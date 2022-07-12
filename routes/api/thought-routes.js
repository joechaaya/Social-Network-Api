const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
  } = require('../../controllers/thought-controller');

  router
  .route('/')
  .get(getAllThoughts)
  .post(createThought);

  router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

  router.route('/:userId')
.post(createThought);

router
  .route('/:thoughtId/reactions/')
  .post(addReaction)
  .delete(removeReaction)

  router.route('/:thoughtId/reactions/:id')
.delete(removeReaction);


module.exports = router;