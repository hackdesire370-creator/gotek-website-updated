import { Project, ServiceFeature, StatItem } from "./types";
import mietLogo from "./assets/miet_logo.png";
import mechanicalGearLogo from "./assets/mechanical_gear_logo.png";
import mamcetLogo from "./assets/mamcet_logo.png";
import medicalCollegeLogo from "./assets/medical_college_logo.png";
import panimalarLogo from "./assets/panimalar_logo.png";
import periLogo from "./assets/peri_logo.png";
import dmiLogo from "./assets/dmi_logo.png";
import sbvLogo from "./assets/sbv_logo.png";
import mookambigaiLogo from "./assets/mookambigai_logo.png";
import polytechnicLogo from "./assets/polytechnic_logo.png";
import jayaLogo from "./assets/jaya_logo.png";
import dhanapalanLogo from "./assets/dhanapalan_logo.png";


export interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  sku: string;
  image: string;
  description: string;
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface ClientPartner {
  name: string;
  image: string;
}

export const PROJECT_DATA: Project[] = [
  {
    id: "01",
    title: "NEURAL CANVAS",
    category: "Interface Design",
    year: "2026",
    image: "/assets/project_neural.png",
    client: "Neural Systems Lab",
    tags: ["Creative Direction", "3D WebGL", "UI Simulation"],
    link: "#"
  },
  {
    id: "02",
    title: "VIRTUAL ARCHIVE",
    category: "Exhibition Space",
    year: "2025",
    image: "/assets/project_archive.png",
    client: "SOMA Arts Guild",
    tags: ["Spatial Curation", "Interactive Nodes", "Archival Engine"],
    link: "#"
  },
  {
    id: "03",
    title: "KINETIC TYPE",
    category: "Foundry System",
    year: "2026",
    image: "/assets/project_kinetic.png",
    client: "Foundry Global",
    tags: ["Dynamic Physics", "Web Typography", "Rotational Inertia"],
    link: "#"
  },
  {
    id: "04",
    title: "CHRONOS ENGINE",
    category: "SaaS Product",
    year: "2025",
    image: "/assets/project_chronos.png",
    client: "Chronos Dynamics",
    tags: ["Systems Engineering", "Data Mapping", "UI/UX Framework"],
    link: "#"
  }
];

export const SERVICE_DATA: ServiceFeature[] = [
  {
    id: "srv-1",
    number: "01",
    title: "Interactive Web Experiences",
    description: "High-integrity, Awwwards-standard animations and creative coding using WebGL, GSAP, and advanced physics-based motion transitions. Striking performance and visual rhythm integrated.",
    tags: ["React & Next.js", "WebGL / Three.js", "GSAP / Framer Motion", "Tailwind Design Architecture"]
  },
  {
    id: "srv-2",
    number: "02",
    title: "Premium Identity & Systems",
    description: "Translating digital-first concepts into concrete brand guidelines, bold typography scales, minimalist custom layouts, and modern functional design tokens tailored for leading startups.",
    tags: ["Typography Design", "Brand Guidelines", "Design Tokens", "Asset Generation System"]
  },
  {
    id: "srv-3",
    number: "03",
    title: "High-Fidelity Interface Systems",
    description: "Designing hyper-polished dashboard screens, physical simulation grids, responsive structural layouts, and interactive state interfaces centered around pristine human-centric experiences.",
    tags: ["Component Libraries", "Complex Dashboards", "State Flow Simulations", "Design Systems"]
  },
  {
    id: "srv-4",
    number: "04",
    title: "Technical Art & Custom Assets",
    description: "Crafting beautiful 3D web spaces, custom micro-interactions, custom interactive cursor events, and visual shaders that respond organically to physical user movements.",
    tags: ["3D Physics Rendering", "SVG Vector Engines", "Creative Prototyping", "Interactive Shaders"]
  }
];

export const STAT_DATA: StatItem[] = [
  {
    value: "25+",
    label: "YEARS EXP",
    subtext: "Industrial & software engineering reliability"
  },
  {
    value: "100%",
    label: "INTEGRITY RATE",
    subtext: "Rigorous product quality & zero layout drift"
  },
  {
    value: "50M+",
    label: "PRODUCTS RUN",
    subtext: "Delivered to enterprise hubs worldwide"
  }
];

