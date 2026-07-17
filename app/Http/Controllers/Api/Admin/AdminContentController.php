<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroBanner;
use App\Models\Sponsor;
use App\Models\GalleryAlbum;
use App\Models\Post;
use App\Models\Reel;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminContentController extends Controller
{
    // ==========================================
    // HERO BANNERS CRUD
    // ==========================================
    public function getBanners(): JsonResponse
    {
        $banners = HeroBanner::orderBy('sort_order')->get();
        return response()->json([
            'status' => 'success',
            'banners' => $banners
        ]);
    }

    public function storeBanner(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'eyebrow' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'primary_button_text' => 'nullable|string|max:100',
            'primary_button_url' => 'nullable|string|max:255',
            'secondary_button_text' => 'nullable|string|max:100',
            'secondary_button_url' => 'nullable|string|max:255',
            'sort_order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        $banner = HeroBanner::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_HERO_BANNER',
            modelType: HeroBanner::class,
            modelId: $banner->id,
            beforeState: null,
            afterState: $banner->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Banner imeundwa.',
            'banner' => $banner
        ]);
    }

    public function deleteBanner(Request $request, HeroBanner $banner): JsonResponse
    {
        $before = $banner->toArray();
        $banner->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_HERO_BANNER',
            modelType: HeroBanner::class,
            modelId: $banner->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Banner imefutwa kikamilifu.'
        ]);
    }

    // ==========================================
    // SPONSORS CRUD
    // ==========================================
    public function getSponsors(): JsonResponse
    {
        $sponsors = Sponsor::orderBy('sort_order')->get();
        return response()->json([
            'status' => 'success',
            'sponsors' => $sponsors
        ]);
    }

    public function storeSponsor(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tier' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'is_active' => 'required|boolean',
            'sort_order' => 'required|integer',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = \App\Services\ImageOptimizer::optimizeAndStore($request->file('logo'), 'sponsors');
        }

        $sponsor = Sponsor::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_SPONSOR',
            modelType: Sponsor::class,
            modelId: $sponsor->id,
            beforeState: null,
            afterState: $sponsor->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mdhamini amesajiliwa kikamilifu.',
            'sponsor' => $sponsor
        ]);
    }

    public function updateSponsor(Request $request, Sponsor $sponsor): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tier' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website_url' => 'nullable|url',
            'is_active' => 'required|boolean',
            'sort_order' => 'required|integer',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($sponsor->logo_path && Storage::disk('public')->exists($sponsor->logo_path)) {
                Storage::disk('public')->delete($sponsor->logo_path);
            }
            $validated['logo_path'] = \App\Services\ImageOptimizer::optimizeAndStore($request->file('logo'), 'sponsors');
        }

        $before = $sponsor->toArray();
        $sponsor->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_SPONSOR',
            modelType: Sponsor::class,
            modelId: $sponsor->id,
            beforeState: $before,
            afterState: $sponsor->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Taarifa za mdhamini zimesasishwa.',
            'sponsor' => $sponsor
        ]);
    }

    public function toggleSponsorStatus(Request $request, Sponsor $sponsor): JsonResponse
    {
        $before = $sponsor->toArray();
        $sponsor->update([
            'is_active' => !$sponsor->is_active
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'TOGGLE_SPONSOR_STATUS',
            modelType: Sponsor::class,
            modelId: $sponsor->id,
            beforeState: $before,
            afterState: $sponsor->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => $sponsor->is_active ? 'Mdhamini amekuwa active.' : 'Mdhamini amesimamishwa.',
            'sponsor' => $sponsor
        ]);
    }

    public function deleteSponsor(Request $request, Sponsor $sponsor): JsonResponse
    {
        $before = $sponsor->toArray();
        
        if ($sponsor->logo_path && Storage::disk('public')->exists($sponsor->logo_path)) {
            Storage::disk('public')->delete($sponsor->logo_path);
        }

        $sponsor->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_SPONSOR',
            modelType: Sponsor::class,
            modelId: $sponsor->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mdhamini amefutwa.'
        ]);
    }

    // ==========================================
    // GALLERY ALBUMS CRUD
    // ==========================================
    public function getAlbums(): JsonResponse
    {
        $albums = GalleryAlbum::latest()->get();
        return response()->json([
            'status' => 'success',
            'albums' => $albums
        ]);
    }

    public function storeAlbum(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'required|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(100, 999);

        $album = GalleryAlbum::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_GALLERY_ALBUM',
            modelType: GalleryAlbum::class,
            modelId: $album->id,
            beforeState: null,
            afterState: $album->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Album ya picha imeundwa.',
            'album' => $album
        ]);
    }

    public function deleteAlbum(Request $request, GalleryAlbum $album): JsonResponse
    {
        $before = $album->toArray();
        $album->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_GALLERY_ALBUM',
            modelType: GalleryAlbum::class,
            modelId: $album->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Album imefutwa kikamilifu.'
        ]);
    }

    // ==========================================
    // POSTS CRUD
    // ==========================================
    public function getPosts(): JsonResponse
    {
        $posts = Post::with('album')->latest()->get();
        return response()->json([
            'status' => 'success',
            'posts' => $posts
        ]);
    }

    public function storePost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'type' => 'required|string|in:post,news,photo',
            'gallery_album_id' => 'nullable|uuid|exists:gallery_albums,id',
            'status' => 'required|string|in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(100, 999);
        $validated['published_at'] = $validated['status'] === 'published' ? now() : null;

        $post = Post::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_POST',
            modelType: Post::class,
            modelId: $post->id,
            beforeState: null,
            afterState: $post->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Habari/Makala imeundwa kikamilifu.',
            'post' => $post
        ]);
    }

    public function deletePost(Request $request, Post $post): JsonResponse
    {
        $before = $post->toArray();
        $post->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_POST',
            modelType: Post::class,
            modelId: $post->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Makala imefutwa.'
        ]);
    }

    // ==========================================
    // REELS CRUD
    // ==========================================
    public function getReels(): JsonResponse
    {
        $reels = Reel::latest()->get();
        return response()->json([
            'status' => 'success',
            'reels' => $reels
        ]);
    }

    public function storeReel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:youtube,tiktok,instagram',
            'content' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $reel = Reel::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_REEL',
            modelType: Reel::class,
            modelId: $reel->id,
            beforeState: null,
            afterState: $reel->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Video ya Reels imeongezwa.',
            'reel' => $reel
        ]);
    }

    public function deleteReel(Request $request, Reel $reel): JsonResponse
    {
        $before = $reel->toArray();
        $reel->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_REEL',
            modelType: Reel::class,
            modelId: $reel->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Video imefutwa.'
        ]);
    }
}
