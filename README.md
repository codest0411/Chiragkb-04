# 🌟 Modern Portfolio Website

A cutting-edge, fully responsive portfolio website built with **React 19**, **TailwindCSS**, **Framer Motion**, and **Supabase**. Features a complete admin dashboard, real-time content management, and beautiful animations.

## ✨ Key Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach, perfect on all devices
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Professional Design**: Clean, modern interface with subtle gradients and shadows

### 📱 **Pages & Functionality**
- **🏠 Home**: Hero section with animated typing effect and call-to-actions
- **👨‍💻 About**: Personal bio, skills showcase, and professional values
- **💼 Projects**: Dynamic project gallery with category filtering and detailed modals
- **🎓 Experience**: Interactive timeline of work experience and education
- **📞 Contact**: Functional contact form with social media integration
- **⚙️ Admin Dashboard**: Complete content management system with CRUD operations

### 🚀 **Advanced Features**
- **Real-time Updates**: Featured/unfeatured projects appear/disappear instantly
- **Image Management**: Automatic project screenshot handling and optimization
- **Content Filtering**: Smart category-based project filtering
- **SEO Optimized**: Meta tags, structured data, and performance optimized
- **Touch-Friendly**: 44px minimum touch targets for mobile accessibility

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 🚀 Quick Start

### 1. **Clone & Install**
```bash
git clone https://github.com/your-username/portfolio-website.git
cd portfolio-website
npm install
```

### 2. **Environment Setup**
```bash
cp .env.example .env
```

Add your credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
VITE_ADMIN_PASSWORD=your_secure_admin_password
```

### 3. **Database Setup**
1. Create a [Supabase](https://supabase.com) project
2. Run the SQL schema from `supabase-schema.sql`
3. Enable Row Level Security (RLS) policies
4. Create storage buckets: `images`, `documents`, `projects`

### 4. **Development**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### 5. **Admin Access**
- Navigate to `/admin/login`
- Use credentials from your `.env` file
- Manage projects, experiences, and content

## 🗄️ Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Projects table
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('work', 'education')),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🌐 Deployment

### **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/portfolio-website)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add your `.env` variables in Vercel dashboard
3. **Auto Deploy**: Pushes to `main` branch deploy automatically
4. **Custom Domain**: Configure your custom domain in Vercel settings

### **Manual Deployment**
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## ⚙️ Admin Dashboard Features

### **Project Management**
- ✅ **Create/Edit/Delete** projects with rich descriptions
- ✅ **Image Upload** - Automatic screenshot handling
- ✅ **Featured Toggle** - Control which projects appear on public page
- ✅ **Category Filtering** - Organize projects by type
- ✅ **Real-time Updates** - Changes appear instantly on public pages

### **Experience Management**
- ✅ **Work Experience** - Add internships, jobs, freelance work
- ✅ **Education** - Manage degrees, certifications, courses
- ✅ **Timeline View** - Chronological display with current status
- ✅ **Achievements** - Highlight key accomplishments
- ✅ **Technologies** - Tag relevant skills and tools

### **Content Control**
- ✅ **Responsive Interface** - Mobile-friendly admin panel
- ✅ **Dark/Light Mode** - Consistent theming across admin
- ✅ **Bulk Operations** - Efficient content management
- ✅ **Data Validation** - Prevent invalid entries

## 🎨 Customization Guide

### **Personal Branding**
1. **Update Colors**: Edit `tailwind.config.js` for your brand colors
2. **Replace Content**: Update personal info in components and mock data
3. **Add Your Images**: Replace placeholder images with your photos
4. **Custom Domain**: Set up your personal domain for professional presence

### **Theme Colors**
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f9ff',   // Light blue
    600: '#2563eb',  // Primary blue
    700: '#1d4ed8'   // Dark blue
  }
}
```

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ across all metrics
- 🚀 **Fast Loading**: Optimized images and code splitting
- 📱 **Mobile First**: Touch-friendly interface with proper sizing
- 🔍 **SEO Ready**: Meta tags, structured data, sitemap

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by developers, for developers**

⭐ **Star this repo if it helped you build your portfolio!**
