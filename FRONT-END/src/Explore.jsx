import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarMenu from './Components/SideMenu';
import FeedCard from './Components/FeedCard';
import Loader from './Components/Loader';
import { apiRequest } from './utils/api';
import {toast, Toaster} from 'react-hot-toast';
import GoLiveModal from './Components/GoLiveModal';
const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [userEmail, setUserEmail] = useState(null);
  const categories = ['Crime', 'Protest', 'Accident', 'Riot', 'Traffic', 'General'];
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [userID, setUserID] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryModal(false);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    fetchPosts();
  };

  const handleAddComment = async (postId, commentText) => {
    console.log(postId)

    if (!commentText.trim()) return;
  
    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/users/add-comment/${postId}`,
        body: { text: commentText },
      });
  
      if (result.success) {
        toast.success(result.message);
        fetchPosts();

        return true; // you can use this to close modal or reset input outside
      } else {
        toast.error(result.message || 'Failed to add comment');
      }
    } catch (error) {
      toast.error('Error adding comment: ' + error.message);
    }
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
        route: '/users/get-user-posts',
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
    setUserID(userId)
    if (!userId) {
      console.error('No authToken found in localStorage');
      return;
    }

    try {
      const result = await apiRequest({
        method: 'GET',
        route: `/users/get-user-by-id/${userId}`,
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

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
      await fetchPosts();
      setLoading(false); // stop loading after both APIs resolve
    };
    init();
  }, []);
  const handleLike = async (postId) => {
    try {
      const result = await apiRequest({
        method: 'POST',
        route: `/users/like-post/${postId}`, // fixed template literal
      });
  
      if (result.success) {
        toast.success(result.message );
  
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes && !post.likes.some(like => like._id === 'temp')
                    ? [...post.likes, { _id: 'temp' }]
                    : post.likes,
                }
              : post
          )
        );
  
        // Optionally re-fetch if you want to sync data completely
        // But this can be skipped if optimistic UI update above is enough
        await fetchPosts();
      } else {
        toast.error(result.message || 'Failed to like post');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error liking post: ' + (err?.message || 'Unknown error'));
    }
  };
  
const handleDelete = async (postId) => {
};
  if (loading) return <Loader />;


  return (
    <>
      <Header user={user} userEmail ={userEmail} />

      <Container fluid className="mt-3 ">
        <Row className=''>
          <Col md={2} className="d-none d-md-block">
            <SidebarMenu />
          </Col>

          <Col md={7} className="py-3 main-cont">

          <Row className='mb-2'>
                <Col md={3}>
                <span>Top Stories</span>
                </Col>
                <Col md={3}>
                <span>Crime</span>

                </Col>
                <Col md={3}>
                <span>Trafic</span>

                </Col>

                <Col  md={3}>
                <span>Riot</span>
                </Col>

          </Row>

          <Row className='align-items-center mb-3'>
  <Col md={9}>
    <div className="input-group custom-update-box ">
      <span className="input-group-text bg-white border-end-0 p-0 pe-2 ">
        <img
          src={user.data.thumbnail || '../../src/assets/images/user.png'}
          alt="User"
          width="30"
          height="30"
          className="rounded-circle left-space"
        />
      </span>
      <input
        className="form-control border-start-0 shadow-none "
        placeholder="Post an Update"
      />
    </div>
  </Col>

  <Col md={3} className="text-end">
    <button className="btn btn-danger d-flex align-items-center justify-content-center w-100 px-3 py-2" onClick={openGoLiveModal}>
      <i className="bi bi-camera-video-fill me-2"></i>
      Go Live
    </button>
  </Col>
        </Row>





            {posts.length > 0 ? (
              posts.map((post, index) => (
                <FeedCard
                  key={index}

                  user={{
                    name: post.user ? `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() : 'Anonymous',
                    avatar: post.user?.thumbnail || '../src/assets/images/user.png'
                  }}
                                    time="2m ago"
                  location={post.location || 'Unknown'}
                  text={post.caption}
                  media={post.media}
                  tag={post.tag}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  onLike={() =>  handleLike(post._id)}
                  onComment={handleAddComment}
                  onFollow={() => console.log("Shared or Followed")}
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
                <i className="bi bi-search"></i> {/* Bootstrap Icons */}
                </span>
                <input 
                className="form-control border-start-0" 
                placeholder="type to search" 
                />
            </div>

            <Col md={12} className='p-3'>
                <div className='bg-white mt-3'>
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
