import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { HiFilter, HiShoppingCart, HiTag, HiX, HiCheckCircle, HiSearch, HiMinus, HiPlus } from 'react-icons/hi';
import { MdStorefront, MdCategory, MdSearch, MdClose } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const renderFormattedDescription = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Match bullet symbols: •, -, *, +, >
        const bulletMatch = trimmed.match(/^([•\-\*\+\>])\s*(.*)/);
        // Match numbered lists: 1., 2), etc.
        const numberMatch = trimmed.match(/^(\d+[\.\)])\s*(.*)/);

        if (bulletMatch) {
          const content = bulletMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:scale-125 transition-transform" />
              <span className="flex-1 text-slate-200">{content}</span>
            </div>
          );
        }

        if (numberMatch) {
          const num = numberMatch[1];
          const content = numberMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1 group">
              <span className="text-cyan-400 font-mono font-bold text-xs shrink-0 mt-0.5 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                {num}
              </span>
              <span className="flex-1 text-slate-200">{content}</span>
            </div>
          );
        }

        // Regular header / paragraph line
        return (
          <p key={idx} className="text-slate-200 font-medium my-1">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

const COIN_PACKAGES = [
  { coins: 1000, price: 5, label: '1,000 PC — $5.00' },
  { coins: 2100, price: 10, label: '2,100 PC — $10.00' },
  { coins: 4300, price: 20, label: '4,300 PC — $20.00' },
  { coins: 7750, price: 35, label: '7,750 PC — $35.00' },
  { coins: 11500, price: 50, label: '11,500 PC — $50.00' },
  { coins: 24000, price: 100, label: '24,000 PC — $100.00' }
];

const getDynamicCoinPackages = (item) => {
  if (item && item.coin_options) {
    try {
      const rows = typeof item.coin_options === 'string' ? JSON.parse(item.coin_options) : item.coin_options;
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(r => ({
          coins: parseInt(r.coins) || 0,
          price: parseFloat(r.price) || 0,
          label: `${(parseInt(r.coins) || 0).toLocaleString()} PC — $${(parseFloat(r.price) || 0).toFixed(2)}`
        }));
      }
    } catch { /* silent */ }
  }
  if (item && item.description) {
    const lines = item.description.split('\n');
    const parsed = [];
    lines.forEach(line => {
      const match = line.match(/(?:([0-9,\.]+)\s*PC\s*[\-\—\=]\s*\$?([0-9\.]+))|(?:\$?([0-9\.]+)\s*[\-\—\=]\s*([0-9,\.]+)\s*PC)/i);
      if (match) {
        const coinsStr = (match[1] || match[4] || '').replace(/,/g, '');
        const priceStr = match[2] || match[3] || '';
        const coins = parseInt(coinsStr);
        const price = parseFloat(priceStr);
        if (!isNaN(coins) && !isNaN(price)) {
          parsed.push({
            coins,
            price,
            label: `${coins.toLocaleString()} PC — $${price.toFixed(2)}`
          });
        }
      }
    });
    if (parsed.length > 0) return parsed;
  }
  return COIN_PACKAGES;
};

const isCoinItem = (item) => {
  if (!item) return false;
  if (item.coin_options) {
    try {
      const parsed = typeof item.coin_options === 'string' ? JSON.parse(item.coin_options) : item.coin_options;
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    } catch { /* silent */ }
  }
  return false;
};

const getItemImageUrl = (item) => {
  if (!item) return null;
  return item.image_url || null;
};

