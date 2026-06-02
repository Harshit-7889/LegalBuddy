# LawAssist - AI Legal Assistant for Civil Laws

A professional, responsive React + TailwindCSS homepage for LawAssist, an AI assistant for civil law matters. Features role-aware UI and behaviors for four different user types.

## Features

- **Role-based UI**: Different interfaces for Guest, Registered User, Verified Lawyer, and Admin
- **Document Upload**: Drag & drop with consent flow and criminal content blocking
- **Template Library**: Legal document templates with role-based permissions
- **AI Chat Access**: General civil law questions with quota management
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Accessibility**: ARIA labels, keyboard navigation, high contrast

## User Roles

### Guest
- Limited uploads (3/month, 10MB max)
- No document history
- Watermarked exports
- Limited chat queries

### Registered User
- Higher quota (50 uploads/month, 25MB max)
- Full document history
- Watermark-free exports
- Unlimited chat queries

### Verified Lawyer
- Premium quota (100 uploads/month)
- Template submission rights
- Content moderation access
- Verified badge display

### Admin
- Unlimited access
- User management
- Content review queue
- System administration

## Tech Stack

- React 18
- TailwindCSS
- Lucide React (icons)
- Vite (build tool)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Role Testing

Use the DEV MODE controls in the top-right corner to switch between different user roles and test role-specific behaviors:

- **Guest**: Limited features, watermarked exports
- **User**: Full access, no watermarks
- **Lawyer**: Template editing, verified badge
- **Admin**: Admin dashboard, user management

## Key Components

- `HomePage`: Main page component with role-based rendering
- `NavBar`: Navigation with role-specific menu items
- `Hero`: Landing section with CTAs
- `UploadCTA`: Document upload with consent flow
- `TemplatesPreview`: Legal document templates
- `ChatAccess`: AI chat interface
- `DemoControls`: Role switching for testing

## Criminal Content Blocking

The application includes client-side criminal content detection that blocks:
- File uploads with criminal law keywords
- Chat queries about criminal matters
- Shows appropriate legal resources for criminal cases

## Backend Integration Points

The following functions are marked with TODO comments for backend integration:

- `onUpload(file)` - Document upload API
- `onRequestChat(query)` - Chat API
- `onDownload(docId, format)` - Document download API
- Template management APIs
- User authentication APIs

## Design System

- **Primary Color**: #1E3A8A (Deep navy)
- **Accent Color**: #FFD700 (Gold)
- **Background**: #F9FAFB (Neutral)
- **Text**: #111827 (Dark) and #4B5563 (Body grey)
- **Fonts**: Inter/Poppins

## License

This project is for demonstration purposes only.
