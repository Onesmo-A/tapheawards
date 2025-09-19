<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\GalleryAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::query() // Anzisha query
            ->with('album:id,name') // Tumia jina sahihi la uhusiano 'album'
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($post) => [ // Badilisha data inayotumwa kwa kila post
                'id' => $post->id,
                'title' => $post->title,
                'status' => $post->status,
                'type' => $post->type,
                'album' => $post->album,
                'featured_image_url' => $post->featured_image ? Storage::url($post->featured_image) : null,
            ]);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts, // Tuma data iliyobadilishwa
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => null,
            'albums' => GalleryAlbum::where('is_published', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validatePost($request);

        $post = new Post($validated);
        $post->slug = Str::slug($validated['title']);

        if ($request->hasFile('featured_image')) {
            $post->featured_image = $request->file('featured_image')->store('post_images', 'public');
        }

        $post->save();

        return redirect()->route('admin.posts.index')->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        // Redirect to edit page as we don't have a separate show view in admin
        return redirect()->route('admin.posts.edit', $post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $post->featured_image_url = $post->featured_image ? Storage::url($post->featured_image) : null;

        return Inertia::render('Admin/Posts/Form', [
            'post' => $post,
            'albums' => GalleryAlbum::where('is_published', true)->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $this->validatePost($request, $post->id);

        $updateData = $validated;
        $updateData['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $updateData['featured_image'] = $request->file('featured_image')->store('post_images', 'public');
        }

        $post->update($updateData);

        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Post deleted successfully.');
    }

    /**
     * Validate the post request.
     */
    private function validatePost(Request $request, $postId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255|unique:posts,title,' . $postId,
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'type' => 'required|in:update,gallery,event',
            'status' => 'required|in:draft,published',
            'featured_image' => 'nullable|image|max:2048', // 2MB Max
            'published_at' => 'nullable|date',
            'gallery_album_id' => 'nullable|exists:gallery_albums,id',
        ]);
    }
}