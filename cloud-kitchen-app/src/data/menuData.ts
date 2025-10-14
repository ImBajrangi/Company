
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'A juicy beef patty with lettuce, tomato, onion, and pickles.',
    price: 12.99,
    imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Burger',
  },
  {
    id: '2',
    name: 'Spicy Chicken Sandwich',
    description: 'Crispy fried chicken with a spicy mayo and coleslaw.',
    price: 11.50,
    imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Chicken',
  },
  {
    id: '3',
    name: 'Veggie Pizza',
    description: 'Fresh vegetables, mozzarella, and a tangy tomato sauce on a thin crust.',
    price: 15.00,
    imageUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Pizza',
  },
  {
    id: '4',
    name: 'French Fries',
    description: 'Golden, crispy, and perfectly salted.',
    price: 4.00,
    imageUrl: 'https://via.placeholder.com/150/FFFF33/000000?text=Fries',
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate cake with a molten center, served with vanilla ice cream.',
    price: 7.50,
    imageUrl: 'https://via.placeholder.com/150/FF33FF/FFFFFF?text=Dessert',
  },
];
