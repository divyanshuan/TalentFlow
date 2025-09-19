# TalentFlow 🚀

A modern, intuitive talent acquisition platform built with React and TypeScript. TalentFlow streamlines your entire hiring process from job posting to candidate assessment, making it easier than ever to find and hire the right talent.

## 🌟 What Makes TalentFlow Special?

TalentFlow isn't just another ATS (Applicant Tracking System) - it's a comprehensive hiring solution that grows with your team. Whether you're a startup looking to hire your first employees or an enterprise managing hundreds of positions, TalentFlow adapts to your needs.

### Key Features

- **📋 Smart Job Management** - Create, edit, and organize job postings with ease
- **👥 Candidate Pipeline** - Track candidates through every stage of your hiring process
- **📊 Visual Kanban Board** - Drag-and-drop interface for managing candidate flow
- **📝 Custom Assessments** - Build comprehensive evaluation forms for any role
- **💬 Collaborative Notes** - Team members can add notes and mentions
- **📱 Mobile Responsive** - Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Changes sync instantly across all team members

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd talentflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` and you're ready to go!

### Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build` folder, ready to be deployed to any static hosting service.

## 🎯 How TalentFlow Works

### The Complete Hiring Journey

TalentFlow is designed around a simple but powerful workflow that mirrors how great companies actually hire:

#### 1. **Job Management** 📋

Start by creating compelling job postings. Our intuitive form guides you through:

- Writing clear job descriptions
- Setting requirements and qualifications
- Adding location and salary information
- Organizing jobs with tags and categories

**Pro Tip:** Use our pre-built templates for common roles like "Frontend Developer" or "Product Manager" to get started quickly.

#### 2. **Candidate Sourcing** 👥

Once your job is live, candidates start flowing in. TalentFlow automatically:

- Organizes applications by job
- Captures essential contact information
- Tracks application sources
- Stores resumes and portfolios

#### 3. **Pipeline Management** 📊

This is where the magic happens. Our Kanban board lets you:

- **Drag and drop** candidates between stages
- **Filter** by job, stage, or search terms
- **See real-time statistics** for each stage
- **Track progress** with visual indicators

The typical pipeline stages are:

- **Applied** - New applications
- **Screen** - Initial phone/video screening
- **Tech** - Technical interviews or assessments
- **Offer** - Final interviews and negotiations
- **Hired** - Success! 🎉
- **Rejected** - Not a fit this time

#### 4. **Assessment Builder** 📝

Create custom evaluation forms that actually work:

- **Multiple question types** - Multiple choice, text responses, file uploads
- **Conditional logic** - Show questions based on previous answers
- **Role-specific templates** - Pre-built assessments for different positions
- **Scoring and analytics** - Track candidate performance

#### 5. **Team Collaboration** 💬

Keep your team aligned with:

- **Notes and mentions** - Tag team members in candidate discussions
- **Timeline tracking** - See every interaction and decision
- **Activity feeds** - Stay updated on candidate progress

## 🛠️ Technical Architecture

TalentFlow is built with modern web technologies for reliability and performance:

### Frontend Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Dexie.js** - Client-side database (IndexedDB)

### Key Design Decisions

**Why IndexedDB?** We chose Dexie.js (IndexedDB wrapper) for local storage because:

- Works offline - perfect for remote teams
- Fast data access - no network delays
- Secure - data stays on the user's device
- Scalable - handles thousands of records easily

**Why React Query?** For seamless data management:

- Automatic caching and background updates
- Optimistic updates for better UX
- Built-in loading and error states
- DevTools for debugging

## 📱 User Interface

TalentFlow features a clean, modern interface that's both beautiful and functional:

### Design Principles

- **Mobile-first** - Works great on any device
- **Accessible** - Follows WCAG guidelines
- **Intuitive** - Minimal learning curve
- **Consistent** - Unified design language throughout

### Color Scheme

- Primary: Professional blue tones
- Success: Green for positive actions
- Warning: Amber for attention items
- Error: Red for critical issues

## 🔧 Customization

TalentFlow is designed to be flexible and customizable:

### Adding New Job Stages

Modify the candidate stages in `src/types/index.ts`:

```typescript
export type CandidateStage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected"
  | "your-custom-stage"; // Add your own stages
```

### Custom Assessment Questions

Create new question types in the assessment builder by extending the `AssessmentQuestion` interface.

### Styling Customization

The app uses Tailwind CSS with a custom color palette. Modify `tailwind.config.js` to match your brand colors.

## 🚀 Deployment Options

TalentFlow can be deployed to any static hosting service:

### Recommended Platforms

- **Vercel** - Zero-config deployment with automatic previews
- **Netlify** - Great for teams with custom domains
- **AWS S3 + CloudFront** - Enterprise-grade hosting
- **GitHub Pages** - Free hosting for open source projects

### Environment Variables

For production deployment, you might want to configure:

- Database connection strings (if migrating to a backend)
- Analytics tracking IDs
- Custom domain settings

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed

## 📊 Sample Data

TalentFlow comes pre-loaded with realistic sample data to help you get started:

- **25+ Job Postings** - Covering various roles from startups to enterprise
- **1000+ Candidates** - With realistic names, emails, and profiles
- **5 Assessment Templates** - Ready-to-use evaluation forms
- **Timeline Events** - Sample candidate interactions and notes

## 🐛 Troubleshooting

### Common Issues

**Build fails with import errors**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Database not loading**

- Check browser console for IndexedDB errors
- Try clearing browser data and refreshing

**Styling issues**

- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes

### Getting Help

- Check the browser console for error messages
- Review the React Query DevTools for data issues
- Open an issue on GitHub with detailed error information

## 📈 Roadmap

We're constantly improving TalentFlow. Upcoming features include:

- **Email Integration** - Send emails directly from the platform
- **Calendar Integration** - Schedule interviews automatically
- **Advanced Analytics** - Detailed hiring metrics and insights
- **API Access** - Connect with other HR tools
- **Mobile App** - Native iOS and Android apps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

TalentFlow was built with love using these amazing open-source projects:

- React and the React community
- Tailwind CSS for beautiful styling
- Heroicons for consistent iconography
- Dexie.js for client-side database management
- And many more wonderful libraries

---

**Ready to transform your hiring process?** Start using TalentFlow today and see how much easier recruiting can be! 🚀

_Questions? Feedback? We'd love to hear from you! Open an issue or reach out to our team._
