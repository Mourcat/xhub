# Design Guidelines: Social Content Management System

## Design Approach

**Reference-Based Design** drawing inspiration from leading social platforms:
- **Instagram** for Stories and Pictures presentation
- **Medium** for Articles reading experience
- **Pinterest** for content discovery and grid layouts

This approach balances visual richness with content readability while maintaining modern social platform aesthetics.

## Core Design Elements

### Typography System
- **Primary Font:** Inter (Google Fonts) for clean, modern UI elements
- **Article Font:** Merriweather (Google Fonts) for rich article reading experience
- **Hierarchy:**
  - Display: 48px/bold for hero headlines
  - H1: 36px/semibold for page titles
  - H2: 24px/semibold for section headers
  - H3: 20px/medium for card titles
  - Body: 16px/regular for content
  - Caption: 14px/regular for metadata
  - Small: 12px/regular for timestamps

### Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, and 24
- Micro spacing (gaps, padding): 2, 4
- Component internal: 4, 6, 8
- Component margins: 8, 12, 16
- Section spacing: 16, 20, 24

**Grid Systems:**
- Stories: Horizontal scrolling row with 80px circular avatars
- Pictures: Responsive masonry grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- Articles: Single column max-w-3xl for optimal reading
- Feed: Mixed content with max-w-4xl container

### Component Library

#### Navigation
**Top Navigation Bar:**
- Fixed position with subtle backdrop blur
- Logo left-aligned
- Primary actions (Create Story, New Article, Upload Picture) as prominent buttons
- User profile and settings right-aligned
- Search bar with icon, centered on desktop

**Side Navigation (Desktop):**
- Left sidebar with feed filters
- Icon + label navigation items
- Active state with accent indicator
- Categories: All, Stories, Articles, Pictures

#### Content Cards

**Story Card:**
- Circular avatar ring (gradient border for unviewed stories)
- 80px diameter on desktop, 64px on mobile
- Username below avatar (truncated)
- Timestamp in caption size
- Horizontal scrollable container

**Picture Card:**
- Variable height based on image aspect ratio
- Rounded corners (8px)
- Hover overlay with title and author
- Caption and engagement metrics below image
- Subtle shadow for depth

**Article Card:**
- Featured image at top (16:9 aspect ratio)
- Title (H3) with 2-line truncation
- Excerpt text (3-line truncation)
- Author info with avatar (32px circular)
- Read time and publish date
- Clear visual hierarchy with generous padding (p-6)

#### Feed Layout
**Mixed Content Feed:**
- Chronological display with content type indicators
- Stories section: Horizontal scroll at top (sticky on scroll)
- Main feed: Stacked cards with 16px gaps
- Load more with infinite scroll pattern
- Filter chips below Stories (All, Articles, Pictures)

**Content Detail Pages:**

*Story Viewer:*
- Full-screen modal overlay
- Story progress indicators at top
- Tap left/right or swipe for navigation
- Profile info overlay (semi-transparent)
- Close button top-right

*Article Reader:*
- Hero image full-width
- Article content in max-w-3xl container
- Large, readable typography (18px body)
- Generous line-height (1.8)
- Author card with bio and follow button
- Related articles at bottom

*Picture Detail:*
- Large image display (max-height: 80vh)
- Caption and description below
- Engagement section (likes, comments)
- Photographer info sidebar on desktop
- Download and share actions

#### Forms

**Create/Edit Forms:**
- Modal overlay for Stories
- Dedicated full page for Articles with rich text editor
- Upload interface for Pictures with drag-and-drop zone
- Preview panel showing live content
- Form fields with floating labels
- Primary action button (Save/Publish) prominent and fixed on mobile

**Rich Text Editor (Articles):**
- Toolbar with formatting options (bold, italic, headings, lists, links)
- Inline image insertion with caption field
- Character/word count indicator
- Auto-save status indicator

#### Upload Components
**Image Upload:**
- Dashed border drop zone (min-height: 300px)
- Drag-and-drop with file browser fallback
- Image preview with crop/adjust options
- Progress indicator during upload
- Multiple image support for Pictures gallery

### Images

**Hero Section:**
- Full-width hero with gradient overlay (1400x600px)
- Featured content carousel showcasing top Stories/Articles/Pictures
- Subtle parallax effect on scroll
- CTA buttons with backdrop-blur backgrounds

**Content Images:**
- Story backgrounds: 1080x1920px (9:16 vertical)
- Article headers: 1200x630px (16:9)
- Pictures: Variable, optimized for masonry grid
- User avatars: 200x200px minimum
- Placeholder gradients for missing images

**Image Placement:**
- Hero: Top of homepage with featured content
- Articles: Hero image above title
- Pictures: Gallery grid and detail views
- Stories: Full-screen vertical backgrounds
- User profiles: Avatar thumbnails throughout

### Interactive Elements

**Engagement Actions:**
- Like button with heart icon (outline/filled states)
- Comment button with count
- Share button with native share sheet
- Bookmark for saving content
- All actions with micro-animations (scale on tap)

**Content Creation:**
- Floating action button (bottom-right, 56px diameter)
- Quick action menu: New Story, New Article, Upload Picture
- Expands on click with labeled options

**Filtering & Search:**
- Filter chips with active state
- Search with instant results dropdown
- Sort options (Recent, Popular, Following)

### Responsive Behavior

**Mobile (< 768px):**
- Bottom navigation bar (Stories, Feed, Upload, Profile)
- Single column feed
- Stories take full width
- Hamburger menu for filters
- Swipe gestures for Stories navigation

**Tablet (768px - 1024px):**
- Two-column grid for Pictures
- Side navigation appears
- Articles maintain single column
- Larger touch targets

**Desktop (> 1024px):**
- Three-column sidebar layout (nav, content, suggestions)
- Multi-column grids (3-4 for Pictures)
- Hover states for all interactive elements
- Keyboard navigation support

### Animations

Use sparingly and purposefully:
- Card hover lift (transform: translateY(-4px))
- Like button heart pop (scale animation)
- Story progress bar (linear animation)
- Image lazy load fade-in
- Modal entry/exit transitions
- No scroll-triggered animations

This design creates a rich, engaging social platform that balances visual appeal with content readability and user engagement across all device sizes.