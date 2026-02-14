import { Link } from "react-router-dom";
import { config } from "../config";
import "./MyWorks.css";

const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          {config.labels?.myWorks?.title || "All"} <span>{config.labels?.myWorks?.titleSpan || "Works"}</span>
        </h1>
        <p>{config.labels?.myWorks?.subtitle || "A collection of all my projects and creations"}</p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((project, index) => (
          <div className="myworks-card" key={project.id} data-cursor="disable">
            <div className="myworks-card-number">0{index + 1}</div>
            <div className="myworks-card-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="myworks-card-info">
              <h3>{project.title}</h3>
              <p className="myworks-card-category">{project.category}</p>
              <p className="myworks-card-description">{project.description}</p>
              <p className="myworks-card-tech">{project.technologies}</p>
              {((project as any).repo || (project as any).demo || (project as any).play) && (
                <div className="myworks-card-actions">
                  {(project as any).repo && (
                    <a href={(project as any).repo} target="_blank" rel="noopener noreferrer">
                      Repo
                    </a>
                  )}
                  {(project as any).demo && (
                    <a href={(project as any).demo} target="_blank" rel="noopener noreferrer">
                      Demo
                    </a>
                  )}
                  {(project as any).play && (
                    <a href={(project as any).play} target="_blank" rel="noopener noreferrer">
                      Play
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWorks;
