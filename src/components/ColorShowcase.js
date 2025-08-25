import React from 'react';
import { Heart, Star, Zap, Sun, Sparkles } from 'lucide-react';

const ColorShowcase = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🎨 New Vibrant Color Scheme</h2>
        <p className="text-gray-600">Youth-friendly colors that inspire and engage!</p>
      </div>

      {/* Primary Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Primary Colors (Indigo/Purple)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { shade: '500', class: 'bg-primary-500', hex: '#6366f1', name: 'Primary' },
            { shade: '600', class: 'bg-primary-600', hex: '#4f46e5', name: 'Primary Dark' },
            { shade: '400', class: 'bg-primary-400', hex: '#818cf8', name: 'Primary Light' },
            { shade: '100', class: 'bg-primary-100', hex: '#e0e7ff', name: 'Primary Pale' },
            { shade: '50', class: 'bg-primary-50', hex: '#f0f4ff', name: 'Primary Lightest' },
          ].map(color => (
            <div key={color.shade} className="text-center">
              <div className={`${color.class} h-16 w-full rounded-lg mb-2 shadow-md hover-lift`}></div>
              <p className="text-xs font-medium text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Secondary Colors (Pink)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { shade: '500', class: 'bg-secondary-500', hex: '#ec4899', name: 'Secondary' },
            { shade: '600', class: 'bg-secondary-600', hex: '#db2777', name: 'Secondary Dark' },
            { shade: '400', class: 'bg-secondary-400', hex: '#f472b6', name: 'Secondary Light' },
            { shade: '100', class: 'bg-secondary-100', hex: '#fce7f3', name: 'Secondary Pale' },
            { shade: '50', class: 'bg-secondary-50', hex: '#fdf2f8', name: 'Secondary Lightest' },
          ].map(color => (
            <div key={color.shade} className="text-center">
              <div className={`${color.class} h-16 w-full rounded-lg mb-2 shadow-md hover-lift`}></div>
              <p className="text-xs font-medium text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Accent Colors (Green)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { shade: '500', class: 'bg-accent-500', hex: '#22c55e', name: 'Accent' },
            { shade: '600', class: 'bg-accent-600', hex: '#16a34a', name: 'Accent Dark' },
            { shade: '400', class: 'bg-accent-400', hex: '#4ade80', name: 'Accent Light' },
            { shade: '100', class: 'bg-accent-100', hex: '#dcfce7', name: 'Accent Pale' },
            { shade: '50', class: 'bg-accent-50', hex: '#f0fdf4', name: 'Accent Lightest' },
          ].map(color => (
            <div key={color.shade} className="text-center">
              <div className={`${color.class} h-16 w-full rounded-lg mb-2 shadow-md hover-lift`}></div>
              <p className="text-xs font-medium text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Faith Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Faith Colors (Golden)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { shade: '500', class: 'bg-faith-500', hex: '#f59e0b', name: 'Faith' },
            { shade: '600', class: 'bg-faith-600', hex: '#d97706', name: 'Faith Dark' },
            { shade: '400', class: 'bg-faith-400', hex: '#fbbf24', name: 'Faith Light' },
            { shade: '100', class: 'bg-faith-100', hex: '#fef3c7', name: 'Faith Pale' },
            { shade: '50', class: 'bg-faith-50', hex: '#fffbeb', name: 'Faith Lightest' },
          ].map(color => (
            <div key={color.shade} className="text-center">
              <div className={`${color.class} h-16 w-full rounded-lg mb-2 shadow-md hover-lift`}></div>
              <p className="text-xs font-medium text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Energy Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Energy Colors (Orange)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { shade: '500', class: 'bg-energy-500', hex: '#f97316', name: 'Energy' },
            { shade: '600', class: 'bg-energy-600', hex: '#ea580c', name: 'Energy Dark' },
            { shade: '400', class: 'bg-energy-400', hex: '#fb923c', name: 'Energy Light' },
            { shade: '100', class: 'bg-energy-100', hex: '#ffedd5', name: 'Energy Pale' },
            { shade: '50', class: 'bg-energy-50', hex: '#fff7ed', name: 'Energy Lightest' },
          ].map(color => (
            <div key={color.shade} className="text-center">
              <div className={`${color.class} h-16 w-full rounded-lg mb-2 shadow-md hover-lift`}></div>
              <p className="text-xs font-medium text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Beautiful Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="gradient-bg h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift glow-primary">
            Primary Gradient
          </div>
          <div className="faith-gradient h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift glow-secondary">
            Faith Gradient
          </div>
          <div className="youth-gradient h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift glow-accent">
            Youth Gradient
          </div>
          <div className="energy-gradient h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift">
            Energy Gradient
          </div>
          <div className="heaven-gradient h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift">
            Heaven Gradient
          </div>
          <div className="prayer-gradient h-24 rounded-xl flex items-center justify-center text-white font-semibold hover-lift">
            Prayer Gradient
          </div>
        </div>
      </div>

      {/* Interactive Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Interactive Elements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Heart size={20} />
            <span>Prayer Request</span>
          </button>
          <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Star size={20} />
            <span>Favorite</span>
          </button>
          <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Zap size={20} />
            <span>Quick Action</span>
          </button>
          <button className="bg-faith-500 hover:bg-faith-600 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Sun size={20} />
            <span>Devotional</span>
          </button>
          <button className="bg-energy-500 hover:bg-energy-600 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Sparkles size={20} />
            <span>Events</span>
          </button>
          <button className="gradient-bg hover:scale-105 text-white px-6 py-3 rounded-lg font-semibold hover-lift transition-all duration-200 flex items-center justify-center space-x-2">
            <Heart size={20} />
            <span>Gradient Button</span>
          </button>
        </div>
      </div>

      {/* Color Usage Guide */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">🎯 Color Usage Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-primary-600 mb-2">🔷 Primary (Indigo)</h4>
            <p className="text-sm text-gray-600">Main actions, navigation, primary buttons</p>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-600 mb-2">💖 Secondary (Pink)</h4>
            <p className="text-sm text-gray-600">Love, prayer requests, community features</p>
          </div>
          <div>
            <h4 className="font-semibold text-accent-600 mb-2">🌱 Accent (Green)</h4>
            <p className="text-sm text-gray-600">Growth, success, positive actions</p>
          </div>
          <div>
            <h4 className="font-semibold text-faith-600 mb-2">✨ Faith (Golden)</h4>
            <p className="text-sm text-gray-600">Spiritual content, devotionals, wisdom</p>
          </div>
          <div>
            <h4 className="font-semibold text-energy-600 mb-2">🔥 Energy (Orange)</h4>
            <p className="text-sm text-gray-600">Events, excitement, call-to-actions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorShowcase;
