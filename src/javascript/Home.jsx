import { useState, useEffect } from 'react';
import { getActiveArticles } from '../services/articleService';
import '../styles/Home.css';

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getActiveArticles()
      .then(data => setArticles(data))
      .catch(err => console.error("Error cargando artículos", err));
  }, []);

  const latestArticle = articles.length > 0 ? articles[0] : null;
  const featuredArticles = articles.slice(0, 4);

  return (
    <>
      <section className="wiki-hero">
        <div className="hero-content">
          <h1>Bienvenido a la plataforma de conocimiento</h1>
          <p>Explora la enciclopedia libre de Honduras y el mundo.</p>
        </div>
      </section>

      <section className="wiki-content-area">
        <div className="content-grid">

          <div className="featured-section">
            <h3 className="section-title">Artículos Destacados</h3>
            <div className="cards-container">
              {featuredArticles.length > 0 ? (
                featuredArticles.map((art) => (
                  <div key={art.id} className="article-card">
                    <div className="card-image-placeholder"></div>
                    <div className="card-tag">{art.sectionName || 'GENERAL'}</div>
                    <h4>{art.title}</h4>
                  </div>
                ))
              ) : (
                <p>No hay artículos destacados disponibles.</p>
              )}
            </div>
          </div>

          <div className="article-layout">
            <article className="main-article">
              {latestArticle ? (
                <>
                  <h1 className="article-title">{latestArticle.title}</h1>
                  <hr />
                  <p>{latestArticle.summary || latestArticle.content || 'Sin contenido detallado.'}</p>
                </>
              ) : (
                <>
                  <h1 className="article-title">Sin artículos recientes</h1>
                  <hr />
                  <p>Aún no se han publicado artículos en la plataforma.</p>
                </>
              )}
            </article>
          </div>

        </div>
      </section>
    </>
  );
}