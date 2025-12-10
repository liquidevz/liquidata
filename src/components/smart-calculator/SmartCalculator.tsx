'use client'

import { useEffect, useMemo, useRef, useReducer, useCallback, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { AppWindow, ArrowRight, Blocks, Building2, Check, CheckCircle2, Heart, Layers, LifeBuoy, Monitor, Search, Server, Shield, Smartphone, Sparkles, Timer, Users, Globe, Database, Cloud, Lock, Zap, Palette, Code, Settings } from 'lucide-react'
import { apiPost, API_ENDPOINTS } from "@/config/api"


// Comprehensive conditional step system based on HTML reference
const getConditionalSteps = (state: any) => {
  const steps: Array<{ id: number; title: string; type: string }> = []
  let stepId = 1

  // Always present - Core identification
  steps.push({ id: stepId++, title: "Project type", type: "project-type" })
  steps.push({ id: stepId++, title: "Industries", type: "industries" })
  steps.push({ id: stepId++, title: "Type of service", type: "services" })

  // Conditional based on project type and complexity
  if (state.projectType === "website") {
    // Simple website flow (3-8 steps total)
    steps.push({ id: stepId++, title: "Project scope", type: "scope" })
    steps.push({ id: stepId++, title: "Timeline", type: "timeline" })
    steps.push({ id: stepId++, title: "Budget range", type: "budget" })
    steps.push({ id: stepId++, title: "Contact information", type: "contact" })
    steps.push({ id: stepId++, title: "Receive estimate", type: "estimate" })
  } else {
    // Complex application flow (14-20+ steps)
    steps.push({ id: stepId++, title: "Additional services", type: "additional-services" })
    steps.push({ id: stepId++, title: "Project scope", type: "scope" })
    steps.push({ id: stepId++, title: "Team size", type: "team" })
    steps.push({ id: stepId++, title: "Timeline", type: "timeline" })
    
    // Technical requirements
    steps.push({ id: stepId++, title: "Tech Stack", type: "tech-stack" })
    steps.push({ id: stepId++, title: "Platform targets", type: "platforms" })
    steps.push({ id: stepId++, title: "Core features", type: "features" })
    steps.push({ id: stepId++, title: "User authentication", type: "auth" })
    steps.push({ id: stepId++, title: "Database requirements", type: "database" })
    
    // Design & UX
    steps.push({ id: stepId++, title: "Design Requirements", type: "design-requirements" })
    steps.push({ id: stepId++, title: "User experience flow", type: "ux-flow" })
    
    // Integrations & Advanced features
    steps.push({ id: stepId++, title: "Integrations", type: "integrations" })
    
    // Mobile-specific steps
    if (state.projectType === "mobile-app") {
      steps.push({ id: stepId++, title: "App store requirements", type: "app-store" })
      steps.push({ id: stepId++, title: "Device features", type: "device-features" })
      steps.push({ id: stepId++, title: "Push notifications", type: "notifications" })
    }
    
    // Web app specific steps  
    if (state.projectType === "web-app") {
      steps.push({ id: stepId++, title: "Web technologies", type: "web-tech" })
      steps.push({ id: stepId++, title: "Performance requirements", type: "performance" })
      steps.push({ id: stepId++, title: "SEO requirements", type: "seo" })
    }
    
    // E-commerce conditional steps
    if (state.selectedServices?.includes("E-commerce") || state.selectedFeatures?.includes("Payment processing")) {
      steps.push({ id: stepId++, title: "Payment methods", type: "payment-methods" })
      steps.push({ id: stepId++, title: "Inventory management", type: "inventory" })
      steps.push({ id: stepId++, title: "Shipping & logistics", type: "shipping" })
      steps.push({ id: stepId++, title: "Tax & compliance", type: "tax-compliance" })
    }
    
    // Enterprise/Finance conditional steps
    if (state.selectedIndustries?.includes("Finance") || state.selectedIndustries?.includes("Healthcare") || state.selectedIndustries?.includes("Insurance")) {
      steps.push({ id: stepId++, title: "Compliance requirements", type: "compliance" })
      steps.push({ id: stepId++, title: "Security standards", type: "security" })
      steps.push({ id: stepId++, title: "Data privacy (GDPR/HIPAA)", type: "privacy" })
      steps.push({ id: stepId++, title: "Audit requirements", type: "audit" })
    }
    
    // AI/ML conditional steps
    if (state.selectedFeatures?.includes("AI/ML") || state.selectedFeatures?.includes("Machine Learning")) {
      steps.push({ id: stepId++, title: "AI/ML requirements", type: "ai-ml" })
      steps.push({ id: stepId++, title: "Data analytics", type: "analytics" })
      steps.push({ id: stepId++, title: "Model training", type: "model-training" })
    }
    
    // Infrastructure & Deployment
    steps.push({ id: stepId++, title: "Hosting & infrastructure", type: "hosting" })
    steps.push({ id: stepId++, title: "Scalability requirements", type: "scalability" })
    steps.push({ id: stepId++, title: "DevOps & CI/CD", type: "devops" })
    
    // Final project management steps
    steps.push({ id: stepId++, title: "Quality assurance", type: "qa" })
    steps.push({ id: stepId++, title: "Support & Maintenance", type: "support" })
    steps.push({ id: stepId++, title: "Budget Range", type: "budget" })
    steps.push({ id: stepId++, title: "Contact information", type: "contact" })
    steps.push({ id: stepId++, title: "Receive an estimate", type: "estimate" })
  }

  return steps
}

const projectTypes = [
  { key: "website", title: "Website", desc: "Marketing site, portfolio, blog", Icon: Monitor },
  { key: "web-app", title: "Web Application", desc: "SaaS, dashboard, web platform", Icon: AppWindow },
  { key: "mobile-app", title: "Mobile Application", desc: "iOS, Android, cross-platform", Icon: Smartphone },
  { key: "desktop-app", title: "Desktop Application", desc: "Windows, macOS, Linux", Icon: Monitor },
  { key: "api-backend", title: "API & Backend", desc: "REST API, microservices", Icon: Server },
]

const industries = [
  { key: "SaaS", Icon: Layers },
  { key: "Healthcare", Icon: Heart },
  { key: "Finance", Icon: Building2 },
  { key: "Education", Icon: Sparkles },
  { key: "E-commerce", Icon: Globe },
  { key: "Transportation", Icon: Layers },
  { key: "IoT", Icon: Blocks },
  { key: "Insurance", Icon: Shield },
  { key: "Real Estate", Icon: Building2 },
  { key: "Web3", Icon: Blocks },
  { key: "Social Media", Icon: Users },
  { key: "Gaming", Icon: Sparkles },
  { key: "Media & Entertainment", Icon: Users },
  { key: "Government", Icon: Shield },
  { key: "Non-profit", Icon: Heart },
]

const platforms = [
  { key: "web", title: "Web Browser", desc: "Chrome, Safari, Firefox", Icon: Globe },
  { key: "ios", title: "iOS", desc: "iPhone, iPad", Icon: Smartphone },
  { key: "android", title: "Android", desc: "Android phones, tablets", Icon: Smartphone },
  { key: "windows", title: "Windows", desc: "Windows 10/11", Icon: Monitor },
  { key: "macos", title: "macOS", desc: "Mac computers", Icon: Monitor },
  { key: "linux", title: "Linux", desc: "Ubuntu, CentOS", Icon: Monitor },
]

const coreFeatures = [
  { key: "User management", Icon: Users },
  { key: "Authentication", Icon: Lock },
  { key: "Payment processing", Icon: Building2 },
  { key: "E-commerce", Icon: Globe },
  { key: "Content management", Icon: Layers },
  { key: "Real-time chat", Icon: Users },
  { key: "File upload/storage", Icon: Database },
  { key: "Search functionality", Icon: Search },
  { key: "Analytics & reporting", Icon: Sparkles },
  { key: "API integrations", Icon: Blocks },
  { key: "Notifications", Icon: Zap },
  { key: "Multi-language", Icon: Globe },
  { key: "Social login", Icon: Users },
  { key: "Data visualization", Icon: Sparkles },
  { key: "AI/ML features", Icon: Sparkles },
  { key: "Workflow automation", Icon: Settings },
]

const authMethods = [
  { key: "email-password", title: "Email & Password", Icon: Lock },
  { key: "social-login", title: "Social Login", desc: "Google, Facebook, etc.", Icon: Users },
  { key: "sso", title: "Single Sign-On (SSO)", desc: "SAML, OAuth", Icon: Shield },
  { key: "2fa", title: "Two-Factor Authentication", Icon: Shield },
  { key: "biometric", title: "Biometric Auth", desc: "Fingerprint, Face ID", Icon: Smartphone },
]

const databases = [
  { key: "postgresql", title: "PostgreSQL", desc: "Relational database", Icon: Database },
  { key: "mysql", title: "MySQL", desc: "Popular SQL database", Icon: Database },
  { key: "mongodb", title: "MongoDB", desc: "NoSQL document database", Icon: Database },
  { key: "firebase", title: "Firebase", desc: "Google's platform", Icon: Database },
  { key: "supabase", title: "Supabase", desc: "Open source alternative", Icon: Database },
  { key: "redis", title: "Redis", desc: "In-memory cache", Icon: Database },
]

const integrations = [
  { key: "stripe", title: "Stripe", desc: "Payment processing", Icon: Building2 },
  { key: "paypal", title: "PayPal", desc: "Payment gateway", Icon: Building2 },
  { key: "sendgrid", title: "SendGrid", desc: "Email delivery", Icon: LifeBuoy },
  { key: "twilio", title: "Twilio", desc: "SMS & voice", Icon: Smartphone },
  { key: "aws-s3", title: "AWS S3", desc: "File storage", Icon: Cloud },
  { key: "google-maps", title: "Google Maps", desc: "Location services", Icon: Globe },
  { key: "analytics", title: "Google Analytics", desc: "Web analytics", Icon: Sparkles },
  { key: "crm", title: "CRM Integration", desc: "Salesforce, HubSpot", Icon: Users },
]

const designSystems = [
  { key: "custom", title: "Custom Design System", desc: "Built from scratch", Icon: Palette },
  { key: "material", title: "Material Design", desc: "Google's design system", Icon: Palette },
  { key: "bootstrap", title: "Bootstrap", desc: "Popular CSS framework", Icon: Palette },
  { key: "tailwind", title: "Tailwind CSS", desc: "Utility-first CSS", Icon: Palette },
  { key: "ant-design", title: "Ant Design", desc: "Enterprise design language", Icon: Palette },
]

const hostingOptions = [
  { key: "aws", title: "Amazon Web Services", desc: "Enterprise cloud", Icon: Cloud },
  { key: "vercel", title: "Vercel", desc: "Frontend deployment", Icon: Cloud },
  { key: "netlify", title: "Netlify", desc: "JAMstack hosting", Icon: Cloud },
  { key: "heroku", title: "Heroku", desc: "Simple deployment", Icon: Cloud },
  { key: "digital-ocean", title: "DigitalOcean", desc: "Developer cloud", Icon: Cloud },
  { key: "google-cloud", title: "Google Cloud", desc: "Google's cloud platform", Icon: Cloud },
]

const scopes = [
  { key: "mvp", title: "MVP", desc: "Minimum viable product", Icon: Sparkles },
  { key: "standard", title: "Standard", desc: "Full-featured application", Icon: Layers },
  { key: "enterprise", title: "Enterprise", desc: "Complex, scalable solution", Icon: Timer },
]

const teams = [
  { key: "solo", title: "Solo Developer", desc: "1 developer", range: "1" },
  { key: "small", title: "Small Team", desc: "2-4 specialists", range: "2-4" },
  { key: "medium", title: "Medium Team", desc: "5-8 specialists", range: "5-8" },
  { key: "large", title: "Large Team", desc: "9+ specialists", range: "9+" },
]

const timelines = [
  { key: "rush", title: "Rush (1-2 months)", desc: "Urgent delivery" },
  { key: "standard", title: "Standard (3-6 months)", desc: "Balanced approach" },
  { key: "extended", title: "Extended (6-12 months)", desc: "Comprehensive development" },
  { key: "ongoing", title: "Ongoing (12+ months)", desc: "Phased development" },
]

const budgetRanges = [
  { key: "startup", title: "$5K - $25K", desc: "Startup budget", Icon: Building2 },
  { key: "small", title: "$25K - $75K", desc: "Small business", Icon: Building2 },
  { key: "medium", title: "$75K - $200K", desc: "Growing company", Icon: Building2 },
  { key: "large", title: "$200K - $500K", desc: "Enterprise project", Icon: Building2 },
  { key: "enterprise", title: "$500K+", desc: "Large enterprise", Icon: Building2 },
]

const supportOptions = [
  { key: "none", title: "No Support", desc: "One-time delivery", Icon: Timer },
  { key: "basic", title: "Basic Support", desc: "3 months bug fixes", Icon: LifeBuoy },
  { key: "standard", title: "Standard Support", desc: "6 months + updates", Icon: LifeBuoy },
  { key: "premium", title: "Premium Support", desc: "12 months + priority", Icon: LifeBuoy },
  { key: "enterprise", title: "Enterprise Support", desc: "24/7 dedicated support", Icon: Shield },
]

// Additional service types
const serviceTypes = [
  { key: "web-development", title: "Web Development", desc: "Custom websites & web apps", Icon: Globe },
  { key: "mobile-development", title: "Mobile Development", desc: "iOS & Android apps", Icon: Smartphone },
  { key: "ui-ux-design", title: "UI/UX Design", desc: "User interface & experience", Icon: Palette },
  { key: "backend-development", title: "Backend Development", desc: "APIs & server architecture", Icon: Server },
  { key: "devops", title: "DevOps & Infrastructure", desc: "Deployment & scaling", Icon: Cloud },
  { key: "consulting", title: "Technical Consulting", desc: "Architecture & strategy", Icon: Sparkles },
]

const additionalServices = [
  { key: "branding", title: "Branding & Logo Design", Icon: Palette },
  { key: "content-creation", title: "Content Creation", Icon: Users },
  { key: "seo", title: "SEO Optimization", Icon: Search },
  { key: "analytics", title: "Analytics Setup", Icon: Sparkles },
  { key: "maintenance", title: "Ongoing Maintenance", Icon: Settings },
  { key: "training", title: "Team Training", Icon: Users },
  { key: "documentation", title: "Technical Documentation", Icon: Layers },
  { key: "testing", title: "Quality Assurance Testing", Icon: Shield },
]

const techStacks = [
  { key: "react-nextjs", title: "React + Next.js", desc: "Modern React framework", Icon: Code },
  { key: "vue-nuxt", title: "Vue + Nuxt", desc: "Progressive framework", Icon: Code },
  { key: "angular", title: "Angular", desc: "Enterprise framework", Icon: Code },
  { key: "nodejs", title: "Node.js", desc: "JavaScript runtime", Icon: Server },
  { key: "python-django", title: "Python + Django", desc: "Rapid development", Icon: Server },
  { key: "php-laravel", title: "PHP + Laravel", desc: "Web artisan framework", Icon: Server },
  { key: "ruby-rails", title: "Ruby on Rails", desc: "Convention over configuration", Icon: Server },
  { key: "dotnet", title: ".NET Core", desc: "Microsoft framework", Icon: Server },
]

// State management
type CalculatorState = {
  step: number
  projectType: string
  selectedIndustries: string[]
  selectedServices: string[]
  selectedAdditionalServices: string[]
  selectedPlatforms: string[]
  selectedFeatures: string[]
  selectedAuth: string[]
  selectedDatabases: string[]
  selectedIntegrations: string[]
  selectedTechStack: string[]
  designSystem?: string
  hostingOption?: string
  scope?: string
  team?: string
  timeline?: string
  budgetRange?: string
  supportOption?: string
  contactInfo: {
    name: string
    email: string
    company: string
    phone: string
  }

}

type CalculatorAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_PROJECT_TYPE'; payload: string }
  | { type: 'TOGGLE_INDUSTRY'; payload: string }
  | { type: 'TOGGLE_SERVICE'; payload: string }
  | { type: 'TOGGLE_ADDITIONAL_SERVICE'; payload: string }
  | { type: 'TOGGLE_PLATFORM'; payload: string }
  | { type: 'TOGGLE_FEATURE'; payload: string }
  | { type: 'TOGGLE_AUTH'; payload: string }
  | { type: 'TOGGLE_DATABASE'; payload: string }
  | { type: 'TOGGLE_INTEGRATION'; payload: string }
  | { type: 'TOGGLE_TECH_STACK'; payload: string }
  | { type: 'SET_DESIGN_SYSTEM'; payload: string }
  | { type: 'SET_HOSTING'; payload: string }
  | { type: 'SET_SCOPE'; payload: string }
  | { type: 'SET_TEAM'; payload: string }
  | { type: 'SET_TIMELINE'; payload: string }
  | { type: 'SET_BUDGET'; payload: string }
  | { type: 'SET_SUPPORT'; payload: string }
  | { type: 'SET_CONTACT_FIELD'; field: keyof CalculatorState['contactInfo']; value: string }

  | { type: 'RESET' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }

const initialState: CalculatorState = {
  step: 0,
  projectType: "",
  selectedIndustries: [],
  selectedServices: [],
  selectedAdditionalServices: [],
  selectedPlatforms: [],
  selectedFeatures: [],
  selectedAuth: [],
  selectedDatabases: [],
  selectedIntegrations: [],
  selectedTechStack: [],
  designSystem: undefined,
  hostingOption: undefined,
  scope: undefined,
  team: undefined,
  timeline: undefined,
  budgetRange: undefined,
  supportOption: undefined,
  contactInfo: {
    name: '',
    email: '',
    company: '',
    phone: ''
  },

}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    
    case 'NEXT_STEP': {
      const currentSteps = getConditionalSteps(state)
      return { ...state, step: Math.min(state.step + 1, currentSteps.length - 1) }
    }
    
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 0) }
    
    case 'SET_PROJECT_TYPE':
      return { ...state, projectType: action.payload }
    
    case 'TOGGLE_INDUSTRY':
      return {
        ...state,
        selectedIndustries: state.selectedIndustries.includes(action.payload)
          ? state.selectedIndustries.filter(i => i !== action.payload)
          : [...state.selectedIndustries, action.payload]
      }
    
    case 'TOGGLE_SERVICE':
      return {
        ...state,
        selectedServices: state.selectedServices.includes(action.payload)
          ? state.selectedServices.filter(s => s !== action.payload)
          : [...state.selectedServices, action.payload]
      }
    
    case 'TOGGLE_ADDITIONAL_SERVICE':
      return {
        ...state,
        selectedAdditionalServices: state.selectedAdditionalServices.includes(action.payload)
          ? state.selectedAdditionalServices.filter(s => s !== action.payload)
          : [...state.selectedAdditionalServices, action.payload]
      }
    
    case 'TOGGLE_PLATFORM':
      return {
        ...state,
        selectedPlatforms: state.selectedPlatforms.includes(action.payload)
          ? state.selectedPlatforms.filter(p => p !== action.payload)
          : [...state.selectedPlatforms, action.payload]
      }
    
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        selectedFeatures: state.selectedFeatures.includes(action.payload)
          ? state.selectedFeatures.filter(f => f !== action.payload)
          : [...state.selectedFeatures, action.payload]
      }
    
    case 'TOGGLE_AUTH':
      return {
        ...state,
        selectedAuth: state.selectedAuth.includes(action.payload)
          ? state.selectedAuth.filter(a => a !== action.payload)
          : [...state.selectedAuth, action.payload]
      }
    
    case 'TOGGLE_DATABASE':
      return {
        ...state,
        selectedDatabases: state.selectedDatabases.includes(action.payload)
          ? state.selectedDatabases.filter(d => d !== action.payload)
          : [...state.selectedDatabases, action.payload]
      }
    
    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        selectedIntegrations: state.selectedIntegrations.includes(action.payload)
          ? state.selectedIntegrations.filter(i => i !== action.payload)
          : [...state.selectedIntegrations, action.payload]
      }
    
    case 'TOGGLE_TECH_STACK':
      return {
        ...state,
        selectedTechStack: state.selectedTechStack.includes(action.payload)
          ? state.selectedTechStack.filter(t => t !== action.payload)
          : [...state.selectedTechStack, action.payload]
      }
    
    case 'SET_DESIGN_SYSTEM':
      return { ...state, designSystem: action.payload }
    
    case 'SET_HOSTING':
      return { ...state, hostingOption: action.payload }
    
    case 'SET_SCOPE':
      return { ...state, scope: action.payload }
    
    case 'SET_TEAM':
      return { ...state, team: action.payload }
    
    case 'SET_TIMELINE':
      return { ...state, timeline: action.payload }
    
    case 'SET_BUDGET':
      return { ...state, budgetRange: action.payload }
    
    case 'SET_SUPPORT':
      return { ...state, supportOption: action.payload }
    
    case 'SET_CONTACT_FIELD':
      return {
        ...state,
        contactInfo: {
          ...state.contactInfo,
          [action.field]: action.value
        }
      }
    

    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

