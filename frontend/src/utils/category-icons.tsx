import {
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  PawPrint,
  House,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

/**
 * Available icon names that can be saved in the backend
 */
export type IconName =
  | "shopping-cart"
  | "utensils"
  | "house"
  | "car-front"
  | "heart-pulse"
  | "briefcase-business"
  | "book-open"
  | "baggage-claim"
  | "dumbbell"
  | "ticket"
  | "tool-case"
  | "paw-print"
  | "mailbox"
  | "receipt-text"
  | "piggy-bank"
  | "gift";

/**
 * Icon configuration
 * Maps icon names to Lucide React components
 */
export const iconConfig: Record<
  IconName,
  {
    component: LucideIcon;
    label: string;
  }
> = {
  "briefcase-business": {
    component: BriefcaseBusiness,
    label: "Trabalho / Negócios",
  },
  "car-front": {
    component: CarFront,
    label: "Transporte",
  },
  "heart-pulse": {
    component: HeartPulse,
    label: "Saúde / Bem-estar",
  },
  "piggy-bank": {
    component: PiggyBank,
    label: "Poupança / Investimento",
  },
  "shopping-cart": {
    component: ShoppingCart,
    label: "Compras",
  },
  ticket: {
    component: Ticket,
    label: "Entretenimento",
  },
  "tool-case": {
    component: ToolCase,
    label: "Ferramentas / Manutenção",
  },
  utensils: {
    component: Utensils,
    label: "Alimentação",
  },
  "paw-print": {
    component: PawPrint,
    label: "Pets / Animais",
  },
  house: {
    component: House,
    label: "Casa / Moradia",
  },
  gift: {
    component: Gift,
    label: "Presentes",
  },
  dumbbell: {
    component: Dumbbell,
    label: "Esportes / Academia",
  },
  "book-open": {
    component: BookOpen,
    label: "Educação",
  },
  "baggage-claim": {
    component: BaggageClaim,
    label: "Viagens",
  },
  mailbox: {
    component: Mailbox,
    label: "Correspondência",
  },
  "receipt-text": {
    component: ReceiptText,
    label: "Contas / Faturas",
  },
};

/**
 * Get icon component from icon name
 * @param iconName - Icon name from backend (e.g., "shopping-cart")
 * @returns Lucide icon component
 */
export function getIconComponent(iconName: string): LucideIcon {
  const normalizedIcon = iconName.toLowerCase() as IconName;

  if (normalizedIcon in iconConfig) {
    return iconConfig[normalizedIcon].component;
  }

  return ShoppingCart;
}

/**
 * Get icon label in Portuguese
 * @param iconName - Icon name from backend
 * @returns Label in Portuguese
 */
export function getIconLabel(iconName: string): string {
  const normalizedIcon = iconName.toLowerCase() as IconName;

  if (normalizedIcon in iconConfig) {
    return iconConfig[normalizedIcon].label;
  }

  return "Ícone";
}

/**
 * Check if an icon name is valid
 * @param iconName - Icon name to validate
 * @returns true if icon is valid
 */
export function isValidIcon(iconName: string): iconName is IconName {
  return iconName.toLowerCase() in iconConfig;
}

/**
 * Get all available icon names
 * Useful for icon pickers or select inputs
 * @returns Array of icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(iconConfig) as IconName[];
}

/**
 * Get icon options for display in UI
 * Useful for icon pickers with preview
 * @returns Array of icon objects with name, label and component
 */
export function getIconOptions(): Array<{
  name: IconName;
  label: string;
  component: LucideIcon;
}> {
  return Object.entries(iconConfig).map(([name, config]) => ({
    name: name as IconName,
    label: config.label,
    component: config.component,
  }));
}
