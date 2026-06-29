<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function gallery()
    {
        $images = [
            [
                'url' => '/images/gallery/event-2023-1.jpg',
                'caption' => 'Awards Ceremony 2023',
                'date' => 'December 31, 2023'
            ],
            [
                'url' => '/images/gallery/winners-2023.jpg',
                'caption' => 'Award Winners',
                'date' => 'December 31, 2023'
            ],
            // Add more images here
        ];

        return Inertia::render('Media/Gallery', [
            'images' => $images
        ]);
    }

    public function news()
    {
        $news = [
            [
                'id' => 1,
                'title' => 'Tanzania Business Awards 2025 Announced',
                'slug' => 'tanzania-business-awards-2025-announced',
                'excerpt' => 'The most prestigious business awards ceremony returns with new categories and opportunities.',
                'content' => 'Full article content here...',
                'image' => '/images/news/awards-2025.jpg',
                'date' => '2025-07-15',
                'category' => 'Announcements'
            ],
            [
                'id' => 2,
                'title' => 'Previous Winners Share Their Success Stories',
                'slug' => 'previous-winners-success-stories',
                'excerpt' => 'Learn how winning the award transformed these businesses.',
                'content' => 'Full article content here...',
                'image' => '/images/news/success-stories.jpg',
                'date' => '2025-07-10',
                'category' => 'Stories'
            ],
            // Add more news articles
        ];

        return Inertia::render('Media/News', [
            'news' => $news
        ]);
    }

  public function pressReleases()
{
    $releases = [
        [
            'id' => 1,
            'title' => 'Tanzania Business Awards 2025 Announces New Categories',
            'slug' => 'tanzania-business-awards-2025-new-categories',
            'excerpt' => 'The organizing committee introduces five new award categories for 2025...',
            'date' => '2025-07-15',
            'category' => 'Announcements',
            'pdf' => '/documents/press/2025-new-categories.pdf'
        ],
        [
            'id' => 2,
            'title' => 'Record Number of Applications Received for 2025 Awards',
            'slug' => 'record-applications-2025',
            'excerpt' => 'Over 500 businesses have submitted their applications for the 2025 awards...',
            'date' => '2025-07-01',
            'category' => 'Updates',
            'pdf' => '/documents/press/2025-applications-update.pdf'
        ],
        // Add more press releases here
    ];

    return Inertia::render('Media/PressReleases', [
        'releases' => $releases
    ]);
}

    public function photos()
    {
        $albums = [
            [
                'id' => 1,
                'title' => 'Awards Ceremony 2024',
                'photoCount' => 24,
                'coverPhoto' => [
                    'url' => '/images/gallery/2024/cover.jpg',
                    'caption' => 'Awards Night Highlights'
                ],
                'preview' => [
                    [
                        'id' => 1,
                        'thumbnail' => '/images/gallery/2024/thumb-1.jpg',
                        'url' => '/images/gallery/2024/photo-1.jpg',
                        'caption' => 'Opening Ceremony'
                    ],
                    // Add more preview photos
                ]
            ],
            // Add more albums
        ];

        return Inertia::render('Media/Photos', [
            'albums' => $albums
        ]);
    }

    public function videos()
    {
        $videos = [
            [
                'id' => 1,
                'title' => 'Tanzania Business Awards 2024 Highlights',
                'description' => 'Watch the best moments from our prestigious awards ceremony celebrating business excellence.',
                'thumbnail' => '/images/videos/2024-highlights-thumb.jpg',
                'videoUrl' => 'https://youtube.com/embed/xxxxx',
                'duration' => '5:42',
                'views' => '1.2K',
                'date' => '2024-12-31',
                'category' => 'Highlights'
            ],
            [
                'id' => 2,
                'title' => 'Interview with 2024 Winner',
                'description' => 'Exclusive interview with the Business of the Year winner sharing their success story.',
                'thumbnail' => '/images/videos/winner-interview-thumb.jpg',
                'videoUrl' => 'https://youtube.com/embed/yyyyy',
                'duration' => '8:15',
                'views' => '856',
                'date' => '2024-12-15',
                'category' => 'Interviews'
            ],
            // Add more videos...
        ];

        return Inertia::render('Media/Videos', [
            'videos' => $videos
        ]);
    }
}
