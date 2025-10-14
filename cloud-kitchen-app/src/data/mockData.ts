export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'main-courses', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Bruschetta',
    description: 'Grilled bread topped with tomatoes, garlic, basil, and olive oil.',
    price: 8.99,
    image: 'https://picsum.photos/seed/picsum/400/300',
    category: 'appetizers',
  },
  {
    id: 2,
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and sweet basil with a balsamic glaze.',
    price: 10.99,
    image: 'https://picsum.photos/seed/food/400/300',
    category: 'appetizers',
  },
  {
    id: 3,
    name: 'Spaghetti Carbonara',
    description: 'Pasta with eggs, cheese, pancetta, and black pepper.',
    price: 15.99,
    image: 'https://picsum.photos/seed/yum/400/300',
    category: 'main-courses',
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomatoes, mozzarella, and fresh basil.',
    price: 14.99,
    image: 'https://picsum.photos/seed/pizza/400/300',
    category: 'main-courses',
  },
  {
    id: 5,
    name: 'Tiramisu',
    description: 'Coffee-flavoured Italian dessert.',
    price: 7.99,
    image: 'https://picsum.photos/seed/dessert/400/300',
    category: 'desserts',
  },
  {
    id: 6,
    name: 'Panna Cotta',
    description: 'Italian dessert of sweetened cream thickened with gelatin.',
    price: 6.99,
    image: 'https://picsum.photos/seed/sweet/400/300',
    category: 'desserts',
  },
  {
    id: 7,
    name: 'Mineral Water',
    description: 'Still or sparkling.',
    price: 2.99,
    image: 'https://picsum.photos/seed/water/400/300',
    category: 'beverages',
  },
  {
    id: 8,
    name: 'Soft Drink',
    description: 'Coke, Pepsi, or Sprite.',
    price: 3.99,
    image: 'https://picsum.photos/seed/soda/400/300',
    category: 'beverages',
  },
];
