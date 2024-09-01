import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './projectDetail.css';

const ProjectDetailPage = () => {
  const { Product_Id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (Product_Id) {
        try {
          const response = await fetch(`http://localhost:5002/cards/${Product_Id}`);
          if (response.ok) {
            const data = await response.json();
            setProject(data);
          } else {
            setError('Failed to fetch project details');
          }
        } catch (error) {
          setError('Error fetching project details');
        }
      } else {
        setError('Invalid project ID');
      }
    };

    fetchProject();
  }, [Product_Id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-detail-container">
        <div className="project-image">
          <img src={project.imgSrc} alt={project.title} />
        </div>
        <div className="project-info">
          <h1>{project.title}</h1>
          <p>{project.text}</p>
          <h3 className="project-price">${project.price}</h3>
          <button className="btn add-to-cart">Add to Cart</button>
          <button className="btn buy-now">Buy Now</button>
        </div>
      </div>
      <div className="reviews">
        <h2>Reviews</h2>
        <p>No reviews yet. Be the first to review!</p>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
