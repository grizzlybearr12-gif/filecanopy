import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return { imageUrl: "https://picsum.photos/seed/error/200/200", imageHint: "placeholder" };
  }
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
}

export interface Menu {
  category: string;
  items: MenuItem[];
}

export interface Caterer {
  id: string;
  name:string;
  logo: { imageUrl: string; imageHint: string };
  phone: string;
  serviceArea: string;
  rating: number;
  reviewsCount: number;
  description: string;
  gallery: { imageUrl: string; imageHint: string }[];
  menus: Menu[];
  reviews: Review[];
}

export const caterers: Caterer[] = [
  {
    id: 'gourmet-delights',
    name: 'Gourmet Delights',
    logo: findImage('logo1'),
    phone: '555-0101',
    serviceArea: 'Metropolis, Gotham City',
    rating: 4.8,
    reviewsCount: 124,
    description: 'Gourmet Delights offers a premium catering experience with a focus on French and Italian cuisine. Our award-winning chefs use only the freshest locally-sourced ingredients to create unforgettable culinary masterpieces for weddings, corporate events, and private parties.',
    gallery: [findImage('gallery1-1'), findImage('gallery1-2'), findImage('gallery1-3')],
    menus: [
      {
        category: 'Appetizers',
        items: [
          { name: 'Bruschetta al Pomodoro', description: 'Grilled bread with tomatoes, garlic, and basil.' },
          { name: 'Escargots de Bourgogne', description: 'Snails baked in garlic-parsley butter.' },
        ],
      },
      {
        category: 'Main Courses',
        items: [
          { name: 'Filet Mignon', description: 'Served with a red wine reduction sauce, potato gratin, and asparagus.' },
          { name: 'Lobster Thermidor', description: 'A creamy mixture of cooked lobster meat, egg yolks, and brandy.' },
        ],
      },
    ],
    reviews: [
      { id: 1, author: 'Alice Johnson', rating: 5, comment: 'Absolutely amazing! The food was the highlight of our wedding. The Italian dishes were particularly authentic.', date: '2023-10-15' },
      { id: 2, author: 'Bob Williams', rating: 4, comment: 'Great service and beautiful presentation. Some dishes were a bit too rich for my taste.', date: '2023-09-20' },
    ],
  },
  {
    id: 'feast-creators',
    name: 'Feast Creators',
    logo: findImage('logo2'),
    phone: '555-0102',
    serviceArea: 'Star City, Central City',
    rating: 4.5,
    reviewsCount: 88,
    description: 'From casual backyard BBQs to elegant buffets, Feast Creators brings the party to you. We specialize in American comfort food and fusion cuisine, always with a creative twist. Our goal is to make your event delicious and stress-free.',
    gallery: [findImage('gallery2-1'), findImage('gallery2-2'), findImage('gallery2-3')],
    menus: [
      {
        category: 'BBQ Packages',
        items: [
          { name: 'Classic BBQ', description: 'Pulled pork, brisket, ribs, and three sides.' },
          { name: 'Vegetarian BBQ', description: 'Grilled veggie skewers, black bean burgers, and vegan sides.' },
        ],
      },
      {
        category: 'Fusion Tacos',
        items: [
          { name: 'Korean Beef Tacos', description: 'With kimchi slaw and gochujang aioli.' },
          { name: 'Baja Fish Tacos', description: 'Crispy cod with cabbage and chipotle cream.' },
        ],
      },
    ],
    reviews: [
      { id: 1, author: 'Charlie Brown', rating: 5, comment: 'The Korean beef tacos were a massive hit at our company picnic! Highly recommend.', date: '2023-11-02' },
      { id: 2, author: 'Diana Prince', rating: 4, comment: 'Good food and friendly staff. The setup took a little longer than expected, but everything worked out.', date: '2023-08-12' },
    ],
  },
  {
    id: 'simply-served',
    name: 'Simply Served',
    logo: findImage('logo3'),
    phone: '555-0103',
    serviceArea: 'All boroughs',
    rating: 4.9,
    reviewsCount: 212,
    description: 'Simply Served provides elegant, minimalist, and healthy catering options. We focus on modern, farm-to-table menus with plenty of vegetarian, vegan, and gluten-free choices. Perfect for health-conscious gatherings and corporate wellness events.',
    gallery: [findImage('gallery3-1'), findImage('gallery3-2'), findImage('gallery3-3')],
    menus: [
      {
        category: 'Salad Bowls',
        items: [
          { name: 'Quinoa & Roasted Veggie Bowl', description: 'With a lemon-tahini dressing.' },
          { name: 'Grilled Chicken Caesar', description: 'A classic salad made with fresh, organic ingredients.' },
        ],
      },
      {
        category: 'Main Plates',
        items: [
          { name: 'Pan-Seared Salmon', description: 'Served with wild rice and steamed green beans.' },
          { name: 'Stuffed Bell Peppers', description: 'Vegan and gluten-free, filled with lentils and vegetables.' },
        ],
      },
    ],
    reviews: [
      { id: 1, author: 'Eve Adams', rating: 5, comment: 'So refreshing to have healthy and delicious options! Everyone loved the food at our yoga retreat.', date: '2023-12-01' },
      { id: 2, author: 'Frank Miller', rating: 5, comment: 'Impeccable service and the food was art on a plate. The salmon was cooked perfectly.', date: '2023-11-18' },
    ],
  },
];
