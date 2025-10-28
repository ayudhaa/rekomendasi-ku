import React from 'react';

export default function ProductCard({ title, link }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-lg">📦</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {title}
        </h3>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="
            inline-block w-full bg-gray-500 text-white 
            px-4 py-3 rounded-lg font-medium text-sm
            hover:bg-gray-600 transition-colors duration-200
            text-center
          "
        >
          Liat produknya
        </a>
      </div>
    </div>
  );
}