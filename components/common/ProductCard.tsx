
import React, { useState } from 'react';
import { Star, ShoppingBag, Heart, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistService } from '../../services/wishlistService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (user?.wishlist) {
      const wishIds = (user.wishlist as any[]).map(item => typeof item === 'string' ? item : item._id);
      return wishIds.includes(product._id);
    }
    return false;
  });

  return (
    <div
      className="group flex flex-col h-full bg-white relative shadow-luxury p-1 rounded-3xl md:rounded-[2.5rem]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug || product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-[1.8rem] md:rounded-[2.2rem]">
        <img
          src={(isHovered && product.secondaryImage) ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-[2000ms] ease-out scale-100 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
        />

        {/* Floating Add to Cart */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-6 pointer-events-none">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-white/90 backdrop-blur-md text-black py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 md:gap-4 hover:bg-black hover:text-white transition-all transform translate-y-6 group-hover:translate-y-0 shadow-2xl pointer-events-auto"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Quick Access</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Wishlist Marker */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLoggedIn) {
              toast.error('Please login to use wishlist');
              return;
            }
            try {
              await wishlistService.toggleWishlist(product._id);
              setIsWishlisted(!isWishlisted);
              await refreshUser();  // Sync user data
              toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            } catch (err) {
              toast.error('Failed to update wishlist');
            }
          }}
          className={`absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 transition-all opacity-0 group-hover:opacity-100 ${isWishlisted ? 'text-red-500 scale-110' : 'text-white/40 hover:text-red-500'}`}
        >
          <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isWishlisted ? 'fill-current' : 'hover:fill-current'}`} />
        </button>
      </Link>

      {/* Product Details Block */}
      <div className="pt-4 md:pt-8 pb-4 md:pb-6 px-4 md:px-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <Link to={`/products/${product.slug || product.id}`} className="flex-1">
            <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs md:text-sm font-black text-gray-400 font-mono tracking-tighter">
            ${product.price.toFixed(0)}
          </span>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
            <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-400 fill-current" />
            <span className="text-[8px] md:text-[10px] font-black text-gray-900">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
