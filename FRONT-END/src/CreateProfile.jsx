import React, { useState, useRef, useEffect } from 'react';
 import './CreateProfile.css';
import house from './assets/House.png';
import explore from './assets/Explore.png';
import notification from './assets/notification.png';
import user02 from './assets/user02.png';


const Profile = () => {

  // State for user data
  const [user, setUser] = useState({
    firstName: "Valentine",
    middleName: "",
    lastName: "Anthony",
    email: "Valentine68@gmail.com",
    gender: "Male",
    country: "",
    state: "",
    town: "",
    image: "https://via.placeholder.com/80"
  });

  // State for modal visibility
  const [modals, setModals] = useState({
    image: false,
    name: false,
    contact: false,
    address: false,
    sidebar: false
  });

  // State for form inputs
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    state: "",
    town: ""
  });

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form with user data
  useEffect(() => {
    setForm({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      country: user.country,
      state: user.state,
      town: user.town
    });
  }, [user]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal
  const openModal = (modalName) => {
    console.log('Opening modal:', modalName);
    setModals(prev => ({ ...prev, [modalName]: true }));
  };
  
  // Close modal
  const closeModal = (modalName) => {
    console.log('Closing modal:', modalName);
    setModals(prev => ({ ...prev, [modalName]: false }));
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save changes
  const saveChanges = (type) => {
    switch (type) {
      case 'image':
        if (imagePreview) {
          setUser({ ...user, image: imagePreview });
        }
        break;
      case 'name':
        setUser({ 
          ...user, 
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName
        });
        break;
      case 'contact':
        setUser({ 
          ...user, 
          email: form.email,
          gender: form.gender
        });
        break;
      case 'address':
        setUser({ 
          ...user, 
          country: form.country,
          state: form.state,
          town: form.town
        });
        break;
      default:
        break;
    }
    closeModal(type);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setModals({ ...modals, sidebar: !modals.sidebar });
  };

  return (
    <div className="profile-page">
      {/* Navigation */}
      <nav id="nav2">
        <label>
          <img 
            className="logo2"
            src= "/Frame121.png"
            alt="logo" 
          />
        </label>
        
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        
        <input 
          type="checkbox" 
          id="menu-toggle" 
          className="menu-toggle-checkbox" 
        />
        
        <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
        
        <ul className="nav-list">
          <li>
            <a href=""><p className="veri">Vericapture</p></a>
          </li>
          <li>
            <div className="changeContainer">
              <label htmlFor="image-toggle" className="dark-mode-label4">
              <img 
                  src="./assets/image/dark mode.png" 
                  alt="dark mode" 
                  id="dark-mode-toggle4"
                />
              </label>
            </div>
          </li>
          <li>
            <div className="ellipse1-container">
              <img 
                src={user.image} 
                alt="Profile" 
                className="ellipse-img" 
              />
            </div>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${modals.sidebar ? 'active' : ''}`}>
        <ul className="menu">
          <li>
            <a href="./index.html">
              <img src={house} alt="Home" /> Home
            </a>
          </li>
          <li>
            <a href="./explore.html">
              <img src={explore} alt="Explore" /> Explore
            </a>
          </li>
          <li>
            <a href="./notification.html">
              <img src={notification} alt="Notification" /> Notification
            </a>
          </li>
          <li className="active">
            <a href="#">
              <img src={user02} alt="Profile" /> Profile
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="profile-container">
        <label>My Profile</label>
        
        <div className="my-profile-container">
          <div className="content">
            <div className="profile-image-container">
              <img 
                src={user.image} 
                alt="Profile" 
                className="ellipse-img6" 
              />
              <button 
                className="change-image-btn" 
                onClick={() => openModal('image')}
              >
                <i className="material-icons">edit</i>
              </button>
            </div>
            
            <div className="profile-info">
              <div>
                <span className="valentine-anthony">
                  {`${user.firstName} ${user.middleName} ${user.lastName}`}
                </span>
                <button 
                  className="edit-name-btn" 
                  onClick={() => openModal('name')}
                >
                  Edit Name
                </button>
              </div>
              
              <div className="location-container">
                <img 
                  className="vector-img6" 
                  src="https://via.placeholder.com/15" 
                  alt="Location icon" 
                />
                <span>
                  {user.town && `${user.town}, `}
                  {user.state && `${user.state}, `}
                  {user.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="edit-container">
          <table id="edit-content">
            <caption>
              <span className="personal-infos">Personal Information</span>
              <button 
                className="section-edit-btn" 
                onClick={() => openModal('contact')}
              >
                <i className="material-icons">edit</i>
                Edit Contact Info
              </button>
            </caption>
            <hr className="line-explore"/>
            
            <tbody id="personal-info-body">
              <tr>
                <th>Email Address</th>
                <td id="email">{user.email}</td>
              </tr>
              <tr>
                <th>Gender</th>
                <td id="gender">{user.gender}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Address */}
        <div className="edit-container2">
          <table id="edit-content2">
            <caption>
              <span>Address</span>
              <button 
                className="section-edit-btn" 
                onClick={() => openModal('address')}
              >
                <i className="material-icons">edit</i>
                Edit Address
              </button>
            </caption>
            <hr className="line-explore2"/>
              
            <tbody className="body2" id="address-body">
              <tr>
                <th>Country</th>
                <td id="country">{user.country || 'Not specified'}</td>
              </tr>
              <tr>
                <th>State</th>
                <td id="state">{user.state || 'Not specified'}</td>
              </tr>
              <tr>
                <th>Town</th>
                <td id="town">{user.town || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Profile Image Modal */}
      {modals.image && (
        <div className="modal-overlay" onClick={() => closeModal('image')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Profile Image</h2>
              <button 
                className="close-button" 
                onClick={() => closeModal('image')}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="image-upload-container">
                <img 
                  id="image-preview" 
                  className="image-upload-preview" 
                  src={imagePreview || user.image} 
                  alt="Profile Preview" 
                />
                <label 
                  htmlFor="image-upload" 
                  className="image-upload-label"
                >
                  Choose New Image
                </label>
                <input 
                  type="file" 
                  id="image-upload" 
                  className="image-upload-input" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="save-button" 
                onClick={() => saveChanges('image')}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {modals.name && (
        <div className="modal-overlay" onClick={() => closeModal('name')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Name</h2>
              <button 
                className="close-button" 
                onClick={() => closeModal('name')}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="edit-first-name">First name</label>
                    <input 
                      type="text" 
                      id="edit-first-name" 
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name" 
                    />
                  </div>
                </div>
                
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="edit-middle-name">Middle name</label>
                    <input 
                      type="text" 
                      id="edit-middle-name" 
                      name="middleName"
                      value={form.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter middle name" 
                    />
                  </div>
                </div>
                
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="edit-last-name">Last name</label>
                    <input 
                      type="text" 
                      id="edit-last-name" 
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="save-button" 
                onClick={() => saveChanges('name')}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Info Modal */}
      {modals.contact && (
        <div className="modal-overlay" onClick={() => closeModal('contact')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Contact Information</h2>
              <button 
                className="close-button" 
                onClick={() => closeModal('contact')}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-email">Email Address</label>
                <input 
                  type="email" 
                  id="edit-email" 
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-gender">Gender</label>
                <select 
                  id="edit-gender" 
                  name="gender"
                  value={form.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="save-button" 
                onClick={() => saveChanges('contact')}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {modals.address && (
        <div className="modal-overlay" onClick={() => closeModal('address')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Address</h2>
              <button 
                className="close-button" 
                onClick={() => closeModal('address')}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-country">Country</label>
                <input 
                  type="text" 
                  id="edit-country" 
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  placeholder="Enter country" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-state">State</label>
                <input 
                  type="text" 
                  id="edit-state" 
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  placeholder="Enter state" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-town">Town</label>
                <input 
                  type="text" 
                  id="edit-town" 
                  name="town"
                  value={form.town}
                  onChange={handleInputChange}
                  placeholder="Enter town" 
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="save-button" 
                onClick={() => saveChanges('address')}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;