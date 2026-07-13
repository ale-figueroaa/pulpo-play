// store.ts

export interface NavItem {
  key: string;
  label: string;
  icon: any;
}

export interface StoreItem {
  id: string;
  name: string;
  price: string;
  image: any;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'worlds', label: 'Worlds', icon: require('../assets/images/Worlds.png') },
  { key: 'streak', label: 'Streak', icon: require('../assets/images/Streak.png') },
  { key: 'store', label: 'Store', icon: require('../assets/images/Store.png') },
  { key: 'profile', label: 'Profile', icon: require('../assets/images/CoralReef.png') },
];

export const STORE_ITEMS_DATA: StoreItem[] = [
  { id: '2', name: 'Item 2', price: '100', image: require('../assets/images/octavioExplorador.png') },
  { id: '3', name: 'Item 3', price: '100', image: require('../assets/images/octavioMarino.png') },
  { id: '4', name: 'Item 4', price: '100', image: require('../assets/images/octavioPintor.png') },
  { id: '5', name: 'Item 5', price: '150', image: require('../assets/images/octavioSmart.png') },
  { id: '6', name: 'Item 6', price: '150', image: require('../assets/images/octavioSubmarino.png') },
  { id: '7', name: 'Item 7', price: '150', image: require('../assets/images/octavioTeatime.png') },
];

export const MOBILE_BREAKPOINT = 768; 