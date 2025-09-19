const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');
const PostController = require('../Controllers/PostController');

router.post('/', upload.array('images', 6), PostController.createPost);
router.get('/feed', PostController.Feed);
router.post('/:postId/share', PostController.sharePost);
router.put('/:postId', PostController.updatePost);
router.delete('/:postId', PostController.deletePost);
router.post('/:postId/like', PostController.likePost);
router.post('/:postId/comment', PostController.commentPost);

module.exports = router;