function computeEstimate(state: CalculatorState) {
  let base = 50000 // Base cost

  // Project type multiplier
  const typeMultipliers = {
    "website": 0.5,
    "web-app": 1.0,
    "mobile-app": 1.2,
    "desktop-app": 1.1,
    "api-backend": 0.8
  }
  base *= typeMultipliers[state.projectType as keyof typeof typeMultipliers] || 1

  // Platform costs
  base += state.selectedPlatforms.length * 25000

  // Feature costs
  const featureCosts = {
    "User management": 15000,
    "Authentication": 10000,
    "Payment processing": 25000,
    "E-commerce": 40000,
    "Content management": 20000,
    "Real-time chat": 30000,
    "File upload/storage": 15000,
    "Search functionality": 20000,
    "Analytics & reporting": 25000,
    "API integrations": 15000,
    "Notifications": 10000,
    "Multi-language": 15000,
    "Social login": 8000,
    "Data visualization": 30000,
    "AI/ML features": 50000,
    "Workflow automation": 35000,
  }
  
  state.selectedFeatures.forEach(feature => {
    base += featureCosts[feature as keyof typeof featureCosts] || 10000
  })

  // Industry complexity
  const industryMultipliers = {
    "Healthcare": 1.3,
    "Finance": 1.4,
    "Insurance": 1.3,
    "Government": 1.2,
    "E-commerce": 1.1,
  }
  
  state.selectedIndustries.forEach(industry => {
    base *= industryMultipliers[industry as keyof typeof industryMultipliers] || 1
  })

  // Scope multiplier
  const scopeMultipliers = {
    "mvp": 0.7,
    "standard": 1.0,
    "enterprise": 1.8
  }
  base *= scopeMultipliers[state.scope as keyof typeof scopeMultipliers] || 1

  // Team size impact
  const teamMultipliers = {
    "solo": 0.8,
    "small": 1.0,
    "medium": 1.2,
    "large": 1.5
  }
  base *= teamMultipliers[state.team as keyof typeof teamMultipliers] || 1

  // Timeline urgency
  const timelineMultipliers = {
    "rush": 1.5,
    "standard": 1.0,
    "extended": 0.9,
    "ongoing": 0.8
  }
  base *= timelineMultipliers[state.timeline as keyof typeof timelineMultipliers] || 1

  const low = Math.round((base * 0.85) / 1000) * 1000
  const high = Math.round((base * 1.25) / 1000) * 1000
  
  return { low, high }
}

