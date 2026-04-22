import React from 'react';
import { 
  // Navigation & Actions
  Home, 
  Book, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Target,
  Sparkles,
  
  // Status & Feedback
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Trophy, 
  Award, 
  Star, 
  Heart, 
  Zap, 
  Shield,
  ThumbsUp,
  ThumbsDown,
  
  // Content & Media
  Image, 
  Video, 
  Music, 
  Download, 
  Upload, 
  Share2, 
  Copy, 
  Trash2, 
  Edit3, 
  Save,
  Eye,
  EyeOff,
  
  // UI Elements
  Search, 
  Filter, 
  Bell, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  Unlock,
  Key,
  
  // Learning & Education
  GraduationCap,
  BookOpen,
  Lightbulb,
  Brain,
  Puzzle,
  Gamepad2,
  
  // Data & Analytics
  PieChart,
  LineChart,
  Activity,
  Database,
  Server,
  Cloud,
  
  // Misc
  MoreHorizontal,
  MoreVertical,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

// Tamaños de iconos estandarizados
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  huge: 48
};

// Colores de iconos basados en el tema
const ICON_COLORS = {
  primary: 'var(--accent)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  white: '#ffffff',
  current: 'currentColor'
};

// Componente Icon principal
const Icon = ({ 
  name, 
  size = 'md', 
  color = 'current', 
  className = '', 
  strokeWidth = 2,
  ...props 
}) => {
  // Mapeo de nombres de iconos a componentes
  const iconMap = {
    // Navigation
    home: Home,
    book: Book,
    fileText: FileText,
    barChart: BarChart3,
    stats: BarChart3,
    settings: Settings,
    logout: LogOut,
    menu: Menu,
    close: X,
    chevronRight: ChevronRight,
    chevronLeft: ChevronLeft,
    arrowRight: ArrowRight,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    trendingUp: TrendingUp,
    target: Target,
    sparkles: Sparkles,
    
    // Status
    check: CheckCircle,
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    trophy: Trophy,
    award: Award,
    star: Star,
    heart: Heart,
    zap: Zap,
    shield: Shield,
    thumbsUp: ThumbsUp,
    thumbsDown: ThumbsDown,
    
    // Content
    image: Image,
    video: Video,
    music: Music,
    download: Download,
    upload: Upload,
    share: Share2,
    copy: Copy,
    delete: Trash2,
    edit: Edit3,
    save: Save,
    eye: Eye,
    eyeOff: EyeOff,
    
    // UI
    search: Search,
    filter: Filter,
    bell: Bell,
    user: User,
    users: Users,
    calendar: Calendar,
    clock: Clock,
    location: MapPin,
    mail: Mail,
    phone: Phone,
    globe: Globe,
    lock: Lock,
    unlock: Unlock,
    key: Key,
    
    // Education
    graduation: GraduationCap,
    bookOpen: BookOpen,
    lightbulb: Lightbulb,
    brain: Brain,
    puzzle: Puzzle,
    gamepad: Gamepad2,
    
    // Analytics
    pieChart: PieChart,
    lineChart: LineChart,
    activity: Activity,
    database: Database,
    server: Server,
    cloud: Cloud,
    
    // Misc
    moreHorizontal: MoreHorizontal,
    moreVertical: MoreVertical,
    help: HelpCircle,
    externalLink: ExternalLink,
    refresh: RefreshCw,
    rotate: RotateCcw,
    play: Play,
    pause: Pause,
    stop: StopCircle
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return <div className={`icon-placeholder ${className}`}>?</div>;
  }

  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size] || ICON_SIZES.md;
  const iconColor = ICON_COLORS[color] || color;

  return (
    <IconComponent
      size={iconSize}
      color={iconColor}
      strokeWidth={strokeWidth}
      className={`icon icon-${name} ${className}`}
      {...props}
    />
  );
};

// Iconos específicos para Study Helper con configuraciones predefinidas
export const StudyIcons = {
  // Navegación principal
  nav: {
    quiz: (props) => <Icon name="sparkles" size="md" {...props} />,
    guide: (props) => <Icon name="bookOpen" size="md" {...props} />,
    study: (props) => <Icon name="fileText" size="md" {...props} />,
    stats: (props) => <Icon name="barChart" size="md" {...props} />,
    settings: (props) => <Icon name="settings" size="md" {...props} />
  },
  
  // Estados y feedback
  status: {
    success: (props) => <Icon name="success" size="lg" color="success" {...props} />,
    error: (props) => <Icon name="error" size="lg" color="error" {...props} />,
    warning: (props) => <Icon name="warning" size="lg" color="warning" {...props} />,
    info: (props) => <Icon name="info" size="lg" color="info" {...props} />,
    loading: (props) => <Icon name="refresh" size="md" className="animate-spin" {...props} />
  },
  
  // Acciones
  actions: {
    start: (props) => <Icon name="play" size="md" color="primary" {...props} />,
    save: (props) => <Icon name="save" size="md" color="success" {...props} />,
    edit: (props) => <Icon name="edit" size="md" color="info" {...props} />,
    delete: (props) => <Icon name="delete" size="md" color="error" {...props} />,
    share: (props) => <Icon name="share" size="md" color="secondary" {...props} />,
    download: (props) => <Icon name="download" size="md" color="primary" {...props} />
  },
  
  // Logros y recompensas
  achievements: {
    trophy: (props) => <Icon name="trophy" size="xl" color="warning" {...props} />,
    award: (props) => <Icon name="award" size="lg" color="primary" {...props} />,
    star: (props) => <Icon name="star" size="md" color="warning" {...props} />,
    streak: (props) => <Icon name="zap" size="md" color="warning" {...props} />,
    points: (props) => <Icon name="target" size="md" color="primary" {...props} />
  },
  
  // Educativos
  education: {
    study: (props) => <Icon name="graduation" size="lg" color="primary" {...props} />,
    learning: (props) => <Icon name="brain" size="md" color="info" {...props} />,
    idea: (props) => <Icon name="lightbulb" size="md" color="warning" {...props} />,
    concept: (props) => <Icon name="puzzle" size="md" color="secondary" {...props} />
  },
  
  // UI común
  ui: {
    close: (props) => <Icon name="close" size="md" {...props} />,
    menu: (props) => <Icon name="menu" size="md" {...props} />,
    search: (props) => <Icon name="search" size="md" {...props} />,
    filter: (props) => <Icon name="filter" size="md" {...props} />,
    user: (props) => <Icon name="user" size="md" {...props} />,
    help: (props) => <Icon name="help" size="md" color="secondary" {...props} />
  }
};

// Hook para obtener iconos fácilmente
export const useIcon = () => {
  return {
    Icon,
    StudyIcons,
    sizes: ICON_SIZES,
    colors: ICON_COLORS
  };
};

export default Icon;
