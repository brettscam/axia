import { Home, MapPin, Map, BarChart3, SlidersHorizontal, FileCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

interface SectionItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const sections: SectionItem[] = [
  { id: 'subject', label: 'Subject', icon: Home },
  { id: 'neighborhood', label: 'Neighborhood', icon: MapPin },
  { id: 'site', label: 'Site', icon: Map },
  { id: 'comparables', label: 'Comparables', icon: BarChart3 },
  { id: 'adjustments', label: 'Adjustments', icon: SlidersHorizontal },
  { id: 'reconciliation', label: 'Reconciliation', icon: FileCheck },
];

export function SectionNav({ activeSection, onSectionClick }: Props) {
  return (
    <nav className="flex flex-col gap-0.5">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionClick(section.id)}
            className={`flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'font-medium text-ink'
                : 'text-fog hover:bg-parchment'
            }`}
          >
            <Icon size={16} />
            <span>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
