import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { FaRegHeart, FaRegComment, FaRegImage, FaPaperPlane, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineForum } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/Community.css";


function Community() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create post state
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Track which posts have comments open
  const [openComments, setOpenComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});


  // =============================================
  // FETCH POSTS
  // =============================================

  const fetchPosts = async () => {
    try {
      const response = await api.get("/community");
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  // =============================================
  // CREATE POST
  // =============================================

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", postContent);

      if (postImage) {
        formData.append("image", postImage);
      }

      const response = await api.post("/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setPosts((prev) => [response.data.data, ...prev]);
        setPostContent("");
        setPostImage(null);
        setImagePreview("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  // =============================================
  // IMAGE HANDLING
  // =============================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview("");
  };


  // =============================================
  // DELETE POST
  // =============================================

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/community/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };


  // =============================================
  // TOGGLE LIKE
  // =============================================

  const handleToggleLike = async (postId) => {
    if (!user) return;

    try {
      const response = await api.post(`/community/${postId}/like`);

      if (response.data.success) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p._id === postId) {
              const alreadyLiked = p.likes.includes(user._id);

              return {
                ...p,
                likes: alreadyLiked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              };
            }

            return p;
          })
        );
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };


  // =============================================
  // COMMENTS
  // =============================================

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId) => {
    const text = commentTexts[postId];

    if (!text || !text.trim()) return;

    try {
      const response = await api.post(`/community/${postId}/comments`, {
        text,
      });

      if (response.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? response.data.data : p
          )
        );

        setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/community/${postId}/comments/${commentId}`);

      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              comments: p.comments.filter((c) => c._id !== commentId),
            };
          }

          return p;
        })
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };


  // =============================================
  // HELPERS
  // =============================================

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };


  // =============================================
  // RENDER
  // =============================================

  return (
    <section className="community-page">
      <div className="community-container">

        {/* Page Header */}
        <div className="community-header">
          <h1>Community</h1>
          <p>
            Share your thoughts, ask questions, and connect with fellow learners
          </p>
        </div>


        {/* Create Post — logged in */}
        {user ? (
          <div className="create-post-card">
            <h3>
              <MdOutlineForum />
              Create a Post
            </h3>

            <form onSubmit={handleCreatePost}>
              <textarea
                className="post-textarea"
                placeholder="What's on your mind? Share something with the community..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={3}
              />

              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              <div className="post-form-actions">
                <label className="image-upload-label">
                  <FaRegImage />
                  Add Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                <button
                  type="submit"
                  className="post-submit-btn"
                  disabled={submitting || !postContent.trim()}
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="login-prompt-card">
            <p>Sign in to share posts and interact with the community</p>
            <Link to="/signin">Sign In to Post</Link>
          </div>
        )}


        {/* Posts Feed */}
        {loading ? (
          <div className="loading-feed">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-feed-icon">
              <MdOutlineForum />
            </div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map((post) => (
              <div className="post-card" key={post._id}>

                {/* Post Header */}
                <div className="post-header">
                  <div className="post-author">
                    {post.user_id?.profile_image ? (
                      <img
                        src={post.user_id.profile_image}
                        alt={post.user_id.name}
                        className="post-avatar"
                      />
                    ) : (
                      <div className="post-avatar-placeholder">
                        {getInitial(post.user_id?.name)}
                      </div>
                    )}

                    <div className="post-author-info">
                      <h4>{post.user_id?.name || "Unknown"}</h4>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {user && user._id === post.user_id?._id && (
                    <button
                      className="delete-post-btn"
                      onClick={() => handleDeletePost(post._id)}
                      title="Delete post"
                    >
                      <FaRegTrashCan />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="post-image"
                  />
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    className={`like-btn ${
                      user && post.likes.includes(user._id)
                        ? "liked"
                        : ""
                    }`}
                    onClick={() => handleToggleLike(post._id)}
                    disabled={!user}
                  >
                    {user && post.likes.includes(user._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                    {post.likes.length > 0 && post.likes.length}
                  </button>

                  <button
                    className="comment-toggle-btn"
                    onClick={() => toggleComments(post._id)}
                  >
                    <FaRegComment />
                    {post.comments.length > 0 && post.comments.length}
                  </button>
                </div>


                {/* Comments Section */}
                {openComments[post._id] && (
                  <div className="comments-section">

                    {/* Existing Comments */}
                    {post.comments.map((comment) => (
                      <div className="comment-item" key={comment._id}>
                        {comment.user_id?.profile_image ? (
                          <img
                            src={comment.user_id.profile_image}
                            alt={comment.user_id.name}
                            className="comment-avatar"
                          />
                        ) : (
                          <div className="comment-avatar-placeholder">
                            {getInitial(comment.user_id?.name)}
                          </div>
                        )}

                        <div className="comment-body">
                          <div className="comment-bubble">
                            <h5>{comment.user_id?.name || "Unknown"}</h5>
                            <p>{comment.text}</p>
                          </div>

                          <div className="comment-meta">
                            <span>{formatDate(comment.createdAt)}</span>

                            {user &&
                              (user._id === comment.user_id?._id ||
                                user._id === post.user_id?._id) && (
                                <button
                                  className="comment-delete-btn"
                                  onClick={() =>
                                    handleDeleteComment(
                                      post._id,
                                      comment._id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}


                    {/* Add Comment — logged in */}
                    {user && (
                      <div className="add-comment-form">
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Write a comment..."
                          value={commentTexts[post._id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddComment(post._id);
                            }
                          }}
                        />

                        <button
                          className="comment-submit-btn"
                          onClick={() => handleAddComment(post._id)}
                          disabled={!commentTexts[post._id]?.trim()}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Community;
