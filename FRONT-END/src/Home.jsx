import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import SidebarMenu from './Components/SideMenu';
import FeedCard from './Components/FeedCard';
import Loader from './Components/Loader';
import { apiRequest } from './utils/api';
import { toast, Toaster } from 'react-hot-toast';
import GoLiveModal from './Components/GoLiveModal';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [userID, setUserID] = useState(null);

  const categories = ['crime','riot', 'traffic', 'general'];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryModal(false);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    fetchPosts();
  };

  const openGoLiveModal = () => setShowGoLiveModal(true);
  const closeGoLiveModal = () => {
    setShowGoLiveModal(false);
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      const result = await apiRequest({
        method: 'GET',
        route: '/posts/get-user-posts',
      });

      if (result.success) {
        setPosts(result.data.posts || []);
      } else {
        console.error('Failed to fetch posts:', result.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem('authToken');
    const userEmailFetch = localStorage.getItem('userEmail');
    setUserEmail(userEmailFetch);
    setUserID(userId);

    if (!userId) {
      console.error('No authToken found in localStorage');
      return;
    }

    try {
      const result = await apiRequest({
        method: 'GET',
        route: `/posts/get-user-by-id/${userId}`,
      });

      if (result.success) {
        setUser(result.data);
        localStorage.setItem('userInfo', JSON.stringify(result.data));
      } else {
        console.error('Failed to fetch user:', result.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/posts/like-post/${postId}`,
      });

      if (result.success) {
        toast.success(result.message);
        await fetchPosts();
      } else {
        toast.error(result.message || 'Failed to like post');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error liking post: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/comments/add-comment/${postId}`,
        body: { text: commentText },
      });

      if (result.success) {
        toast.success(result.message);
        await fetchPosts();
        return true;
      } else {
        toast.error(result.message || 'Failed to add comment');
      }
    } catch (error) {
      toast.error('Error adding comment: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const result = await apiRequest({
        method: 'DELETE',
        route: `/users/delete-post/${postId}`,
      });

      if (result.success) {
        toast.success('Post deleted');
        await fetchPosts();
      } else {
        toast.error(result.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting post');
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await fetchPosts();
      setLoading(false);
    };
    init();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.tag?.toLowerCase() === selectedCategory.toLowerCase())
    : posts;

  if (loading) return <Loader />;

  return (
    <>
      <Toaster />
      <Header user={user} userEmail={userEmail} />

      <Container fluid className="mt-3">
        <Row>
          <Col md={2} className="d-none d-md-block">
            <SidebarMenu />
          </Col>

          <Col md={7} className="py-3 main-cont">
            <Row className="mb-2">
              <Col md={12} className="d-flex justify-content-between align-items-center">
                <span>Top Categories:</span>
                <Dropdown show={categoryModal} onToggle={() => setCategoryModal(!categoryModal)}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {selectedCategory || 'Select Category'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categories.map((cat, idx) => (
                      <Dropdown.Item key={idx} onClick={() => handleCategorySelect(cat)}>
                        {cat}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Item onClick={() => handleCategorySelect(null)}>
                      Clear Filter
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            <Row className="align-items-center mb-3">
              <Col md={9}>
                <div className="input-group custom-update-box">
                  <span className="input-group-text bg-white border-end-0 p-0 pe-2">
                    <img
                      src={user?.data?.thumbnail || '../../images/user.png'}
                      alt="User"
                      width="30"
                      height="30"
                      className="rounded-circle left-space"
                    />
                  </span>
                  <input
                    className="form-control border-start-0 shadow-none"
                    placeholder="Post an Update"
                  />
                </div>
              </Col>

              <Col md={3} className="text-end">
                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center w-100 px-3 py-2"
                  onClick={openGoLiveModal}
                >
                  <i className="bi bi-camera-video-fill me-2"></i>
                  Go Live
                </button>
              </Col>
            </Row>

            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <FeedCard
                  key={index}
                  user={{
                    name:
                      post.user
                        ? `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim()
                        : 'Anonymous',
                    avatar: post.user?.thumbnail || '../images/user.png',
                  }}
                  time="2m ago"
                  location={post.location || 'Unknown'}
                  text={post.caption}
                  media={post.media}
                  tag={post.tag}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  onLike={() => handleLike(post._id)}
                  onComment={handleAddComment}
                  onFollow={() => console.log('Shared or Followed')}
                  onDelete={() => handleDelete(post._id)}
                  currentUserId={userID}
                  postId={post._id}
                />
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </Col>

          <Col md={3} className="py-3 d-none d-md-block mb-2 main-cont">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input className="form-control border-start-0" placeholder="Type to search" />
            </div>

            <Col md={12} className="p-3">
              <div className="bg-white mt-3">
                <span>What is happening in your area</span>
              </div>
            </Col>
          </Col>
        </Row>

        {showGoLiveModal && (
          <GoLiveModal selectedCategory={selectedCategory} onClose={closeGoLiveModal} />
        )}
      </Container>
    </>
  );
};

export default Home;
