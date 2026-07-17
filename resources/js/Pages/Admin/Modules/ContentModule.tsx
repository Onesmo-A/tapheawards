import React, { useState } from 'react';
import adminApi from '../Utils/adminApi';
import { Loader2, Plus, Trash2, Users, Edit2, ToggleLeft, ToggleRight, ExternalLink, Image } from 'lucide-react';

interface ContentModuleProps {
  activeTab: 'banners' | 'sponsors' | 'albums' | 'posts' | 'reels';
  sponsors: any[];
  loadingSponsors: boolean;
  fetchSponsors: () => void;
  banners: any[];
  loadingBanners: boolean;
  fetchBanners: () => void;
  albums: any[];
  loadingAlbums: boolean;
  fetchAlbums: () => void;
  posts: any[];
  loadingPosts: boolean;
  fetchPosts: () => void;
  reels: any[];
  loadingReels: boolean;
  fetchReels: () => void;
  setErrorMsg: (msg: string) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function ContentModule({
  activeTab,
  sponsors,
  loadingSponsors,
  fetchSponsors,
  banners,
  loadingBanners,
  fetchBanners,
  albums,
  loadingAlbums,
  fetchAlbums,
  posts,
  loadingPosts,
  fetchPosts,
  reels,
  loadingReels,
  fetchReels,
  setErrorMsg,
  setSuccessMsg
}: ContentModuleProps) {
  // Modal & Form states
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [sponsorForm, setSponsorForm] = useState({ name: '', tier: 'Supporter', description: '', website_url: '', is_active: true, sort_order: '0' });
  const [sponsorLogoFile, setSponsorLogoFile] = useState<File | null>(null);
  const [sponsorLogoPreview, setSponsorLogoPreview] = useState<string | null>(null);

  // Banner states
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', eyebrow: '', badge: '', description: '', primary_button_text: '', primary_button_url: '', secondary_button_text: '', secondary_button_url: '', sort_order: '0', is_active: true });

  // Album states
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumForm, setAlbumForm] = useState({ name: '', description: '', is_published: true });

  // Post states
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', content: '', type: 'post', gallery_album_id: '', status: 'published' });

  const [showReelModal, setShowReelModal] = useState(false);
  const [reelForm, setReelForm] = useState({ type: 'youtube', content: '', is_active: true });

  // CRUD Handlers — Sponsors
  const openAddSponsor = () => {
    setEditingSponsorId(null);
    setSponsorForm({ name: '', tier: 'Supporter', description: '', website_url: '', is_active: true, sort_order: '0' });
    setSponsorLogoFile(null);
    setSponsorLogoPreview(null);
    setShowSponsorModal(true);
  };

  const openEditSponsor = (s: any) => {
    setEditingSponsorId(s.id);
    setSponsorForm({ name: s.name, tier: s.tier || 'Supporter', description: s.description || '', website_url: s.website_url || '', is_active: s.is_active, sort_order: String(s.sort_order) });
    setSponsorLogoFile(null);
    setSponsorLogoPreview(s.logo_url || null);
    setShowSponsorModal(true);
  };

  const handleSponsorLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSponsorLogoFile(file);
      setSponsorLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', sponsorForm.name);
      fd.append('tier', sponsorForm.tier);
      fd.append('description', sponsorForm.description);
      fd.append('website_url', sponsorForm.website_url);
      fd.append('is_active', sponsorForm.is_active ? '1' : '0');
      fd.append('sort_order', sponsorForm.sort_order);
      if (sponsorLogoFile) fd.append('logo', sponsorLogoFile);

