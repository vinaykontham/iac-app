# Enterprise Infrastructure Provisioning Platform

A premium-grade enterprise application built with React + Firebase (Stitch stack) featuring a glassy black theme for cloud infrastructure provisioning using Terraform automation.

## 🚀 Features

### 🔐 Authentication
- **Google SSO Integration** via Firebase Authentication
- Secure user session management
- Enterprise-grade authentication flow

### 🎯 Core Functionality
- **Multi-Cloud Support**: Deploy infrastructure on GCP, AWS, and Azure
- **Multi-Step Wizard**: Intuitive infrastructure creation process
- **Terraform Integration**: Infrastructure as Code automation
- **Real-time Tracking**: Monitor deployment status and history
- **Dry Run Mode**: Preview infrastructure changes before deployment

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern glassy black theme with neon accents
- **Responsive Layout**: Works seamlessly across all device sizes
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Enterprise Typography**: Inter font family for professional appearance

### 🛠 Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **UI Components**: Shadcn/ui with custom theming
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Code Editor**: Monaco Editor for custom JSON configuration
- **Icons**: Lucide React icons

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Google Cloud Console project (for Google SSO)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd enterprise-infra-platform
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings

### 3. Environment Variables

Update `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) to view the application.

## 🏗 Application Structure

### Pages
- **Landing Page** (`/`): Authentication and feature showcase
- **Dashboard** (`/dashboard`): User overview and infrastructure history
- **Create Infrastructure** (`/create-infra`): Multi-step deployment wizard

### Key Components

#### Authentication
- `AuthProvider`: Firebase authentication context
- `SignInButton`: Google SSO integration

#### Infrastructure Management
- `InfraWizard`: Multi-step infrastructure creation wizard
- `InfraTable`: Infrastructure deployment history
- `CloudProviderStep`: Cloud platform selection (GCP/AWS/Azure)
- `ServiceSelectionStep`: Service selection based on provider
- `VariableInputStep`: Terraform variables and custom configuration
- `ReviewDeployStep`: Final review and deployment

### Wizard Flow

1. **Cloud Provider Selection**
   - Choose between GCP, AWS, or Azure
   - Enter project name

2. **Service Selection**
   - **GCP**: Compute Engine, GKE, Cloud SQL
   - **AWS**: EC2, EKS, RDS
   - **Azure**: Virtual Machines, AKS, Cosmos DB

3. **Configuration**
   - Set required Terraform variables
   - Add custom JSON configuration via Monaco editor
   - Toggle dry run mode

4. **Review & Deploy**
   - Review all configuration
   - Deploy infrastructure or run dry run
   - Track deployment status

## 🎨 Design System

### Glassmorphism Theme
- **Background**: Black with cyber grid pattern
- **Cards**: Semi-transparent with backdrop blur
- **Accents**: Cyan/blue neon colors
- **Typography**: Inter font family
- **Animations**: Smooth transitions and hover effects

### Color Palette
- **Primary**: Cyan (#00FFFF)
- **Secondary**: Blue (#0066FF)
- **Background**: Black (#000000)
- **Glass**: rgba(0, 0, 0, 0.25) with backdrop blur
- **Text**: White with various opacity levels

## 🔒 Security Features

- Firebase Authentication with Google SSO
- Secure API endpoints via Firebase Security Rules
- User-specific data isolation in Firestore
- Environment variable protection for sensitive data

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 📊 Database Schema

### Infrastructure Collection
```typescript
{
  id: string;
  userId: string;
  projectName: string;
  cloudProvider: "GCP" | "AWS" | "Azure";
  service: string;
  variables: Record<string, string>;
  customConfig?: string;
  dryRun: boolean;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: {
    uid: string;
    email: string;
    displayName: string;
  };
}
```

## 🔮 Future Enhancements

- **Real-time Terraform Logs**: WebSocket integration for live deployment logs
- **Email Notifications**: Deployment status notifications
- **Cost Estimation**: Pre-deployment cost calculations
- **Resource Monitoring**: Post-deployment resource monitoring
- **Team Collaboration**: Multi-user project management
- **Terraform State Management**: Remote state storage and locking
- **Infrastructure Templates**: Pre-built infrastructure templates
- **Compliance Scanning**: Security and compliance checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review Firebase and Next.js documentation

---

Built with ❤️ for enterprise infrastructure automation
