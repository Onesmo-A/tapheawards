<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::latest()->paginate(15)->through(fn ($post) => [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'type' => $post->type,
            'status' => $post->status,
            'published_at' => $post->published_at,
        ]);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Posts/Form');
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
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        // Ongeza URL kamili ya picha ili ionekane kwenye fomu
        $post->featured_image_url = $post->featured_image ? Storage::url($post->featured_image) : null;

        return Inertia::render('Admin/Posts/Form', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $this->validatePost($request, $post->id);

        $post->fill($validated);
        $post->slug = Str::slug($validated['title']);

        if ($request->hasFile('featured_image')) {
            // Futa picha ya zamani kama ipo
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $post->featured_image = $request->file('featured_image')->store('post_images', 'public');
        }

        $post->save();

        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // Futa picha iliyohifadhiwa
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Post deleted successfully.');
    }

    /**
     * Reusable validation method.
     */
    private function validatePost(Request $request, $postId = null): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'type' => 'required|in:update,gallery,event',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|image|max:2048', // 2MB Max
        ];

        return $request->validate($rules);
    }
}

