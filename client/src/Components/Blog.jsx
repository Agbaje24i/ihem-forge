import React, { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import { Search } from "lucide-react";
import { API } from "../api";

const POSTS_PER_PAGE = 3;

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/blog`);
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
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

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Insights, tips and news"
        subtitle="Career advice, tutorials and updates from the IHEM Forge team."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <label className="relative mx-auto block max-w-md">
            <span className="sr-only">Search posts</span>
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-forge-100 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-forge-400 focus:ring-2 focus:ring-forge-200"
            />
          </label>

          {loading ? (
            <p className="mt-16 text-center text-slate-500">Loading blog posts...</p>
          ) : currentPosts.length === 0 ? (
            <p className="mt-16 text-center text-slate-500">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {currentPosts.map((post) => (
                <article
                  key={post._id}
                  className="flex flex-col rounded-2xl border border-forge-100 bg-white p-6 shadow-card transition hover:-translate-y-1"
                >
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {post.snippet}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    By {post.author} | {new Date(post.date).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-10 w-10 rounded-lg font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-forge-600 text-white"
                      : "bg-forge-50 text-forge-800 hover:bg-forge-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Blog;
