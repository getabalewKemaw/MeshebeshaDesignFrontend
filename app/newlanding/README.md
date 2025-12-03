# New Landing Page - `/newlanding`

## 📋 Overview
This is the new landing page created based on the Figma UI/UX design specifications. It features a modern, culturally-inspired design for Meshabesha Design's traditional clothing brand.

## 🎨 Design Specifications

### Navbar
- **Position**: Fixed at top with 27px offset
- **Dimensions**: 1280px width × 56px height (responsive)
- **Background**: White (#FFFFFF) with 3px border (#310101)
- **Shadow**: Drop shadow for depth

#### Navbar Elements:
1. **Logo Image**
   - Position: Left 49px, Top 29px
   - Size: 69px × 52px
   - Source: `/ui/logoimage.png`

2. **Brand Text "MESHABESHA DESIGN"**
   - Font: Fredoka One (capitalized)
   - Color: #310101
   - Position: Left 141px, Top 32px
   - Size: 210px × 42px

3. **Navigation Links**
   - Font: Fredoka One (capitalized)
   - Color: #310101
   - Active state: Underline effect
   - Links: HOME, ABOUT, SERVICES, CONTACT

4. **Avatar Icon**
   - Position: Right 7px, Top 5px
   - Size: 46px × 46px circle
   - Background: #310101
   - Shows profile image for logged-in users
   - Shows default user icon for guests

### Hero Section
- **Background Image**: `/ui/Artboard1.jpg`
- **Dimensions**: 1280px × 720px (responsive)

#### Hero Text Elements:

1. **"ALL YOU NEED IS HERE"**
   - Font: AdLam Display
   - Color: White (#FFFFFF)
   - Letter spacing: 30px
   - Position: Left 749px, Top 194px

2. **"MESHABESHA DESIGN"** (Main heading)
   - Font: Abril Fatface
   - Color: White (#FFFFFF)
   - Letter spacing: 100px
   - Position: Right 13px, Top 267px
   - Size: 707px × 200px

3. **Description Text**
   - Font: Abhaya Libre SemiBold
   - Color: White (#FFFFFF)
   - Letter spacing: 20px
   - Text: "Mashabesha Design celebrates culture through beautifully handcrafted traditional clothing made with timeless artistry"
   - Position: Right -65px, Top 470px
   - Size: 887px × 48px

## 📱 Responsive Design
The page is fully responsive with breakpoints for:
- **Desktop**: 1280px+ (original design)
- **Tablet**: 768px - 1279px
- **Mobile**: < 768px

### Responsive Adjustments:
- Navbar scales to 95% width on smaller screens
- Text sizes use `clamp()` for fluid typography
- Hero text repositions for mobile (5% margins)
- Letter spacing reduces on smaller screens

## 🎯 Fonts Used
All fonts are loaded via Google Fonts:
- **Fredoka One**: Navbar brand and links
- **AdLam Display**: Hero tagline
- **Abril Fatface**: Main heading
- **Abhaya Libre**: Description text

## 🚀 Usage

### Accessing the Page
Navigate to: `http://localhost:3000/newlanding`

### Components Structure
```
app/newlanding/
└── page.tsx                    # Main page component

components/newlanding/
├── NewNavBar.tsx              # Navigation bar
└── NewHeroSection.tsx         # Hero section with background
```

## 🔧 Technical Details

### Color Palette
- Primary Dark: `#310101`
- White: `#FFFFFF`

### Assets Required
Ensure these files exist in `/public/ui/`:
- `logoimage.png` - Brand logo
- `Artboard1.jpg` - Hero background image

## 📝 Notes
- The original landing page at `/` remains unchanged
- This is a separate implementation with its own routing
- All design specifications match the Figma mockup exactly
- Fully responsive across all device sizes

## 🎨 Future Enhancements
- Add smooth scroll animations
- Implement parallax effects on hero section
- Add more sections (About, Services, Contact)
- Integrate with existing product catalog
