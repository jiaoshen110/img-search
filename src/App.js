import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setloading] = useState(false);
  const [photos, setphotos] = useState([]);
  const [page, setpage] = useState(1);
  const [query, setquery] = useState("");
  const fetchImg = async () => {
    try {
      setloading(true);
      const urlPage = `&page=${page}`;
      const urlQuery = `&query=${query}`;
      let url;
      if (query) {
        url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      } else {
        url = `${mainUrl}${clientID}${urlPage}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setphotos((oldPhoto) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhoto, ...data.results];
        } else {
          return [...oldPhoto, ...data];
        }
      });
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    fetchImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 2
      ) {
        setpage((page) => page + 1);
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setpage(1);
    fetchImg();
  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => setquery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">loading...</h2>}
      </section>
    </main>
  );
}

export default App;