export const PRODUCT_DATA: ProductItem[] = [
  // Manufacturing
  {
    id: "prod-1",
    title: "Premium RFID Proximity Card",
    category: "RFID Cards",
    price: 3.50,
    sku: "GT-RFID-0912",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    description: "125kHz passive proximity card with durable PVC casing and dual-layer security mesh."
  },
  {
    id: "prod-2",
    title: "Durable Polyester Silkscreen Lanyard",
    category: "Lanyards & Tags",
    price: 1.20,
    sku: "GT-LYD-3301",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
    description: "Double-reinforced weave lanyard with heavy-duty lobster claw attachment and break-away safety sleeve."
  },
  {
    id: "prod-3",
    title: "High-Definition Bio-PVC ID Card",
    category: "ID Cards",
    price: 2.50,
    sku: "GT-IDC-8841",
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80",
    description: "Biodegradable ultra-flat core card, optimized for sharp CMYK dye-sublimation printing."
  },
  {
    id: "prod-4",
    title: "Ultra-Premium Metal Core NFC Card",
    category: "NFC Cards",
    price: 15.00,
    sku: "GT-NFC-7721",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80",
    description: "Aircraft-grade brushed metal shell housing an NTAG213 core. Touch-sensitive, exquisite weight."
  },
  {
    id: "prod-5",
    title: "RFID Sealed Waterproof Keyfob",
    category: "Lanyards & Tags",
    price: 1.80,
    sku: "GT-FOB-0211",
    image: "https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&auto=format&fit=crop&q=80",
    description: "Hermetically sealed IP68 ABS key tracker for rugged outdoor environments and security hubs."
  },
  {
    id: "prod-6",
    title: "Laser-Engraved Dual-Chip NFC Wristband",
    category: "NFC Cards",
    price: 4.20,
    sku: "GT-WRI-1102",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    description: "Hypoallergenic silicone wristband with embedded high-frequency NFC chip for event gate checks."
  },
  // IT & Solutions
  {
    id: "prod-7",
    title: "SAC Platform - Custom Enterprise License",
    category: "Software",
    price: 299.00,
    sku: "GT-SAC-9900",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    description: "Monthly subscription package including all 6 interactive module suites with real-time analytics."
  },
  {
    id: "prod-8",
    title: "Gotek Unified ERP Core Gateway",
    category: "ERP",
    price: 1499.00,
    sku: "GT-ERP-5510",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    description: "Complete localized ERP node containing materials flow, stock verification, and asset tracking APIs."
  },
  {
    id: "prod-9",
    title: "Cloud Lanyard Design Tool SDK",
    category: "Design Tools",
    price: 49.00,
    sku: "GT-DSN-1204",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    description: "Embeddable interactive graphics editor engine supporting precision SVG pattern overlay rendering."
  },
  {
    id: "prod-10",
    title: "Gotek E-Commerce Card Configurator Link",
    category: "E-Commerce",
    price: 799.00,
    sku: "GT-ECO-4402",
    image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600&auto=format&fit=crop&q=80",
    description: "Server-side checkout integration resolving high-integrity bulk pricing discounts on cards dynamically."
  }
];

export const CAREER_JOBS: JobRole[] = [
  // Manufacturing
  {
    id: "job-m1",
    title: "ID & RFID Assembly Division Lead",
    department: "Manufacturing Division",
    location: "Corporate Office cum Factory, India",
    type: "Full-Time"
  },
  {
    id: "job-m2",
    title: "Precision CNC Router Operator",
    department: "Production Core",
    location: "Factory Div, India",
    type: "Full-Time"
  },
  {
    id: "job-m3",
    title: "Quality Control & Antenna Lead (RFID/NFC)",
    department: "Quality Assurance",
    location: "Corporate Office cum Factory, India",
    type: "Full-Time"
  },
  // IT & Engineering
  {
    id: "job-it1",
    title: "Senior React & Canva Simulation Engineer",
    department: "IT Solutions Division",
    location: "Remote / Tech Hub",
    type: "Full-Time"
  },
  {
    id: "job-it2",
    title: "Gotek Unified ERP Solutions Architect",
    department: "Enterprise Software Dept",
    location: "Remote / Hybrid",
    type: "Full-Time"
  },
  {
    id: "job-it3",
    title: "Orbit Core (SAC) Product Manager",
    department: "IT Solutions Division",
    location: "Tech Hub, India",
    type: "Full-Time"
  }
];

export const CLIENT_PARTNERS: ClientPartner[] = [
  { name: "MIET Institutions", image: mietLogo },
  { name: "Mechanical Engineering College logo", image: mechanicalGearLogo },
  { name: "MAMCET", image: mamcetLogo },
  { name: "Medical College & Research Institute logo", image: medicalCollegeLogo },
  { name: "Panimalar College of Engineering & Technology", image: panimalarLogo },
  { name: "PERI", image: periLogo },
  { name: "DMI", image: dmiLogo },
  { name: "SBV", image: sbvLogo },
  { name: "Mookambigai College", image: mookambigaiLogo },
  { name: "Polytechnic College logo (yellow gear logo)", image: polytechnicLogo },
  { name: "JAYA College of Arts & Science", image: jayaLogo },
  { name: "Prof. Dhanapalan College of Arts & Science", image: dhanapalanLogo }
];
