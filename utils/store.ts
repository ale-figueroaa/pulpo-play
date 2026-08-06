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
];

export const STORE_ITEMS_DATA: StoreItem[] = [
  { id: 'basic', name: 'Basic Octavio', price: '0', image: require('../assets/images/OctavioBasic.png') },
  { id: 'fit', name: 'Fit Octavio', price: '1000', image: require('../assets/images/OcatvioFit.png') },
  { id: 'paint', name: 'Painter Octavio', price: '1000', image: require('../assets/images/OcatvioPaint.png') },
  { id: 'funny', name: 'Funny Octavio', price: '1000', image: require('../assets/images/OctavioFunny.png') },
  { id: 'intelectual', name: 'Intellectual Octavio', price: '1500', image: require('../assets/images/OctavioIntelectual.png') },
  { id: 'music', name: 'Musician Octavio', price: '1500', image: require('../assets/images/OctavioMusic.png') },
  { id: 'travel', name: 'Traveler Octavio', price: '1500', image: require('../assets/images/OctavioTravel.png') },
];

export const MOBILE_BREAKPOINT = 768; 