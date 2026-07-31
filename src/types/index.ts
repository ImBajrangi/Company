export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  isExternal?: boolean;
}

export interface DeveloperGuideProps {
  isOpen: boolean;
  onClose: () => void;
}
