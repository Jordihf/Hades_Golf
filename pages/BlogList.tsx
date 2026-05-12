import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowRight, Calendar, User } from 'lucide-react';

const BlogList: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-4">
            Blog y Noticias
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Actualidad <span className="text-blue-600">Hades Golf</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Novedades de producto, casos de éxito y las mejores prácticas para automatizar la gestión de tu club.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group border border-slate-100"
            >
              <div className="w-full aspect-[3/2] overflow-hidden relative bg-slate-100 flex items-center justify-center">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center space-x-4 text-xs font-medium text-slate-400 mb-4">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 text-pretty">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-blue-600 font-bold text-sm tracking-wide">
                  Leer artículo completo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
