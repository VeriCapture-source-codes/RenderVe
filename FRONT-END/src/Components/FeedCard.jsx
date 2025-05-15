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
  const [loading, setLoading] = useState(false);

  const handleLike = () => onLike && onLike();
  const handleComment = () => setShowCommentModal(true);
  const handlePostComment = async () => {
    if (!newComment.trim() || !onComment) return;
    setLoading(true);
    const success = await onComment(postId, newComment.trim());
    setLoading(false);
    if (success) {
      setNewComment('');
      setShowCommentModal(false);
    }
  };
  const handleCloseCommentModal = () => !loading && setShowCommentModal(false);

  const getFileExtension = (url) => url.split('.').pop().toLowerCase().split('?')[0];

  const renderMedia = (mediaUrl) => {
    const ext = getFileExtension(mediaUrl);
    const baseStyle = {
      width: '100%',
      borderRadius: '8px',
      marginTop: '0.5rem',
      maxHeight: '400px',
      objectFit: 'cover',
    };
    if (['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(ext)) {
      return <video src={mediaUrl} controls style={baseStyle} />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img src={mediaUrl} alt="Post Media" style={baseStyle} />;
    } else {
      return <p>Unsupported media type</p>;
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm rounded-4 p-3 border-0">
        <Card.Body>
          {/* Top Section */}
          <div className="d-flex align-items-start mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              width="48"
              height="48"
              className="rounded-circle me-3"
              style={{ objectFit: 'cover' }}
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <div className="fw-semibold text-dark">{user.name}</div>
                  <div className="text-muted small">
                    <i className="bi bi-geo-alt me-1" />
                    {location}
                  </div>
                </div>
                <div className="text-end small">
                  <div className="text-muted">{time}</div>
                  {tag && <span className="badge bg-danger mt-1">{tag}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Post Text */}
          <Card.Text className="fs-5 mb-3 text-start text-break">{text}</Card.Text>

          {/* Media */}
          {media && renderMedia(media)}

          {/* Action Buttons */}
          <div className="d-flex justify-content-around mt-3 text-muted fs-6">
            <span
              role="button"
              onClick={handleLike}
              className={`d-flex align-items-center ${likes?.some(like => like._id === currentUserId) ? 'text-primary' : ''}`}
            >
              <i className="bi bi-hand-thumbs-up me-1" />
              {likes?.length || 0}
            </span>
            <span role="button" onClick={handleComment} className="d-flex align-items-center">
              <i className="bi bi-chat-dots me-1" />
              {comments}
            </span>
            <span className="d-flex align-items-center">
              <i className="bi bi-bar-chart me-1" />
              {shares}
            </span>
            <span role="button" onClick={onFollow} className="d-flex align-items-center">
              <i className="bi bi-share me-1" />
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Comment Modal */}
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
