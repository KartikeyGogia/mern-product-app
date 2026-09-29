import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`);
      if (Array.isArray(res.data)) {
        // Ensure every product has an isPublished boolean flag (default true if not defined)
        const normalized = res.data.map((p) => ({
          ...p,
          isPublished: p.isPublished !== undefined ? p.isPublished : true,
          title: p.title || p.name || 'Untitled Product',
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
        }));
        setProducts(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch products on home page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (productId, currentStatus) => {
    try {
      setUpdatingId(productId);
      const newStatus = !currentStatus;

      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, isPublished: newStatus } : p))
      );

      // Persist to backend
      await axios.put(`${API_URL}/api/products/${productId}`, {
        isPublished: newStatus,
      });
    } catch (err) {
      console.error('Error toggling publish status:', err);
      // Revert on error
      fetchProducts();
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalCount = products.length;
  const publishedProducts = products.filter((p) => p.isPublished);
  const unpublishedProducts = products.filter((p) => !p.isPublished);
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) < 10).length;

  // Filtered by current tab and search query
  const filteredProducts = products.filter((p) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'published'
        ? p.isPublished
        : !p.isPublished;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.type && p.type.toLowerCase().includes(query)) ||
      (p.productType && p.productType.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      style={{
        padding: '24px 28px',
        maxWidth: '1280px',
        margin: '0 auto',
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#111827',
      }}
    >
      {/* Top Header / Welcome */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: '500',
              marginBottom: '4px',
            }}
          >
            {currentDate}
          </div>
          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '26px',
              fontWeight: '700',
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            Product Dashboard
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#4b5563',
            }}
          >
            Track your inventory, manage publishing status, and monitor catalog health.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '9px 16px',
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: '1' }}>+</span> Add Product
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Total Catalog */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
            Total Catalog
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {loading ? '—' : totalCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Registered items</div>
        </div>

        {/* Card 2: Published */}
        <div
          onClick={() => setActiveTab('published')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: activeTab === 'published' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Published</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                fontWeight: '600',
              }}
            >
              ● Active
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>
            {loading ? '—' : publishedProducts.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Visible to customers</div>
        </div>

        {/* Card 3: Unpublished */}
        <div
          onClick={() => setActiveTab('unpublished')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: activeTab === 'unpublished' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Unpublished</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                fontWeight: '600',
              }}
            >
              ○ Draft
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#4b5563', marginBottom: '4px' }}>
            {loading ? '—' : unpublishedProducts.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Hidden from store</div>
        </div>

        {/* Card 4: Inventory Units */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '18px 20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Stock Units</span>
            {lowStockCount > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontWeight: '600',
                }}
              >
                {lowStockCount} low
              </span>
            )}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {loading ? '—' : totalUnits.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Total inventory on hand</div>
        </div>
      </div>

      {/* Main Content Card: Tabs & Product List */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Tab & Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '12px 20px 0 20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fafafa',
            gap: '12px',
          }}
        >
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <button
              onClick={() => setActiveTab('published')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 4px',
                fontSize: '14px',
                fontWeight: activeTab === 'published' ? '600' : '500',
                color: activeTab === 'published' ? '#1e3a8a' : '#6b7280',
                borderBottom: activeTab === 'published' ? '2px solid #1e3a8a' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Published
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  backgroundColor: activeTab === 'published' ? '#dbeafe' : '#f3f4f6',
                  color: activeTab === 'published' ? '#1e40af' : '#4b5563',
                }}
              >
                {publishedProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('unpublished')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 4px',
                fontSize: '14px',
                fontWeight: activeTab === 'unpublished' ? '600' : '500',
                color: activeTab === 'unpublished' ? '#1e3a8a' : '#6b7280',
                borderBottom: activeTab === 'unpublished' ? '2px solid #1e3a8a' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Unpublished
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  backgroundColor: activeTab === 'unpublished' ? '#dbeafe' : '#f3f4f6',
                  color: activeTab === 'unpublished' ? '#1e40af' : '#4b5563',
                }}
              >
                {unpublishedProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 4px',
                fontSize: '14px',
                fontWeight: activeTab === 'all' ? '600' : '500',
                color: activeTab === 'all' ? '#1e3a8a' : '#6b7280',
                borderBottom: activeTab === 'all' ? '2px solid #1e3a8a' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              All Products
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  backgroundColor: activeTab === 'all' ? '#dbeafe' : '#f3f4f6',
                  color: activeTab === 'all' ? '#1e40af' : '#4b5563',
                }}
              >
                {products.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div style={{ paddingBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search by title, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                width: '210px',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '20px' }}>
          {loading ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
              }}
            >
              Loading products catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Clean, Realistic Empty State */
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: '#9ca3af',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>

              <h3
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                {searchQuery
                  ? 'No matching products found'
                  : `No ${activeTab === 'published' ? 'Published' : activeTab === 'unpublished' ? 'Unpublished' : ''} Products`}
              </h3>

              <p
                style={{
                  margin: '0 0 18px 0',
                  fontSize: '13px',
                  color: '#6b7280',
                  maxWidth: '380px',
                  lineHeight: '1.5',
                }}
              >
                {searchQuery
                  ? `No products matched "${searchQuery}". Try clearing your search term.`
                  : activeTab === 'published'
                  ? 'You currently have no products visible in the published store. Publish items from your catalog to show them here.'
                  : 'All your products are currently published. Unpublished drafts will appear here.'}
              </p>

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    padding: '8px 14px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => navigate('/products')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    backgroundColor: '#1e3a8a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Manage Products in Catalog &rarr;
                </button>
              )}
            </div>
          ) : (
            /* Product Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '18px',
              }}
            >
              {filteredProducts.map((product) => {
                const isPublished = product.isPublished;
                const isUpdating = updatingId === product._id;

                return (
                  <div
                    key={product._id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      transition: 'box-shadow 0.15s, border-color 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div
                      style={{
                        position: 'relative',
                        height: '150px',
                        backgroundColor: '#f1f5f9',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={
                          product.image && product.image.trim()
                            ? product.image
                            : `https://picsum.photos/seed/${product._id}/400/250`
                        }
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/400/250';
                        }}
                      />

                      {/* Status Tag Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: isPublished
                            ? 'rgba(16, 185, 129, 0.95)'
                            : 'rgba(100, 116, 139, 0.95)',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '0.02em',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    {/* Product Body */}
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Brand & Category line */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          color: '#6b7280',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          letterSpacing: '0.04em',
                        }}
                      >
                        <span>{product.brand || 'Generic'}</span>
                        <span>•</span>
                        <span>{product.productType || product.type || 'General'}</span>
                      </div>

                      {/* Title */}
                      <h4
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#111827',
                          lineHeight: '1.3',
                        }}
                      >
                        {product.title}
                      </h4>

                      {/* Price and Stock row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginTop: 'auto',
                          paddingTop: '8px',
                          borderTop: '1px solid #f3f4f6',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>
                            ₹{product.price.toFixed(2)}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: product.stock < 10 ? '#b45309' : '#4b5563',
                          }}
                        >
                          {product.stock} in stock
                        </div>
                      </div>

                      {/* Quick Actions Row */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '12px',
                        }}
                      >
                        <button
                          onClick={() => handleTogglePublish(product._id, isPublished)}
                          disabled={isUpdating}
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '6px',
                            border: isPublished ? '1px solid #d1d5db' : 'none',
                            backgroundColor: isPublished ? '#ffffff' : '#1e3a8a',
                            color: isPublished ? '#374151' : '#ffffff',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.15s',
                          }}
                        >
                          {isUpdating
                            ? 'Updating...'
                            : isPublished
                            ? 'Unpublish'
                            : 'Publish Item'}
                        </button>

                        <button
                          onClick={() => navigate('/products')}
                          style={{
                            padding: '7px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#f9fafb',
                            color: '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