const Donate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState(null);
  const [itemDetailModal, setItemDetailModal] = useState(null);
  const [ingameName, setIngameName] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCoinPkgIdx, setSelectedCoinPkgIdx] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/donate-categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  };

  const fetchItems = async (categoryId = null) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/donate-items`;
      if (categoryId) url += `?category_id=${categoryId}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const openItemDetail = (item) => {
    setItemDetailModal(item);
  };

  const handlePurchase = (item) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setPurchaseModal(item);
    setItemDetailModal(null);
    setIngameName('');
    setDiscordUsername('');
    setQuantity(1);
    setSelectedCoinPkgIdx(0);
  };

  const confirmPurchase = async (e, customItem = null) => {
    if (e) e.preventDefault();
    const targetItem = customItem || itemDetailModal || purchaseModal;
    if (!targetItem) return;
    const nameTrimmed = ingameName.trim();
    if (!nameTrimmed) return;
    if (!nameTrimmed.includes('_') || nameTrimmed.startsWith('_') || nameTrimmed.endsWith('_')) {
      return;
    }
    if (!discordUsername.trim()) return;

    const isCoin = isCoinItem(targetItem);
    const coinPkgs = getDynamicCoinPackages(targetItem);
    const selectedPkg = coinPkgs[selectedCoinPkgIdx] || coinPkgs[0] || COIN_PACKAGES[0];
    const finalQuantity = Math.max(1, parseInt(quantity) || 1);

    setPurchasing(true);
    try {
      const res = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          item_id: targetItem.id,
          ingame_name: ingameName.trim(),
          discord_username: discordUsername.trim(),
          quantity: finalQuantity,
          package_price: isCoin ? selectedPkg.price : undefined,
          package_coins: isCoin ? selectedPkg.coins : undefined,
          package_label: isCoin ? selectedPkg.label : undefined,
          notes: isCoin ? `${finalQuantity}x (${selectedPkg.label})` : ''
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessModal({
          ticketId: data.id,
          item: isCoin ? { ...targetItem, name: `${targetItem.name} [${finalQuantity}x ${selectedPkg.label}]` } : targetItem,
          quantity: finalQuantity
        });
        setPurchaseModal(null);
        setItemDetailModal(null);
      } else {
        alert(data.message || 'Failed to create ticket');
      }
    } catch {
      alert('Network error. Please try again.');
    }
    setPurchasing(false);
  };

  const totalItemCount = Array.isArray(categories) ? categories.reduce((sum, c) => sum + (parseInt(c.item_count) || 0), 0) : 0;

  const rawItemList = Array.isArray(items) ? items : [];
  const itemList = rawItemList;

  const sortedItems = [...itemList].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="min-h-screen bg-[#080d13] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MdStorefront className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                Store
              </h1>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">
                Support the server • Get exclusive items
              </p>
            </div>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-cyan-500/60 via-cyan-500/20 to-transparent mt-4 mb-6"></div>

          {/* How It Works Banner */}
          <div className="bg-[#0d1117]/90 border border-cyan-500/25 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-emerald-500 to-cyan-500"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h2 className="text-white font-black text-sm md:text-base uppercase tracking-widest">
                HOW IT WORKS
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  cardId: 1,
                  steps: [
                    {
                      num: 1,
                      isLink: true,
                      linkLabel: 'Register an Account',
                      linkUrl: '/register',
                      suffix: ' – Create your account here before making a purchase.',
                    },
                    {
                      num: 2,
                      text: 'Select an item and click Purchase.',
                    },
                  ],
                },
                {
                  cardId: 2,
                  steps: [
                    { num: 3, text: 'Enter your IGN and Discord Username.' },
                    { num: 4, text: 'Click Create Order.' },
                    { num: 5, text: 'Open My Tickets to chat with an admin.' },
                  ],
                },
                {
                  cardId: 3,
                  steps: [
                    { num: 6, text: 'You can add multiple items in your existing ticket/chat.' },
                    { num: 7, text: 'Complete your payment.' },
                    { num: 8, text: 'Your order will be processed and delivered.' },
                  ],
                },
              ].map((card) => (
                <div
                  key={card.cardId}
                  className="bg-[#131a22] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-center gap-3 transition-all duration-200 h-full"
                >
                  {card.steps.map((item) => (
                    <div key={item.num} className="flex items-center gap-2.5 group/step">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover/step:bg-cyan-500 group-hover/step:text-black transition-colors">
                        {item.num}
                      </span>
                      <p className="text-slate-300 text-xs font-medium leading-snug">
                        {item.isLink ? (
                          <>
                            <Link to={item.linkUrl} className="text-cyan-400 font-bold underline hover:text-cyan-300 transition-colors">
                              {item.linkLabel}
                            </Link>
                            {item.suffix}
                          </>
                        ) : (
                          item.text
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── CATEGORIES SIDEBAR ── */}
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileCatOpen(!mobileCatOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white text-sm font-bold uppercase tracking-wider"
          >
            <MdCategory className="text-cyan-400" size={18} />
            Categories
            <span className="ml-auto bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md text-xs font-mono">
              {categories.length}
            </span>
          </button>

          {/* Sidebar */}
          <aside className={`lg:col-span-3 ${mobileCatOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden sticky top-24">
              {/* Sidebar header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                <MdCategory className="text-cyan-400" size={18} />
                <h2 className="text-white font-black uppercase tracking-wider text-sm">Categories</h2>
              </div>

              {/* Category list */}
              <div className="p-2">
                {/* All items */}
                <button
                  onClick={() => { setSelectedCategory(null); setMobileCatOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                    selectedCategory === null
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span>All Items</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                    selectedCategory === null ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {totalItemCount}
                  </span>
                </button>

                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setMobileCatOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                      selectedCategory === cat.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {cat.item_count || 0}
                    </span>
                  </button>
                ))}

                {categories.length === 0 && (
                  <p className="text-slate-600 text-xs text-center py-6">No categories yet</p>
                )}
              </div>
            </div>
          </aside>

          {/* ── ITEMS GRID ── */}
          <main className="lg:col-span-9">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <p className="text-slate-400 text-sm">
                Showing <span className="text-white font-bold">{sortedItems.filter(item => !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase().trim())) || (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))).length}</span> items
                {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                  <span className="text-cyan-400"> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                )}
              </p>
              
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-64">
                  <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="w-full pl-10 pr-8 py-2.5 bg-[#0d1117] border border-slate-800 focus:border-cyan-500/50 rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <MdClose size={16} />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-[#0d1117] border border-slate-800 text-slate-300 text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <option value="default" className="bg-[#0b0f15] text-slate-200">Default</option>
                    <option value="price-low" className="bg-[#0b0f15] text-slate-200">Price: Low to High</option>
                    <option value="price-high" className="bg-[#0b0f15] text-slate-200">Price: High to Low</option>
                    <option value="name" className="bg-[#0b0f15] text-slate-200">Name: A-Z</option>
                    <option value="newest" className="bg-[#0b0f15] text-slate-200">Newest First</option>
                  </select>
                  <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={16} />
                </div>
              </div>
            </div>

            {/* Items */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 text-sm uppercase tracking-widest">Loading items...</p>
                </div>
              </div>
            ) : sortedItems.filter(item => !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) || (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase().trim())) || (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#0d1117] border border-dashed border-slate-800 rounded-2xl">
                <MdStorefront className="text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No items found</p>
                <p className="text-slate-600 text-sm mt-1">Try searching for something else or clear your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
                {sortedItems
                  .filter(item => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase().trim();
                    return (
                      item.name.toLowerCase().includes(q) ||
                      (item.category_name && item.category_name.toLowerCase().includes(q)) ||
                      (item.description && item.description.toLowerCase().includes(q))
                    );
                  })
                  .map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative bg-[#131a22] border border-slate-700/60 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300 flex flex-col shadow-xl"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Inner Image Container matching reference */}
                    <div 
                      onClick={() => openItemDetail(item)}
                      className="relative w-full max-w-[210px] aspect-square mx-auto rounded-lg overflow-hidden bg-[#080d13] mb-4 flex items-center justify-center border border-slate-800 cursor-pointer group-hover:border-cyan-500/50 transition-all"
                      title="Click to view details"
                    >
                      {getItemImageUrl(item) ? (
                        <img
                          src={getItemImageUrl(item)}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MdStorefront className="text-slate-700" size={60} />
                        </div>
                      )}
                      {/* Category badge */}
                      {item.category_name && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          <HiTag size={10} />
                          {item.category_name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <h3 
                        onClick={() => openItemDetail(item)}
                        className="text-white font-bold text-base line-clamp-1 hover:text-cyan-400 hover:underline cursor-pointer transition-colors inline-block"
                        title="Click to view details"
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Price & Purchase Button Row */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-700/60">
                      <div>
                        <span className="text-emerald-400 font-black text-lg">
                          {isCoinItem(item) ? 'From $5.00' : `$${parseFloat(item.price).toFixed(2)}`}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePurchase(item)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-200 cursor-pointer active:scale-95"
                      >
                        <HiShoppingCart size={14} />
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── PURCHASE CONFIRMATION MODAL ── */}
      {purchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 shrink-0"></div>
            <div className="p-6 overflow-y-auto flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <HiShoppingCart className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">Confirm Purchase</h3>
                  </div>
                </div>
                <button onClick={() => setPurchaseModal(null)} className="text-slate-500 hover:text-white transition-colors">
                  <HiX size={20} />
                </button>
              </div>

              {/* Item preview */}
              <div className="bg-[#080d13] border border-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4">
                  {getItemImageUrl(purchaseModal) ? (
                    <img src={getItemImageUrl(purchaseModal)} alt={purchaseModal.name} className="w-16 h-16 rounded-lg object-contain p-1 border border-slate-700 bg-[#0b0f15]" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center">
                      <MdStorefront className="text-slate-600" size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{purchaseModal.name}</h4>
                    {purchaseModal.category_name && (
                      <p className="text-cyan-400 text-xs mt-0.5">{purchaseModal.category_name}</p>
                    )}
                    <p className="text-slate-400 text-xs mt-0.5">
                      Unit Price: <span className="text-emerald-400 font-bold">
                        {isCoinItem(purchaseModal) ? `$${COIN_PACKAGES[selectedCoinPkgIdx].price.toFixed(2)}` : `$${parseFloat(purchaseModal.price).toFixed(2)}`}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Details Form */}
              <form onSubmit={confirmPurchase} className="space-y-3.5 mb-5">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Ingame Name *</label>
                  <input
                    type="text"
                    required
                    value={ingameName}
                    onChange={e => setIngameName(e.target.value)}
                    placeholder="e.g. Joe_Doe"
                    className={`w-full px-3.5 py-2 bg-[#080d13] border rounded-xl text-white text-xs focus:outline-none transition-all ${
                      ingameName.length > 0 && !ingameName.includes('_')
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {ingameName.length > 0 && !ingameName.includes('_') && (
                    <p className="text-amber-400 text-[11px] font-medium mt-0.5 flex items-center gap-1 animate-fadeIn">
                      ⚠️ Must include an underscore '_' (e.g. Joe_Doe)
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Discord Username *</label>
                  <input
                    type="text"
                    required
                    value={discordUsername}
                    onChange={e => setDiscordUsername(e.target.value)}
                    placeholder="e.g. username"
                    className="w-full px-3.5 py-2 bg-[#080d13] border border-slate-800 focus:border-cyan-500 rounded-xl text-white text-xs focus:outline-none transition-all"
                  />
                </div>

                {/* Coin Package Selector and Package Quantity */}
                {isCoinItem(purchaseModal) ? (
                  (() => {
                    const pkgs = getDynamicCoinPackages(purchaseModal);
                    const selPkg = pkgs[selectedCoinPkgIdx] || pkgs[0] || COIN_PACKAGES[0];
                    const pkgQty = Math.max(1, parseInt(quantity) || 1);
                    const totalCost = selPkg.price * pkgQty;
                    const totalCoins = selPkg.coins * pkgQty;

                    return (
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Select Coin Package *</label>
                          <select
                            value={selectedCoinPkgIdx}
                            onChange={e => setSelectedCoinPkgIdx(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 bg-[#080d13] border border-cyan-500/50 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
                          >
                            {pkgs.map((pkg, pIdx) => (
                              <option key={pIdx} value={pIdx} className="bg-[#0b0f15] text-white">
                                {pkg.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Package Quantity Selector */}
                        <div className="grid grid-cols-2 gap-3 items-center pt-1">
                          <div className="flex flex-col gap-1">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Package Quantity *</label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setQuantity(q => Math.max(1, (parseInt(q) || 1) - 1))}
                                className="w-9 h-9 rounded-lg bg-[#141c26] hover:bg-[#1e2836] border border-slate-700/60 flex items-center justify-center text-slate-200 hover:text-white font-bold transition-all cursor-pointer select-none active:scale-95"
                              >
                                <HiMinus size={14} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                required
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="w-12 h-9 text-center bg-[#080d13] border border-slate-700/80 focus:border-cyan-500 rounded-lg text-white text-xs font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => setQuantity(q => (parseInt(q) || 0) + 1)}
                                className="w-9 h-9 rounded-lg bg-[#141c26] hover:bg-[#1e2836] border border-slate-700/60 flex items-center justify-center text-slate-200 hover:text-white font-bold transition-all cursor-pointer select-none active:scale-95"
                              >
                                <HiPlus size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-end text-right">
                            <span className="text-amber-400 font-bold text-xs">
                              = {totalCoins.toLocaleString()} PC Total
                            </span>
                            <span className="text-emerald-400 font-black text-xl mt-0.5">
                              ${totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Quantity *</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.max(1, (parseInt(q) || 1) - 1))}
                          className="w-9 h-9 rounded-lg bg-[#141c26] hover:bg-[#1e2836] border border-slate-700/60 flex items-center justify-center text-slate-200 hover:text-white font-bold transition-all cursor-pointer select-none active:scale-95"
                        >
                          <HiMinus size={14} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          className="w-12 h-9 text-center bg-[#080d13] border border-slate-700/80 focus:border-cyan-500 rounded-lg text-white text-xs font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(q => (parseInt(q) || 0) + 1)}
                          className="w-9 h-9 rounded-lg bg-[#141c26] hover:bg-[#1e2836] border border-slate-700/60 flex items-center justify-center text-slate-200 hover:text-white font-bold transition-all cursor-pointer select-none active:scale-95"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Amount</span>
                      <span className="text-emerald-400 font-black text-xl">
                        ${(parseFloat(purchaseModal.price) * Math.max(1, parseInt(quantity) || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setPurchaseModal(null)}
                    className="px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={purchasing || !ingameName.trim() || !ingameName.includes('_') || !discordUsername.trim()}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {purchasing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <HiShoppingCart size={14} />
                        Create Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── ITEM DETAIL MODAL ── */}
      {itemDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080d13]/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Top Accent Line */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 shrink-0"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#0d1117] shrink-0">
              <div className="flex items-center gap-2">
                <HiTag className="text-cyan-400" size={18} />
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">Item Details</h3>
              </div>
              <button
                onClick={() => setItemDetailModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Modal Content Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Image & Main Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left: Image */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="w-full aspect-square max-w-[180px] rounded-xl bg-[#080d13] border border-slate-800 p-3 flex items-center justify-center shadow-inner">
                    {getItemImageUrl(itemDetailModal) ? (
                      <img
                        src={getItemImageUrl(itemDetailModal)}
                        alt={itemDetailModal.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <MdStorefront className="text-slate-700" size={60} />
                    )}
                  </div>
                </div>

                {/* Right: Title, Category & Price */}
                <div className="sm:col-span-7 space-y-2 text-center sm:text-left">
                  {itemDetailModal.category_name && (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      <HiTag size={12} />
                      {itemDetailModal.category_name}
                    </span>
                  )}
                  <h2 className="text-white font-black text-2xl tracking-wide">{itemDetailModal.name}</h2>
                  
                  {/* Price display */}
                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Price</span>
                    <span className="text-emerald-400 font-black text-2xl">
                      ${parseFloat(itemDetailModal.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Box (Only rendered if description exists) */}
              {itemDetailModal.description && (
                <div className="pt-2">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Description</h4>
                  <div className="bg-[#080d13] border border-slate-800 rounded-xl p-4 text-slate-300 text-xs sm:text-sm leading-relaxed max-h-56 overflow-y-auto shadow-inner">
                    {renderFormattedDescription(itemDetailModal.description)}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Footer (Pinned at bottom) */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-[#0d1117] shrink-0">
              <button
                type="button"
                onClick={() => setItemDetailModal(null)}
                className="px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handlePurchase(itemDetailModal)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95"
              >
                <HiShoppingCart size={15} />
                Purchase Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0b0f15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-white font-bold uppercase tracking-wider text-lg mb-2">Ticket Created!</h3>
              <p className="text-slate-400 text-sm mb-2">
                Your purchase ticket for <strong className="text-emerald-400">{successModal.item?.name}</strong> has been created.
              </p>
              <p className="text-cyan-400/90 text-xs font-bold font-mono mb-3">
                Ticket #{successModal.ticketId}
              </p>
              <p className="text-slate-300 text-xs mb-6 bg-[#080d13] p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                All order updates will take place inside your ticket. Click <strong className="text-cyan-400 font-semibold">“View My Tickets”</strong> to continue.
              </p>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => setSuccessModal(null)}
                  className="px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => { setSuccessModal(null); navigate('/my-tickets'); }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  View My Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;