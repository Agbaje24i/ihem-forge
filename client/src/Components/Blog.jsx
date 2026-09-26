import React, { useEffect, useState } from "react";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/blog");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading blog posts...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16 px-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">
          Our Blog
        </h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {currentPosts.length === 0 ? (
          <p className="text-white text-center">No posts found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.snippet}</p>
                <p className="text-gray-500 text-sm">
                  By {post.author} |{" "}
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white bg-opacity-80 text-black hover:bg-blue-400 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
