import React from 'react';
import { useNavigate } from 'react-router-dom';
import blogsData from "../../data/blogs.json";

const Blogs = () => {
  const navigate = useNavigate();

  const handleCardClick = (blog) => {
    if (blog.link) {
      window.open(blog.link, "_blank", "noopener noreferrer");
    } else {
      navigate(`/blogs/${blog.id}`);
    }
  };

  return (
    <section className='section__container blog__container'>
      <h2 className='section__header'>Latest From Blog</h2>
      <p className='section__subheader'>
        Delve into the journey of women artisans, their techniques, and the challenges they overcome to bring their clay creations to life..
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12'>
        {
          blogsData.map((blog, index) => (
            <div
              key={index}
              className='blog__card cursor-pointer hover:scale-105 transition-all duration-300'
              onClick={() => handleCardClick(blog)}
            >
              <img src={blog.imageUrl} alt={`Blog ${blog.id}`} />
              <div className='blog__card__content'>
                <h6>{blog.subtitle}</h6>
                <h4>{blog.title}</h4>
                <p>{blog.date}</p>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
};

export default Blogs;
