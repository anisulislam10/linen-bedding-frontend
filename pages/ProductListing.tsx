
import React, { useMemo } from 'react';
// Added Link to imports from react-router-dom
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { PRODUCTS } from '../constants';

const ProductListing: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (initialCategory !== 'All') {
      result = result.filter(p => p.category === initialCategory);
    }
    if (initialQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(initialQuery.toLowerCase()));
    }
    return result;
  }, [initialCategory, initialQuery]);

  return (
    <div className="bg-white min-h-screen pt-12">
      <main className="p-6 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-24">
          <div>
            <h1 className="text-6xl lg:text-9xl font-black text-gray-950 tracking-tighter leading-none mb-6">
              {initialCategory === 'All' ? 'Complete' : initialCategory}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="h-1 w-12 bg-black"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                {filteredProducts.length} Results in Collective
              </p>
            </div>
          </div>
          
          {initialQuery && (
            <div className="mt-8 md:mt-0 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] bg-indigo-50 px-6 py-2 rounded-full">
              Query: {initialQuery}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-16">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-40 text-center">
              <p className="text-2xl font-black text-gray-200 uppercase tracking-[0.5em]">No entries found in ledger</p>
              <Link to="/products" className="mt-8 inline-block text-black font-black border-b-2 border-black pb-1">RESET INDEX</Link>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductListing;