      if (editingSponsorId) {
        fd.append('_method', 'PUT');
        await adminApi.post(`/api/v1/admin/content/sponsors/${editingSponsorId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccessMsg('Taarifa za mdhamini zimesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/content/sponsors', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccessMsg('Mdhamini mpya ameongezwa.');
      }
      setShowSponsorModal(false);
      setSponsorLogoFile(null);
      fetchSponsors();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi taarifa.');
    }
  };

  const handleToggleSponsorStatus = async (id: string) => {
    try {
      await adminApi.post(`/api/v1/admin/content/sponsors/${id}/toggle-status`);
      fetchSponsors();
    } catch { setErrorMsg('Imeshindwa kubadilisha hali ya mdhamini.'); }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta mdhamini huyu?')) return;
    try {
      await adminApi.delete(`/api/v1/admin/content/sponsors/${id}`);
      setSuccessMsg('Mdhamini amefutwa.');
      fetchSponsors();
    } catch { setErrorMsg('Imeshindwa kufuta mdhamini.'); }
  };


  // ── Banner Handlers ──
  const openAddBanner = () => {
    setEditingBannerId(null);
    setBannerForm({ title: '', eyebrow: '', badge: '', description: '', primary_button_text: '', primary_button_url: '', secondary_button_text: '', secondary_button_url: '', sort_order: '0', is_active: true });
    setShowBannerModal(true);
  };
  const openEditBanner = (b: any) => {
    setEditingBannerId(b.id);
    setBannerForm({ title: b.title || '', eyebrow: b.eyebrow || '', badge: b.badge || '', description: b.description || '', primary_button_text: b.primary_button_text || '', primary_button_url: b.primary_button_url || '', secondary_button_text: b.secondary_button_text || '', secondary_button_url: b.secondary_button_url || '', sort_order: String(b.sort_order), is_active: b.is_active });
    setShowBannerModal(true);
  };
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBannerId) {
        await adminApi.put(`/api/v1/admin/content/banners/${editingBannerId}`, bannerForm);
        setSuccessMsg('Banner imesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/content/banners', bannerForm);
        setSuccessMsg('Banner mpya imeundwa.');
      }
      setShowBannerModal(false);
      fetchBanners();
    } catch (err: any) { setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi banner.'); }
  };
  const handleToggleBanner = async (id: string) => {
    try { await adminApi.post(`/api/v1/admin/content/banners/${id}/toggle-status`); fetchBanners(); }
    catch { setErrorMsg('Imeshindwa kubadilisha hali ya banner.'); }
  };
  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta banner hii?')) return;
    try { await adminApi.delete(`/api/v1/admin/content/banners/${id}`); setSuccessMsg('Banner imefutwa.'); fetchBanners(); }
    catch { setErrorMsg('Imeshindwa kufuta banner.'); }
  };

  // ── Album Handlers ──
  const openAddAlbum = () => {
    setEditingAlbumId(null);
    setAlbumForm({ name: '', description: '', is_published: true });
    setShowAlbumModal(true);
  };
  const openEditAlbum = (a: any) => {
    setEditingAlbumId(a.id);
    setAlbumForm({ name: a.name || '', description: a.description || '', is_published: a.is_published });
    setShowAlbumModal(true);
  };
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlbumId) {
        await adminApi.put(`/api/v1/admin/content/albums/${editingAlbumId}`, albumForm);
        setSuccessMsg('Album imesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/content/albums', albumForm);
        setSuccessMsg('Album mpya imeundwa.');
      }
      setShowAlbumModal(false); fetchAlbums();
    } catch (err: any) { setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi album.'); }
  };
  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta album hii?')) return;
    try { await adminApi.delete(`/api/v1/admin/content/albums/${id}`); setSuccessMsg('Album imefutwa.'); fetchAlbums(); }
    catch { setErrorMsg('Imeshindwa kufuta album.'); }
  };

  // ── Post Handlers ──
  const openAddPost = () => {
    setEditingPostId(null);
    setPostForm({ title: '', excerpt: '', content: '', type: 'post', gallery_album_id: '', status: 'published' });
    setShowPostModal(true);
  };
  const openEditPost = (p: any) => {
    setEditingPostId(p.id);
    setPostForm({ title: p.title || '', excerpt: p.excerpt || '', content: p.content || '', type: p.type || 'post', gallery_album_id: p.gallery_album_id || '', status: p.status || 'published' });
    setShowPostModal(true);
  };
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPostId) {
        await adminApi.put(`/api/v1/admin/content/posts/${editingPostId}`, postForm);
        setSuccessMsg('Makala imesasishwa.');
      } else {
        await adminApi.post('/api/v1/admin/content/posts', postForm);
        setSuccessMsg('Makala mpya imeundwa.');
      }
      setShowPostModal(false); fetchPosts();
    } catch (err: any) { setErrorMsg(err.response?.data?.message || 'Imeshindwa kuhifadhi makala.'); }
  };
  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Je, una uhakika unataka kufuta makala hii?')) return;
    try { await adminApi.delete(`/api/v1/admin/content/posts/${id}`); setSuccessMsg('Makala imefutwa.'); fetchPosts(); }
    catch { setErrorMsg('Imeshindwa kufuta makala.'); }
  };

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.post('/api/v1/admin/content/reels', reelForm);
      setSuccessMsg('Video imeongezwa.');
      setShowReelModal(false);
      fetchReels();
    } catch { setErrorMsg('Failed to save reel video.'); }
  };

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm('Futa video hii?')) return;
    try {
      await adminApi.delete(`/api/v1/admin/content/reels/${id}`);
      setSuccessMsg('Video imefutwa.');
      fetchReels();
    } catch { setErrorMsg('Failed to delete reel.'); }
  };

  return (
    <div className="space-y-6">
      
      {/* TAB: SPONSORS */}
      {activeTab === 'sponsors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Event Sponsors</h3>
              <p className="text-[10px] text-white/35 mt-0.5">{sponsors.length} mdhamini{sponsors.length !== 1 ? ' waliopo' : ' aliyepo'}</p>
            </div>
            <button onClick={openAddSponsor} className="px-4 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white hover:bg-[#B8031F] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Sponsor
            </button>
          </div>

          {loadingSponsors ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : sponsors.length === 0 ? (
            <div className="py-20 text-center text-white/25 text-[11px] font-bold uppercase tracking-widest">Hakuna wadhamini bado</div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Logo / Jina</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Order</th>
                    <th className="p-4">Hali</th>
                    <th className="p-4 pr-6 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {sponsors.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Logo + Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {s.logo_url ? (
                            <img src={s.logo_url} alt={s.name} className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-white/10 p-1" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <Image className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-xs">{s.name}</p>
                            {s.website_url && (
                              <a href={s.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] text-white/35 hover:text-[#D90429] transition-colors mt-0.5">
                                <ExternalLink className="w-2.5 h-2.5" /> website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Tier */}
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/60">
                          {s.tier || '—'}
                        </span>
                      </td>
                      {/* Sort order */}
                      <td className="p-4 text-white/40 font-mono text-[11px]">{s.sort_order}</td>
                      {/* Status badge */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                          s.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {s.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2 justify-end">
                          {/* Toggle active / suspend */}
                          <button
                            onClick={() => handleToggleSponsorStatus(s.id)}
                            title={s.is_active ? 'Suspend' : 'Activate'}
                            className={`p-1.5 border rounded-lg cursor-pointer transition-all ${
                              s.is_active
                                ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {s.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => openEditSponsor(s)}
                            title="Hariri"
                            className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteSponsor(s.id)}
                            title="Futa"
                            className="p-1.5 border border-[#D90429]/20 hover:bg-[#D90429]/10 rounded-lg text-[#D90429] cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: HERO BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Hero Banners</h3>
              <p className="text-[10px] text-white/35 mt-0.5">{banners.length} slide{banners.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={openAddBanner} className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          {loadingBanners ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : banners.length === 0 ? (
            <div className="py-20 text-center text-white/25 text-[11px] font-bold uppercase tracking-widest">Hakuna slides bado</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(b => (
                <div key={b.id} className={`p-5 rounded-3xl border flex flex-col gap-3 transition-all ${ b.is_active ? 'bg-[#0b0b0b] border-white/8' : 'bg-black/40 border-white/[0.03] opacity-60' }`}>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-[#D90429] uppercase tracking-widest">{b.eyebrow || 'TAPHE Awards'}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                          b.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'
                        }`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <h4 className="text-xs font-black text-white uppercase truncate">{b.title}</h4>
                      {b.description && <p className="text-[10px] text-white/40 leading-relaxed mt-1 line-clamp-2">{b.description}</p>}
                    </div>
                    <span className="text-[9px] text-white/25 font-mono shrink-0">#{b.sort_order}</span>
                  </div>
                  {/* Button labels */}
                  {(b.primary_button_text || b.secondary_button_text) && (
                    <div className="flex gap-2 flex-wrap">
                      {b.primary_button_text && <span className="px-2.5 py-1 rounded-lg bg-[#D90429]/10 border border-[#D90429]/20 text-[9px] text-[#D90429] font-bold">{b.primary_button_text}</span>}
                      {b.secondary_button_text && <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] text-white/50 font-bold">{b.secondary_button_text}</span>}
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                    <button onClick={() => handleToggleBanner(b.id)} title={b.is_active ? 'Deactivate' : 'Activate'}
                      className={`p-1.5 border rounded-lg cursor-pointer transition-all ${ b.is_active ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' }`}>
                      {b.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => openEditBanner(b)} title="Hariri"
                      className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-grow" />
                    <button onClick={() => handleDeleteBanner(b.id)} title="Futa"
                      className="p-1.5 border border-[#D90429]/20 hover:bg-[#D90429]/10 rounded-lg text-[#D90429] cursor-pointer transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: GALLERY ALBUMS */}
      {activeTab === 'albums' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Gallery Albums</h3>
              <p className="text-[10px] text-white/35 mt-0.5">{albums.length} album{albums.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={openAddAlbum} className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Album
            </button>
          </div>

          {loadingAlbums ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : albums.length === 0 ? (
            <div className="py-20 text-center text-white/25 text-[11px] font-bold uppercase tracking-widest">Hakuna albums bado</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map(a => (
                <div key={a.id} className={`p-5 rounded-3xl border flex flex-col gap-3 transition-all ${ a.is_published ? 'bg-[#0b0b0b] border-white/8' : 'bg-black/40 border-white/[0.03]' }`}>
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black uppercase text-white truncate">{a.name}</h4>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-bold border ${ a.is_published ? 'bg-green-500/10 text-green-400 border-green-500/15' : 'bg-white/5 text-white/30 border-white/5' }`}>
                        {a.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {a.description && <p className="text-[10px] text-white/40 leading-normal line-clamp-2">{a.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button onClick={() => openEditAlbum(a)} title="Hariri"
                      className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-grow" />
                    <button onClick={() => handleDeleteAlbum(a.id)} title="Futa"
                      className="p-1.5 border border-[#D90429]/20 hover:bg-[#D90429]/10 rounded-lg text-[#D90429] cursor-pointer transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: POSTS / ARTICLES */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">News Articles</h3>
              <p className="text-[10px] text-white/35 mt-0.5">{posts.length} makala</p>
            </div>
            <button onClick={openAddPost} className="px-4 py-2.5 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Post
            </button>
          </div>

          {loadingPosts ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-white/25 text-[11px] font-bold uppercase tracking-widest">Hakuna makala bado</div>
          ) : (
            <div className="bg-[#0b0b0b] border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-white/40">
                    <th className="p-4 pl-6">Kichwa</th>
                    <th className="p-4">Aina</th>
                    <th className="p-4">Muhtasari</th>
                    <th className="p-4">Hali</th>
                    <th className="p-4 pr-6 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {posts.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-white text-xs line-clamp-1">{p.title}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/50">{p.type}</span>
                      </td>
                      <td className="p-4 text-[10px] text-white/40 max-w-[200px]">
                        <p className="line-clamp-2">{p.excerpt || '—'}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border ${ p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/5' }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEditPost(p)} title="Hariri"
                            className="p-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeletePost(p.id)} title="Futa"
                            className="p-1.5 border border-[#D90429]/20 hover:bg-[#D90429]/10 rounded-lg text-[#D90429] cursor-pointer transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: REELS */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase text-white/40 tracking-wider">Reels stream</h3>
            <button onClick={() => { setReelForm({ type: 'youtube', content: '', is_active: true }); setShowReelModal(true); }} className="px-4 py-2.5 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer text-white"><Plus className="w-3.5 h-3.5" /> Add Reel</button>
          </div>

          {loadingReels ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D90429]" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reels.map(r => (
                <div key={r.id} className="p-4 rounded-3xl bg-[#0b0b0b] border border-white/5 space-y-4">
                  <div className="aspect-video bg-black/40 rounded-2xl flex items-center justify-center border border-white/5">
                    <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{r.type} Source</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/40 truncate max-w-[150px]">{r.content}</span>
                    <button onClick={() => handleDeleteReel(r.id)} className="p-1.5 border border-white/10 hover:bg-[#D90429]/20 rounded-lg text-[#D90429] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPONSOR MODAL */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto scrollbar-none">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">
                {editingSponsorId ? 'Hariri Mdhamini' : 'Ongeza Mdhamini Mpya'}
              </h4>
              <p className="text-[9px] text-white/35 mt-1">{editingSponsorId ? 'Sasisha taarifa za mdhamini.' : 'Jaza taarifa za mdhamini mpya.'}</p>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4">
              {/* Logo Preview + Upload */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Logo ya Mdhamini</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {sponsorLogoPreview ? (
                      <img src={sponsorLogoPreview} alt="preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Image className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                  <label className="flex-grow cursor-pointer">
                    <div className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:text-white transition-colors text-center">
                      {sponsorLogoFile ? sponsorLogoFile.name : 'Chagua picha (PNG, JPG, SVG)'}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleSponsorLogoChange} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Jina la Mdhamini *</label>
                <input type="text" required value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Mfano: TAPHE Media" />
              </div>

              {/* Tier */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Kiwango (Tier) *</label>
                <input type="text" required value={sponsorForm.tier} onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Platinum, Gold, Supporter, n.k." />
              </div>

              {/* Website URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Tovuti (URL)</label>
                <input type="text" value={sponsorForm.website_url} onChange={(e) => setSponsorForm({ ...sponsorForm, website_url: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="https://example.com" />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Maelezo (optional)</label>
                <textarea value={sponsorForm.description} onChange={(e) => setSponsorForm({ ...sponsorForm, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] h-16 resize-none text-white transition-colors" placeholder="Maelezo mafupi kuhusu mdhamini" />
              </div>

              {/* Sort order + Active toggle row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Mpangilio</label>
                  <input type="number" value={sponsorForm.sort_order} onChange={(e) => setSponsorForm({ ...sponsorForm, sort_order: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Hali</label>
                  <button
                    type="button"
                    onClick={() => setSponsorForm({ ...sponsorForm, is_active: !sponsorForm.is_active })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      sponsorForm.is_active
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                    }`}
                  >
                    {sponsorForm.is_active ? '● Active' : '● Suspended'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white transition-colors">
                  {editingSponsorId ? 'Sasisha' : 'Hifadhi'}
                </button>
                <button type="button" onClick={() => setShowSponsorModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white transition-colors">Ghairi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERO BANNER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-5 text-left max-h-[90vh] overflow-y-auto scrollbar-none">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">{editingBannerId ? 'Hariri Slide' : 'Ongeza Hero Slide'}</h4>
              <p className="text-[9px] text-white/35 mt-1">{editingBannerId ? 'Sasisha maudhui ya slide.' : 'Jaza maelezo ya slide mpya.'}</p>
            </div>
            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Kichwa (Title) *</label>
                  <input type="text" required value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="TAPHE Awards 2026" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Eyebrow</label>
                  <input type="text" value={bannerForm.eyebrow} onChange={(e) => setBannerForm({ ...bannerForm, eyebrow: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Season 2026" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Badge</label>
                  <input type="text" value={bannerForm.badge} onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="LIVE NOW" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Maelezo</label>
                <textarea value={bannerForm.description} onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] h-16 resize-none text-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Btn 1 Text</label><input type="text" value={bannerForm.primary_button_text} onChange={(e) => setBannerForm({ ...bannerForm, primary_button_text: e.target.value })} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs outline-none text-white" /></div>
                <div className="space-y-1"><label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Btn 1 URL</label><input type="text" value={bannerForm.primary_button_url} onChange={(e) => setBannerForm({ ...bannerForm, primary_button_url: e.target.value })} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs outline-none text-white" /></div>
                <div className="space-y-1"><label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Btn 2 Text</label><input type="text" value={bannerForm.secondary_button_text} onChange={(e) => setBannerForm({ ...bannerForm, secondary_button_text: e.target.value })} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs outline-none text-white" /></div>
                <div className="space-y-1"><label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Btn 2 URL</label><input type="text" value={bannerForm.secondary_button_url} onChange={(e) => setBannerForm({ ...bannerForm, secondary_button_url: e.target.value })} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs outline-none text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Mpangilio</label><input type="number" value={bannerForm.sort_order} onChange={(e) => setBannerForm({ ...bannerForm, sort_order: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white" /></div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Hali</label>
                  <button type="button" onClick={() => setBannerForm({ ...bannerForm, is_active: !bannerForm.is_active })}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${ bannerForm.is_active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40' }`}>
                    {bannerForm.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white transition-colors">{editingBannerId ? 'Sasisha' : 'Hifadhi'}</button>
                <button type="button" onClick={() => setShowBannerModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white">Ghairi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALBUM MODAL */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-5 text-left">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">{editingAlbumId ? 'Hariri Album' : 'Album Mpya'}</h4>
              <p className="text-[9px] text-white/35 mt-1">{editingAlbumId ? 'Sasisha maelezo ya album.' : 'Unda folder ya picha mpya.'}</p>
            </div>
            <form onSubmit={handleSaveAlbum} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Jina la Album *</label>
                <input type="text" required value={albumForm.name} onChange={(e) => setAlbumForm({ ...albumForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Mfano: TAPHE Awards Ceremony" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Maelezo</label>
                <textarea value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] h-20 resize-none text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Hali ya Uchapishaji</label>
                <button type="button" onClick={() => setAlbumForm({ ...albumForm, is_published: !albumForm.is_published })}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${ albumForm.is_published ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40' }`}>
                  {albumForm.is_published ? '● Published' : '○ Draft'}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white transition-colors">{editingAlbumId ? 'Sasisha' : 'Hifadhi'}</button>
                <button type="button" onClick={() => setShowAlbumModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white">Ghairi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEWS POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-5 text-left max-h-[90vh] overflow-y-auto scrollbar-none">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">{editingPostId ? 'Hariri Makala' : 'Makala Mpya'}</h4>
              <p className="text-[9px] text-white/35 mt-1">{editingPostId ? 'Sasisha makala.' : 'Andika habari au makala mpya.'}</p>
            </div>
            <form onSubmit={handleSavePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Kichwa *</label>
                <input type="text" required value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Kichwa cha habari..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Muhtasari</label>
                <input type="text" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white transition-colors" placeholder="Muhtasari mfupi..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Maudhui</label>
                <textarea value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] h-28 resize-none text-white transition-colors" placeholder="Andika hapa..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Aina</label>
                  <select value={postForm.type} onChange={(e) => setPostForm({ ...postForm, type: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
                    <option value="post">Post</option>
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/45 uppercase tracking-wider">Hali</label>
                  <select value={postForm.status} onChange={(e) => setPostForm({ ...postForm, status: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none text-white">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] hover:bg-[#B8031F] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white transition-colors">{editingPostId ? 'Sasisha' : 'Chapisha'}</button>
                <button type="button" onClick={() => setShowPostModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white">Ghairi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REEL DIALOG MODAL */}
      {showReelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#D90429]">Reel Video Details</h4>
            <form onSubmit={handleSaveReel} className="space-y-4">
              <div className="space-y-1"><label className="text-[9px] font-bold text-white/45">YouTube / Video Embed Code or Link</label><input type="text" required value={reelForm.content} onChange={(e) => setReelForm({ ...reelForm, content: e.target.value })} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs outline-none focus:border-[#D90429] text-white" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-grow py-3 bg-[#D90429] text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-pointer text-white">Save</button>
                <button type="button" onClick={() => setShowReelModal(false)} className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
