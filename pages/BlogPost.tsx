import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="pt-40 pb-24 min-h-screen text-center bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Artículo no encontrado</h1>
        <p className="text-slate-600 mb-8">Parece que este enlace no existe o ha sido movido.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center"
        >
          <ArrowLeft className="mr-2" /> Volver al Blog
        </button>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/blog" className="inline-flex items-center text-sm font-bold text-blue-600 mb-8 hover:text-blue-800 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Noticias
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium text-slate-500 mb-6 flex-wrap gap-y-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
              <Tag className="w-3 h-3 mr-1" /> {post.category}
            </span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mx-2 text-slate-400" /> {post.date}</span>
            <span className="flex items-center"><User className="w-4 h-4 mx-2 text-slate-400" /> {post.author}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
            {post.title}
          </h1>
        </header>

        {/* Feature Image */}
        <div className="w-full rounded-3xl overflow-hidden mb-12 shadow-xl shadow-slate-200/50 bg-slate-100 flex items-center justify-center">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-img:rounded-2xl">
          <p className="text-xl md:text-2xl font-light text-slate-500 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-500/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Quieres ver a Hades en acción?</h3>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Descubre cómo nuestros agentes de IA pueden transformar la operativa de tu club de golf y aumentar tus ingresos como en este caso.
          </p>
          <button 
            onClick={() => navigate('/#precios')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg inline-flex items-center"
          >
            Ver Planes y Precios
          </button>
        </div>

      </div>
    </article>
  );
};

export default BlogPost;
