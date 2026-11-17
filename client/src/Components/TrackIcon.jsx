import React from "react";
import {
  BadgeCheck,
  BarChart3,
  Bot,
  Briefcase,
  Bug,
  ClipboardList,
  Cloud,
  Code,
  Database,
  GitBranch,
  Globe,
  Hammer,
  Headphones,
  Laptop,
  Layers,
  Layout,
  Megaphone,
  Network,
  Palette,
  PenTool,
  Rocket,
  Server,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";

const icons = {
  BadgeCheck,
  BarChart3,
  Bot,
  Briefcase,
  Bug,
  ClipboardList,
  Cloud,
  Code,
  Database,
  GitBranch,
  Globe,
  Hammer,
  Headphones,
  Laptop,
  Layers,
  Layout,
  Megaphone,
  Network,
  Palette,
  PenTool,
  Rocket,
  Server,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Video,
};

// Renders a lucide icon from the string name used in data/tracks.js and data/site.js
const TrackIcon = ({ name, size = 22, className = "" }) => {
  const Icon = icons[name] || Code;
  return <Icon size={size} className={className} />;
};

export default TrackIcon;
