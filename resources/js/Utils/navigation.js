export const navigationLinks = [
  { 
    name: 'Home', 
    href: '/' 
  },
  {
    name: 'Awards',
    href: '/awards',
    dropdown: [
      { name: 'Categories', href: '/awards/categories' },
      { name: 'Winners', href: '/awards/winners' },
      { name: 'Vote Now', href: '/awards/vote' },
      { name: 'Previous Years', href: '/awards/archives' }
    ]
  },
  {
    name: 'Event',
    href: '/event',
    dropdown: [
      { name: 'Overview', href: '/event' },
      { name: 'Guest of Honor', href: '/event/guest-of-honor' },
      { name: 'Schedule', href: '/event/schedule' },
      { name: 'Venue', href: '/event/venue' },
      { name: 'Artists', href: '/event/artists' }
    ]
  },
  {
    name: 'Media',
    href: '/media',
    dropdown: [
      { name: 'Gallery', href: '/media/gallery' },
      { name: 'News', href: '/media/news' },
      { name: 'Press Kit', href: '/media/press-kit' }
    ]
  },
  { name: 'Contact', href: '/contact' }
];