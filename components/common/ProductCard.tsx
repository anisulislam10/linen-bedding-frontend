
import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
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
      className="group flex flex-col h-full relative bg-gray-600 rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug || product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-700 block">
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${isHovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

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
              await refreshUser();
              toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            } catch (err) {
              toast.error('Failed to update wishlist');
            }
          }}
          className={`absolute top-2 right-2 p-2 transition-all ${isWishlisted ? 'text-white' : 'text-white/60 hover:text-white'}`}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Button - Appears on Hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-white/90 backdrop-blur text-primary py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
          >
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Details Block */}
      <div className="flex flex-col flex-grow text-center p-5">
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="text-base font-sans font-medium text-white mb-2 tracking-wide group-hover:text-sage transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-bold font-sans text-gray-300 tracking-wider">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
