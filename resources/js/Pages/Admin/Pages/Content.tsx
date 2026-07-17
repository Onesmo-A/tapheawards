import React, { useEffect, useState } from 'react';
import adminApi from '../Utils/adminApi';
import ContentModule from '../Modules/ContentModule';
import { Image, ShieldAlert, Award, FileText, Play } from 'lucide-react';

export default function Content() {
  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'sponsors' | 'albums' | 'posts' | 'reels'>('banners');
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [reels, setReels] = useState<any[]>([]);
  const [loadingReels, setLoadingReels] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSponsors = async () => {
    setLoadingSponsors(true);
    try {
      const response = await adminApi.get('/api/v1/admin/content/sponsors');
      setSponsors(response.data.sponsors || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia wadhamini.');
    } finally {
      setLoadingSponsors(false);
    }
  };

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const response = await adminApi.get('/api/v1/admin/content/banners');
      setBanners(response.data.banners || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia mabango.');
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const response = await adminApi.get('/api/v1/admin/content/albums');
      setAlbums(response.data.albums || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia albamu.');
    } finally {
      setLoadingAlbums(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await adminApi.get('/api/v1/admin/content/posts');
      setPosts(response.data.posts || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia habari.');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchReels = async () => {
    setLoadingReels(true);
    try {
      const response = await adminApi.get('/api/v1/admin/content/reels');
      setReels(response.data.reels || []);
    } catch {
      setErrorMsg('Imeshindwa kupakia reels.');
    } finally {
      setLoadingReels(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'banners') fetchBanners();
    if (activeSubTab === 'sponsors') fetchSponsors();
    if (activeSubTab === 'albums') fetchAlbums();
    if (activeSubTab === 'posts') fetchPosts();
    if (activeSubTab === 'reels') fetchReels();
  }, [activeSubTab]);

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('banners')}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeSubTab === 'banners' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Hero Banners
        </button>
        <button
          onClick={() => setActiveSubTab('sponsors')}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeSubTab === 'sponsors' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Sponsors
        </button>
        <button
          onClick={() => setActiveSubTab('albums')}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeSubTab === 'albums' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Albums
        </button>
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeSubTab === 'posts' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> News Posts
        </button>
        <button
          onClick={() => setActiveSubTab('reels')}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeSubTab === 'reels' ? 'border-[#D90429] text-[#D90429]' : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Reels Stream
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#D90429]/10 border border-[#D90429]/20 text-[#D90429] text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-bold uppercase rounded-2xl text-center mb-6 tracking-wider">
          {successMsg}
        </div>
      )}

      <ContentModule
        activeTab={activeSubTab}
        sponsors={sponsors}
        loadingSponsors={loadingSponsors}
        fetchSponsors={fetchSponsors}
        banners={banners}
        loadingBanners={loadingBanners}
        fetchBanners={fetchBanners}
        albums={albums}
        loadingAlbums={loadingAlbums}
        fetchAlbums={fetchAlbums}
        posts={posts}
        loadingPosts={loadingPosts}
        fetchPosts={fetchPosts}
        reels={reels}
        loadingReels={loadingReels}
        fetchReels={fetchReels}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
      />
    </div>
  );
}
