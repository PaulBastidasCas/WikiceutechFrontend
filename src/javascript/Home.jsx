import { useState, useEffect } from 'react';
import { getActiveArticles, downloadArticlePdf } from '../services/articleService';
import api from '../services/api';
import { Maximize, Minimize, List, Download, X, Moon, Sun } from 'lucide-react';
import '../styles/Home.css';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [fullArticle, setFullArticle] = useState(null);
  const [loadedArticles, setLoadedArticles] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContents, setShowContents] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    getActiveArticles()
      .then(data => {
        const uniqueArticles = Array.from(new Map(data.map(item => [item.id, item])).values());
        setArticles(uniqueArticles);
        if (uniqueArticles.length > 0) {
          setSelectedArticleId(uniqueArticles[0].id);
        }
      })
      .catch(err => console.error("Error cargando artículos", err));
  }, []);

  useEffect(() => {
    if (selectedArticleId) {
      if (loadedArticles[selectedArticleId]) {
        setFullArticle(loadedArticles[selectedArticleId]);
      } else {
        api.get(`/articles/${selectedArticleId}`)
          .then(res => {
            setFullArticle(res.data);
            setLoadedArticles(prev => ({ ...prev, [selectedArticleId]: res.data }));
          })
          .catch(err => console.error("Error cargando el detalle del artículo", err));
      }
    }
  }, [selectedArticleId, loadedArticles]);

  const featuredArticles = articles.slice(0, 4);

  const handleDownload = (id) => {
    downloadArticlePdf(id).catch(err => console.error("Error al descargar PDF", err));
  };

  const getMainSections = (sections) => {
    if (!sections) return [];
    const subSectionIds = new Set();

    sections.forEach(sec => {
      if (sec.subSections) {
        sec.subSections.forEach(sub => subSectionIds.add(sub.id));
      }
    });

    return sections
      .filter(sec => !subSectionIds.has(sec.id))
      .sort((a, b) => a.id - b.id);
  };

  const sortSubSections = (subs) => {
    if (!subs) return [];
    return [...subs].sort((a, b) => a.id - b.id);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowContents(false);
    }
  };

  const renderIndex = (sections, level = 0) => {
    if (!sections || sections.length === 0) return null;
    return (
      <ul className="contents-list" style={{ paddingLeft: level > 0 ? '15px' : '0' }}>
        {sections.map((sec) => (
          <li key={sec.id} onClick={() => scrollToSection(sec.id)}>
            {sec.name}
            {sec.subSections && renderIndex(sortSubSections(sec.subSections), level + 1)}
          </li>
        ))}
      </ul>
    );
  };

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
          {!isExpanded && (
            <div className="featured-section">
              <h3 className="section-title">Artículos Destacados</h3>
              <div className="cards-container">
                {featuredArticles.length > 0 ? (
                  featuredArticles.map((art, index) => {
                    const coverImg = (fullArticle && fullArticle.id === art.id)
                      ? fullArticle.coverImageUrl
                      : art.coverImageUrl;

                    return (
                      <div
                        key={`featured-${art.id}-${index}`}
                        className={`article-card ${selectedArticleId === art.id ? 'active-card' : ''}`}
                        onClick={() => setSelectedArticleId(art.id)}
                      >
                        <div className="card-image-placeholder">
                          {coverImg ? (
                            <img src={coverImg} alt={art.title} className="card-cover-img" />
                          ) : (
                            <div className="card-no-img"></div>
                          )}
                        </div>
                        <div className="card-tag">
                          {art.sectionName || 'GENERAL'}
                        </div>
                        <h4>{art.title}</h4>
                      </div>
                    );
                  })
                ) : (
                  <p>No hay artículos disponibles.</p>
                )}
              </div>
            </div>
          )}

          <div className={`article-layout ${isExpanded ? 'expanded' : ''}`}>
            {fullArticle && (
              <div className="article-floating-sidebar">
                <button
                  className="float-btn"
                  title="Alternar Modo Oscuro"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button
                  className="float-btn"
                  title="Expandir / Contraer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>

                <div className="contents-wrapper">
                  <button
                    className="float-btn"
                    title="Contenido"
                    onClick={() => setShowContents(!showContents)}
                  >
                    <List size={20} />
                  </button>

                  {showContents && (
                    <div className="contents-dropdown">
                      <div className="contents-header">
                        <h4>Contenidos</h4>
                        <button onClick={() => setShowContents(false)}><X size={16} /></button>
                      </div>
                      <div className="contents-body">
                        {fullArticle.sections && fullArticle.sections.length > 0 ? (
                          renderIndex(getMainSections(fullArticle.sections))
                        ) : (
                          <p className="no-contents">No hay secciones estructuradas.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="float-btn"
                  title="Descargar PDF APA 7"
                  onClick={() => handleDownload(fullArticle.id)}
                >
                  <Download size={20} />
                </button>
              </div>
            )}

            <article className="main-article">
              {fullArticle ? (
                <>
                  <div className="article-header-layout">
                    <div className="article-text-content">
                      <h1 className="article-title">{fullArticle.title}</h1>
                      <hr />
                      <p>{fullArticle.summary || fullArticle.content || 'Sin contenido detallado.'}</p>
                    </div>

                    {fullArticle.coverImageUrl && (
                      <aside className="article-infobox">
                        <div className="infobox-header">{fullArticle.title}</div>
                        <img src={fullArticle.coverImageUrl} alt="Portada del artículo" />
                      </aside>
                    )}
                  </div>

                  {fullArticle.sections && fullArticle.sections.length > 0 && (
                    <div className="article-sections-body">
                      {getMainSections(fullArticle.sections).map(sec => (
                        <div key={`body-sec-${sec.id}`} id={`section-${sec.id}`} className="article-section">
                          <h2>{sec.name}</h2>
                          {sec.imageUrl && <img src={sec.imageUrl} alt={sec.name} className="section-image" />}
                          <p>{sec.description}</p>

                          {sec.subSections && sec.subSections.length > 0 && (
                            <div className="article-subsections">
                              {sortSubSections(sec.subSections).map(sub => (
                                <div key={`body-subsec-${sub.id}`} id={`section-${sub.id}`} className="article-subsection">
                                  <h3>{sub.name}</h3>
                                  {sub.imageUrl && <img src={sub.imageUrl} alt={sub.name} className="section-image" />}
                                  <p>{sub.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h1 className="article-title">Sin artículos recientes</h1>
                  <hr />
                  <p>Aún no se han publicado artículos en la plataforma o está cargando...</p>
                </>
              )}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}