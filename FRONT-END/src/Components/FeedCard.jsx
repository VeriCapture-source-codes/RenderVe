import React, { useState } from 'react';
import { Card, Button, Modal, Spinner } from 'react-bootstrap';
const FeedCard = ({
  postId,
  user,
  time,
  location,
  text,
  media,
  tag,
  likes,
  comments,
  shares,
  onLike,
  onComment,
  onFollow,
  currentUserId
}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false); //  NEW
  const handleLike = () => onLike && onLike();
  const handleComment = () => {
    setShowCommentModal(true);
  };
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!onComment) return;
    setLoading(true); //  Start loading
    const success = await onComment(postId, newComment.trim());
    setLoading(false); // Stop loading
    if (success) {
      setNewComment('');
      setShowCommentModal(false);
    }
  };
  const handleCloseCommentModal = () => {
    if (!loading) { // prevent closing while loading
      setShowCommentModal(false);
    }
  };
  const getFileExtension = (url) => url.split('.').pop().toLowerCase().split('?')[0];
  const renderMedia = (mediaUrl) => {
    const ext = getFileExtension(mediaUrl);
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) {
      return (
        <video src={mediaUrl} controls style={{ width: '80%', marginTop: '0.5rem', borderRadius: '8px' }} />
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return (
        <img src={mediaUrl} alt="Post Media" style={{ width: '100%', marginTop: '0.5rem', borderRadius: '8px' }} />
      );
    } else {
      return <p>Unsupported media type</p>;
    }
  };
  return (
    <>
      <Card className="mb-4 shadow-sm rounded-4 p-3 border-0">
        <Card.Body>
          <div className="d-flex align-items-start mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              width="48"
              height="48"
              className="rounded-circle me-3"
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold">{user.name}</div>
                  <div className="text-muted small">
                    <i className="bi bi-geo-alt me-1" />
                    {location}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-muted small">{time}</div>
                  <span className="badge bg-danger">{tag}</span>
                </div>
              </div>
            </div>
          </div>
          <Card.Text className="fs-5 mb-3 text-start">{text}</Card.Text>
          {renderMedia(media)}
          <div className="d-flex justify-content-between text-muted fs-6">
            <span
              role="button"
              onClick={handleLike}
              className={likes?.some(like => like._id === currentUserId) ? 'text-primary' : ''}
            >
              <i className="bi bi-hand-thumbs-up me-2" />
              {likes?.length || 0}
            </span>
            <span role="button" onClick={handleComment}>
              <i className="bi bi-chat-dots me-2" />
              {comments}
            </span>
            <span>
              <i className="bi bi-bar-chart me-2" />
              {shares}
            </span>
            <span role="button" onClick={onFollow}>
              <i className="bi bi-share me-2" />
            </span>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showCommentModal} onHide={handleCloseCommentModal} centered>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>Post a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCommentModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePostComment} disabled={loading || !newComment.trim()}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default FeedCard;