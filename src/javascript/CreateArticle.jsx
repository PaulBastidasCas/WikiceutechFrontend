import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/CreateArticle.css';

export default function ArticleManager() {
    const [articles, setArticles] = useState([]);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [sections, setSections] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await api.get('/articles/admin/all');
            setArticles(res.data);
        } catch (err) {
            console.error("Error al cargar artículos", err);
        }
    };

    const resetForm = () => {
        setSelectedArticleId(null);
        setTitle('');
        setContent('');
        setCoverImageUrl('');
        setIsActive(true);
        setSections([]);
        setExpandedSections({});
    };

    const handleSelectArticle = async (art) => {
        try {
            const res = await api.get(`/articles/${art.id}`);
            const fullArt = res.data;

            setSelectedArticleId(fullArt.id);
            setTitle(fullArt.title || '');
            setContent(fullArt.content || '');
            setCoverImageUrl(fullArt.coverImageUrl || '');
            setIsActive(fullArt.isActive ?? fullArt.active ?? fullArt.is_active ?? true);
            setSections(fullArt.sections || []);
            setExpandedSections({}); 
        } catch (err) {
            console.error("Error al cargar detalles del artículo", err);
            alert("No se pudo cargar la información completa del artículo.");
        }
    };

    const toggleSection = (idx) => {
        setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const uploadImageFile = async (file) => {
        const data = new FormData();
        data.append('file', file);
        setUploading(true);
        try {
            const res = await api.post('/images/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url;
        } catch (err) {
            console.error("Error al subir imagen", err);
            alert("No se pudo subir la imagen");
            return '';
        } finally {
            setUploading(false);
        }
    };

    const handleCoverChange = async (e) => {
        if (e.target.files[0]) {
            const url = await uploadImageFile(e.target.files[0]);
            setCoverImageUrl(url);
        }
    };

    const addSection = () => {
        const newIdx = sections.length;
        setSections([...sections, { name: '', description: '', imageUrl: '', subSections: [] }]);
        setExpandedSections(prev => ({ ...prev, [newIdx]: true })); 
    };

    const removeSection = (index) => {
        const upd = [...sections];
        upd.splice(index, 1);
        setSections(upd);
    };

    const moveSection = (index, direction) => {
        if (index + direction < 0 || index + direction >= sections.length) return;
        const upd = [...sections];
        const temp = upd[index];
        upd[index] = upd[index + direction];
        upd[index + direction] = temp;
        setSections(upd);
    };

    const addSubSection = (sIdx) => {
        const upd = [...sections];
        if (!upd[sIdx].subSections) upd[sIdx].subSections = [];
        upd[sIdx].subSections.push({ name: '', description: '', imageUrl: '' });
        setSections(upd);
    };

    const removeSubSection = (sIdx, subIdx) => {
        const upd = [...sections];
        upd[sIdx].subSections.splice(subIdx, 1);
        setSections(upd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { title, content, coverImageUrl, isActive: isActive, active: isActive, sections };

        try {
            if (selectedArticleId) {
                await api.put(`/articles/${selectedArticleId}`, payload);
                alert('¡Artículo actualizado con éxito!');
            } else {
                await api.post('/articles', payload);
                alert('¡Artículo creado con éxito!');
            }
            fetchArticles();
            resetForm();
        } catch (err) {
            console.error("Error al guardar artículo", err);
            alert('Ocurrió un error al guardar el artículo.');
        }
    };

    return (
        <div className="article-manager-layout" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
            <div className="article-sidebar" style={{ width: '300px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <h3>Gestión de Artículos</h3>
                <button onClick={resetForm} style={{ marginBottom: '15px', width: '100%', padding: '8px', background: '#005c7a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + Crear Nuevo Artículo
                </button>
                <div className="article-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {articles.map((art) => {
                        const isArtActive = art.isActive ?? art.active ?? art.is_active ?? false;
                        return (
                            <div
                                key={art.id}
                                onClick={() => handleSelectArticle(art)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '8px',
                                    background: selectedArticleId === art.id ? '#e2e8f0' : 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: '1px solid #cbd5e1'
                                }}
                            >
                                <strong>{art.title}</strong>
                                <p style={{ fontSize: '0.8rem', color: isArtActive ? 'green' : 'red' }}>
                                    {isArtActive ? '● Activo' : '● Inactivo'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="create-article-container" style={{ flex: 1, margin: 0 }}>
                <h2>{selectedArticleId ? 'Editar Artículo' : 'Crear Nuevo Artículo'}</h2>
                <form onSubmit={handleSubmit} className="article-form">

                    <div className="form-group">
                        <label>Estado Inicial</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Publicar activo inmediatamente (Visible en la plataforma)
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Contenido Principal</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Imagen de Portada</label>
                        <input type="file" onChange={handleCoverChange} accept="image/*" />
                        {coverImageUrl && <p className="success-text">✔ Imagen cargada con éxito</p>}
                    </div>

                    <hr />
                    <h3>Secciones</h3>
                    {sections.map((sec, sIdx) => (
                        <div key={sIdx} className="section-box">
                            <div className="section-header-bar" onClick={() => toggleSection(sIdx)}>
                                <strong>{sIdx + 1}. {sec.name || 'Nueva Sección'}</strong>
                                <div className="section-actions" onClick={e => e.stopPropagation()}>
                                    <button type="button" onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0}>↑ Subir</button>
                                    <button type="button" onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1}>↓ Bajar</button>
                                    <button type="button" onClick={() => removeSection(sIdx)} className="btn-danger">X Eliminar</button>
                                    <button type="button" onClick={() => toggleSection(sIdx)} className="btn-toggle">
                                        {expandedSections[sIdx] ? '▲' : '▼'}
                                    </button>
                                </div>
                            </div>

                            {/* Contenido Colapsable */}
                            {expandedSections[sIdx] && (
                                <div className="section-content-area">
                                    <input
                                        type="text" placeholder="Nombre de sección" value={sec.name}
                                        onChange={e => {
                                            const upd = [...sections];
                                            upd[sIdx].name = e.target.value;
                                            setSections(upd);
                                        }}
                                    />
                                    <textarea
                                        placeholder="Descripción de sección" value={sec.description}
                                        onChange={e => {
                                            const upd = [...sections];
                                            upd[sIdx].description = e.target.value;
                                            setSections(upd);
                                        }}
                                    />
                                    <input
                                        type="file" accept="image/*"
                                        onChange={async e => {
                                            if (e.target.files[0]) {
                                                const url = await uploadImageFile(e.target.files[0]);
                                                const upd = [...sections];
                                                upd[sIdx].imageUrl = url;
                                                setSections(upd);
                                            }
                                        }}
                                    />

                                    <div className="subsections-container">
                                        <h4>Subsecciones</h4>
                                        {(sec.subSections || []).map((sub, subIdx) => (
                                            <div key={subIdx} className="subsection-box">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                                    <button type="button" onClick={() => removeSubSection(sIdx, subIdx)} className="btn-danger-small">Quitar</button>
                                                </div>
                                                <input
                                                    type="text" placeholder="Nombre subsección" value={sub.name}
                                                    onChange={e => {
                                                        const upd = [...sections];
                                                        upd[sIdx].subSections[subIdx].name = e.target.value;
                                                        setSections(upd);
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Descripción subsección" value={sub.description}
                                                    onChange={e => {
                                                        const upd = [...sections];
                                                        upd[sIdx].subSections[subIdx].description = e.target.value;
                                                        setSections(upd);
                                                    }}
                                                />
                                                <input
                                                    type="file" accept="image/*"
                                                    onChange={async e => {
                                                        if (e.target.files[0]) {
                                                            const url = await uploadImageFile(e.target.files[0]);
                                                            const upd = [...sections];
                                                            upd[sIdx].subSections[subIdx].imageUrl = url;
                                                            setSections(upd);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addSubSection(sIdx)} style={{ marginTop: '10px' }}>+ Añadir Subsección</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="button" className="btn-add-sec" onClick={addSection}>+ Añadir Sección Principal</button>
                    <button type="submit" className="btn-submit" disabled={uploading}>
                        {uploading ? 'Subiendo imágenes...' : (selectedArticleId ? 'Actualizar Artículo' : 'Guardar Artículo Completo')}
                    </button>
                </form>
            </div>
        </div>
    );
}