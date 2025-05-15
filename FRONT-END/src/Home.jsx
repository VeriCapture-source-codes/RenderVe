import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SidebarMenu from './Components/SideMenu';
import FeedCard from './Components/FeedCard';
import Loader from './Components/Loader';
import { apiRequest } from './utils/api';
import { toast, Toaster } from 'react-hot-toast';
import GoLiveModal from './Components/GoLiveModal';
import './Home.css';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
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

  const handleWhatIsHappeningClick = () => {
 
  console.log("Fetching updates from your area...");
 
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
            <Row className="top-categories">
           <Col xs={12} md={6}>
           <h6 className="mb-0">Top Categories:</h6>
            </Col>
            <Col xs={12} md={6} className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center mt-2 mt-md-0">
  <Form.Control
    type="text"
    placeholder="Type to search"
    className="flex-grow-1"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    style={{ minWidth: '180px', maxWidth: '200px' }}
  />

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
      <Dropdown.Item onClick={handleCloseModal}>
        Clear Filter
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>

  <Button variant="outline-primary" onClick={handleWhatIsHappeningClick}>
    What is happening in your area
  </Button>
</Col>

            </Row>

                <div className="input-group custom-update-box" onClick={openGoLiveModal} style={{ cursor: 'pointer' }}>
                 <input
                    className="form-control border-start-0 shadow-none"
                    placeholder="Post an Update"
                  />
                </div>
              </Col>
                
                <Col md={3}>
               <div className="px-3 my-3">
              <button
             className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center"
              onClick={openGoLiveModal}
              >
          <i className="bi bi-camera-video-fill me-2"></i>
           Go Live
         </button>
      </div>
    {/* Feed card list */}
  {filteredPosts.length > 0 ? (
  filteredPosts.map((post, index) => (
    <div className="feed-card-wrapper" key={index}>
      <FeedCard
        user={{
          name: post.user
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
    </div>
  ))
) : (
  <div className="no-posts">
    <i className="bi bi-inbox icon"></i>
    <p>No posts found.</p>
  </div>
)}

            
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