function currency(n: number) {
  return n.toLocaleString('en-IN', { style: "currency", currency: "INR", maximumFractionDigits: 0 })
}

export default function SmartCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const reduceMotion = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current steps based on selections
  const currentSteps = useMemo(() => getConditionalSteps(state), [state])
  const currentStepData = currentSteps[state.step]
  
  // Validation logic
  const canNext = useMemo(() => {
    if (!currentStepData) return false
    
    switch (currentStepData.type) {
      case 'project-type': return !!state.projectType
      case 'industries': return state.selectedIndustries.length > 0
      case 'services': return state.selectedServices.length > 0
      case 'additional-services': return true // Optional
      case 'platforms': return state.selectedPlatforms.length > 0
      case 'features': return state.selectedFeatures.length > 0
      case 'auth': return state.selectedAuth.length > 0
      case 'database': return state.selectedDatabases.length > 0
      case 'integrations': return true // Optional
      case 'tech-stack': return state.selectedTechStack.length > 0
      case 'design-system': return !!state.designSystem
      case 'design-requirements': return !!state.designSystem
      case 'hosting': return !!state.hostingOption
      case 'scope': return !!state.scope
      case 'team': return !!state.team
      case 'timeline': return !!state.timeline
      case 'budget': return !!state.budgetRange
      case 'support': return !!state.supportOption
      case 'contact': return true // Contact is now a modal, not a blocking step
      default: return true
    }
  }, [state, currentStepData])

  const estimate = useMemo(() => computeEstimate(state), [state])

  const handleSubmitCalculator = async () => {
    // Check if contact info is filled
    if (!state.contactInfo.name || !state.contactInfo.email) {
      setShowContactModal(true)
      return
    }

    setSubmitting(true)
    setSubmitMessage(null)

    try {
      // Prepare submission data
      const submissionData = {
        selections: {
          projectType: state.projectType,
          selectedIndustries: state.selectedIndustries,
          selectedServices: state.selectedServices,
          selectedFeatures: state.selectedFeatures,
          selectedPlatforms: state.selectedPlatforms,
          selectedIntegrations: state.selectedIntegrations,
          selectedTechStack: state.selectedTechStack,
          scope: state.scope,
          team: state.team,
          timeline: state.timeline,
          support: state.supportOption,
        },
        result: {
          basePrice: (estimate.low + estimate.high) / 2,
          finalPrice: (estimate.low + estimate.high) / 2,
          lowEstimate: estimate.low,
          highEstimate: estimate.high,
          gstAmount: ((estimate.low + estimate.high) / 2) * 0.18,
          totalWithGST: ((estimate.low + estimate.high) / 2) * 1.18,
          currency: 'INR',
          estimateRange: `${currency(estimate.low)} - ${currency(estimate.high)}`,
          formattedPrice: currency((estimate.low + estimate.high) / 2),
          formattedTotal: currency(((estimate.low + estimate.high) / 2) * 1.18),
          breakdown: {}
        },
        contactInfo: {
          name: state.contactInfo.name,
          email: state.contactInfo.email,
          phone: state.contactInfo.phone,
          company: state.contactInfo.company
        }
      }

      const response = await apiPost(API_ENDPOINTS.calculatorSubmissions, submissionData);
      
      setShowContactModal(false)
      setShowSuccessModal(true)
      // Auto-close modal and redirect after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false)
        window.location.href = '/'
      }, 5000)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitMessage({ 
        type: 'error', 
        text: '❌ Error connecting to server. Please make sure the backend is running.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Don't render until mounted
  if (!mounted) {
  return (
      <div className="min-h-screen w-full relative flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading calculator...</div>
      </div>
    )
  }

  const isEstimateStep = currentStepData?.type === 'estimate'

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#07071a] p-0 mt-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full blur-[80px] opacity-40 bg-fuchsia-700/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-[90px] opacity-40 bg-purple-700/20" />

      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3 backdrop-blur bg-white/5 border-b border-white/10">
          
          <div className="w-16" />
        </div>
        <ProgressMobile step={state.step} total={currentSteps.length} />
      </div>

      <div className="w-full px-3 md:px-4 pt-4 pb-4 md:pt-6 md:pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 h-full">
          <div className="relative">
            {/* Main white card */}
            <div className="relative overflow-hidden border-0 bg-white shadow-2xl rounded-[16px] md:rounded-[28px] min-h-[85vh] max-h-[90vh] flex flex-col">
              {/* Tab notch */}
              <div className="pointer-events-none absolute -top-6 right-28 h-12 w-28 rounded-b-[24px] bg-[#07071a]" />

              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden md:block p-6 border-r border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="inline-flex items-center justify-center rounded-full bg-[#3f2ae2] text-white w-8 h-8">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-900">Smart Calculator</span>
                  </div>
                  <nav className="max-h-96 overflow-y-auto">
                    <ol className="space-y-2">
                      {currentSteps.map((s, idx) => {
                        const stepState = idx < state.step ? "done" : idx === state.step ? "active" : "todo"
                        return (
                          <li key={s.id} className="flex items-center gap-3">
                            <StepBullet state={stepState} />
                            <span className={`text-xs ${stepState === "active" ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                              {s.title}
                            </span>
                          </li>
                        )
                      })}
                    </ol>
                  </nav>
                </aside>

                {/* Main content */}
                <section ref={contentRef} className="p-3 md:p-6 lg:p-8 flex flex-col h-full overflow-auto">
                  {/* Header with step indicator matching reference */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 flex-1">
                      {/* Step indicator dot - exact match from reference */}
                      <div className="flex items-center justify-center w-4 h-4 rounded-full" style={{ backgroundColor: 'rgb(56 39 199)' }}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <span className="text-lg font-medium text-slate-900 flex-1">
                        {currentStepData?.title || "Loading..."}
                      </span>
                    </div>
                    
                    {/* Step counter and badge - exact match from reference */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Step
                      </span>
                      <div className="bg-slate-200 rounded-full px-3 py-1 flex items-center gap-1">
                        <span className="text-xs font-medium" style={{ color: 'rgb(56 39 199)' }}>
                          {state.step + 1}
                        </span>
                        <span className="text-xs font-medium text-blue-300">
                          /
                        </span>
                        <span className="text-xs font-medium text-blue-300">
                          {currentSteps.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main question */}
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 mb-2">
                      {getHeadlineForStep(currentStepData?.type)}
                    </h2>
                  </div>

                  <div className="mt-4 md:mt-6 flex-1 overflow-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${state.step}-${currentStepData?.type}`}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Render step content based on type */}
                        {currentStepData?.type === 'project-type' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                            {projectTypes.map(({ key, title, desc, Icon }) => (
                              <OptionRow 
                                key={key} 
                                selected={state.projectType === key} 
                                onClick={() => dispatch({ type: 'SET_PROJECT_TYPE', payload: key })} 
                                Icon={Icon} 
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'industries' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {industries.map(({ key, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedIndustries.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_INDUSTRY', payload: key })}
                                Icon={Icon}
                                label={key}
                                multi
                                compact
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'services' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                            {serviceTypes.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedServices.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_SERVICE', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'additional-services' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {additionalServices.map(({ key, title, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedAdditionalServices.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_ADDITIONAL_SERVICE', payload: key })}
                                Icon={Icon}
                                label={title}
                                multi
                                compact
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'tech-stack' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                            {techStacks.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedTechStack.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_TECH_STACK', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'platforms' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                            {platforms.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedPlatforms.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_PLATFORM', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'features' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {coreFeatures.map(({ key, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedFeatures.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_FEATURE', payload: key })}
                                Icon={Icon}
                                label={key}
                                multi
                                compact
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'auth' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {authMethods.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedAuth.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_AUTH', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'database' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {databases.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedDatabases.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_DATABASE', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'integrations' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {integrations.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.selectedIntegrations.includes(key)}
                                onClick={() => dispatch({ type: 'TOGGLE_INTEGRATION', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                                multi
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'design-system' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {designSystems.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.designSystem === key}
                                onClick={() => dispatch({ type: 'SET_DESIGN_SYSTEM', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'hosting' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {hostingOptions.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.hostingOption === key}
                                onClick={() => dispatch({ type: 'SET_HOSTING', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'scope' && (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {scopes.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.scope === key}
                                onClick={() => dispatch({ type: 'SET_SCOPE', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'team' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {teams.map(({ key, title, desc, range }) => (
                              <OptionRow
                                key={key}
                                selected={state.team === key}
                                onClick={() => dispatch({ type: 'SET_TEAM', payload: key })}
                                Icon={Users}
                                label={title}
                                description={desc}
                                badge={range}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'timeline' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {timelines.map(({ key, title, desc }) => (
                              <OptionRow
                                key={key}
                                selected={state.timeline === key}
                                onClick={() => dispatch({ type: 'SET_TIMELINE', payload: key })}
                                Icon={Timer}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'budget' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {budgetRanges.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.budgetRange === key}
                                onClick={() => dispatch({ type: 'SET_BUDGET', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}

                        {currentStepData?.type === 'support' && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {supportOptions.map(({ key, title, desc, Icon }) => (
                              <OptionRow
                                key={key}
                                selected={state.supportOption === key}
                                onClick={() => dispatch({ type: 'SET_SUPPORT', payload: key })}
                                Icon={Icon}
                                label={title}
                                description={desc}
                              />
                            ))}
                          </div>
                        )}


                        {currentStepData?.type === 'estimate' && (
                          <div className="space-y-6">
                            {submitMessage && (
                              <div className={`p-4 rounded-lg border ${
                                submitMessage.type === 'success' 
                                  ? 'bg-green-50 border-green-200 text-green-800' 
                                  : 'bg-red-50 border-red-200 text-red-800'
                              }`}>
                                {submitMessage.text}
                              </div>
                            )}
                            <div className="p-6 border border-slate-200 rounded-2xl shadow-sm bg-white">
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900">Your Project Estimate</h3>
                                  <p className="text-sm text-slate-500">Based on your selections and requirements</p>
                                </div>
                                <span className="bg-[#3f2ae2] text-white px-3 py-1 rounded-full text-sm">Final</span>
                              </div>
                              <div className="text-center">
                                <div className="text-4xl font-bold text-slate-900 mb-2">
                                  {currency(estimate.low)} - {currency(estimate.high)}
                                </div>
                                <p className="text-slate-600">Estimated project cost</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom navigation - exact match from reference */}
                  <div className="sticky bottom-0 bg-white pt-4 pb-2 flex items-center justify-between gap-4 border-t border-slate-100 mt-6">
                    {/* Back button - exact match from reference */}
                    <button
                      onClick={() => dispatch({ type: 'PREV_STEP' })}
                      disabled={state.step === 0}
                      className="px-8 py-3 border border-blue-300 rounded-full text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm font-medium"
                    >
                      Back
                    </button>

                    <div className="flex-1 flex justify-end">
                      {!isEstimateStep ? (
                        <button
                          onClick={() => dispatch({ type: 'NEXT_STEP' })}
                          disabled={!canNext}
                          className="px-8 py-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm font-medium min-w-[120px]"
                          style={{
                            backgroundColor: canNext ? 'rgb(56, 39, 199)' : undefined,
                            border: '1px solid currentColor'
                          }}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitCalculator}
                          disabled={submitting}
                          className="px-8 py-3 rounded-full text-white uppercase text-sm font-medium min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: 'rgb(56, 39, 199)',
                            border: '1px solid currentColor'
                          }}
                        >
                          {submitting ? 'Saving...' : 'Get Quote'}
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Desktop sidebar summary */}
          <div className="hidden xl:block space-y-4">
            <div className="rounded-3xl bg-[#3f2ae2] text-white px-6 py-5 shadow-lg">
              <h3 className="text-xl font-semibold">Summary</h3>
            </div>
            <div className="rounded-3xl p-6 bg-white/90 backdrop-blur border-white/40 sticky top-6 shadow-lg">
              <div className="text-lg font-medium mb-3 text-slate-900">Total Steps</div>
              <div className="text-2xl font-bold text-[#3f2ae2] mb-4">{currentSteps.length}</div>
              
              {isEstimateStep && (
                <>
                  <div className="text-lg font-medium mb-3 text-slate-900">Estimate</div>
                  <div className="text-xl font-bold text-slate-900 mb-4">
                    {currency(estimate.low)} - {currency(estimate.high)}
                  </div>
                </>
              )}
              
              <div className="text-sm text-slate-600">
                Progress: {state.step + 1} / {currentSteps.length}
                  </div>
                  </div>
                  </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 text-center">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                  >
                    ×
                  </button>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg"
                >
                  <Users className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Get Your Quote</h2>
                <p className="text-white/90 text-lg">
                  Estimated: {currency(estimate.low)} - {currency(estimate.high)}
                </p>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={state.contactInfo.name}
                        onChange={(e) => dispatch({ 
                          type: 'SET_CONTACT_FIELD', 
                          field: 'name', 
                          value: e.target.value 
                        })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={state.contactInfo.email}
                        onChange={(e) => dispatch({ 
                          type: 'SET_CONTACT_FIELD', 
                          field: 'email', 
                          value: e.target.value 
                        })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-300"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        Company
                      </label>
                      <input
                        type="text"
                        value={state.contactInfo.company}
                        onChange={(e) => dispatch({ 
                          type: 'SET_CONTACT_FIELD', 
                          field: 'company', 
                          value: e.target.value 
                        })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-300"
                        placeholder="Your Company Inc."
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Smartphone className="w-4 h-4 text-slate-500" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={state.contactInfo.phone}
                        onChange={(e) => dispatch({ 
                          type: 'SET_CONTACT_FIELD', 
                          field: 'phone', 
                          value: e.target.value 
                        })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-300"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <strong className="font-semibold">Your privacy matters.</strong> We'll only use this information to send you your quote and follow up if needed. We never share your data.
                    </div>
                  </div>

                  {submitMessage && (
                    <div className={`p-4 rounded-xl border ${
                      submitMessage.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {submitMessage.text}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitCalculator}
                      disabled={submitting || !state.contactInfo.name || !state.contactInfo.email}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Get My Quote'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Animated Background */}
            <div className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Success! 🎉</h2>
              <p className="text-white/90 text-sm">Your quote request has been submitted</p>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-slate-700">
                    <strong className="font-semibold text-blue-600">We've received your information!</strong>
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Our team will review your project details and send you a personalized quote at <strong>{state.contactInfo.email}</strong> within 24 hours.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Sparkles className="w-4 h-4" />
                  <span>Redirecting to home page...</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    window.location.href = '/'
                  }}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Go to Home Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      

    </div>
  )
}

// Helper functions
function getHeadlineForStep(stepType?: string) {
  const headlines: Record<string, string> = {
    'project-type': 'Select your project type:',
    'industries': 'Which industries does this serve?',
    'services': 'What type of service do you need?',
    'additional-services': 'Any additional services?',
    'platforms': 'Which platforms do you need?',
    'features': 'What core features do you need?',
    'auth': 'How should users authenticate?',
    'database': 'What database do you prefer?',
    'integrations': 'Any third-party integrations?',
    'tech-stack': 'What technology stack?',
    'design-system': 'Choose your design approach',
    'design-requirements': 'What are your design requirements?',
    'hosting': 'Where will you host this?',
    'scope': 'What\'s the project scope?',
    'team': 'What team size do you need?',
    'timeline': 'What\'s your timeline?',
    'budget': 'What\'s your budget range?',
    'support': 'What support do you need?',
    'contact': 'How can we reach you?',
    'estimate': 'Your project estimate'
  }
  return headlines[stepType || ''] || 'Project Calculator'
}

function StepBullet({ state }: { state: 'done' | 'active' | 'todo' }) {
  if (state === "done") {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white">
        <Check className="w-2.5 h-2.5" />
      </span>
    )
  }
  if (state === "active") {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#3f2ae2]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3f2ae2]" />
      </span>
    )
  }
  return <span className="inline-flex w-4 h-4 rounded-full border border-slate-300" />
}

interface OptionRowProps {
  selected: boolean
  onClick: () => void
  Icon: React.ComponentType<{ className?: string }>
  label: string
  description?: string
  multi?: boolean
  badge?: string
  compact?: boolean
}

function OptionRow({ selected, onClick, Icon, label, description, multi, badge, compact }: OptionRowProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full text-left rounded-2xl border transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
        selected
          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
      style={{
        padding: compact ? '10px 14px' : '16px 20px'
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icon container - exact 56px circular background like reference */}
        <span className={`inline-flex items-center justify-center rounded-full ${compact ? 'w-9 h-9' : 'w-12 h-12'} flex-shrink-0 transition-all duration-200 ${
          selected ? 'shadow-lg' : 'shadow-sm'
        }`} style={{
          background: selected ? 'linear-gradient(135deg, rgb(56, 39, 199), rgb(79, 70, 229))' : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
        }}>
          <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} transition-colors duration-200 ${
            selected ? 'text-white' : 'text-slate-600'
          }`} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm md:text-base'} ${selected ? 'text-blue-700' : 'text-slate-800'} leading-tight transition-colors duration-200`}>
              {label}
            </span>
            {badge && (
              <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-xs">
                {badge}
              </span>
            )}
          </div>
          {description && !compact && <p className="text-xs text-slate-600 mt-1 leading-tight hidden sm:block">{description}</p>}
        </div>

        {/* Check mark - exact 20px size from reference */}
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            selected ? 'bg-blue-600 shadow-md' : 'bg-transparent'
          }`}
        >
          <Check className={`w-4 h-4 transition-all duration-200 ${
            selected ? 'text-white scale-100' : 'text-transparent scale-75'
          }`} />
        </span>
      </div>
    </motion.button>
  )
}

function ProgressMobile({ step, total }: { step: number; total: number }) {
  return (
    <div className="md:hidden px-4 pb-3 mt-16">
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(total, 20) }).map((_, i) => {
          const state = i < step ? "done" : i === step ? "active" : "todo"
          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                state === "done" && "bg-emerald-500"
              } ${state === "active" && "bg-[#3f2ae2]"} ${state === "todo" && "bg-white/20"}`}
            />
          )
        })}
      </div>
      {total > 20 && (
        <div className="text-center text-xs text-white/60 mt-2">
          Showing first 20 of {total} steps
        </div>
      )}
    </div>
  )
}