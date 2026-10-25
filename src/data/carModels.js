// Car segment data matching exact customer car models (Alto, City, Thar, Innova, Mercedes)
export const CAR_TYPE_INFO = {
  hatchback: {
    id: 'hatchback',
    label: 'Small Hatchback',
    subtitle: 'Maruti Alto, WagonR, i10, Swift',
    iconType: 'hatchback',
    image: '/assets/car-alto.jpg'
  },
  sedan: {
    id: 'sedan',
    label: 'Sedan',
    subtitle: 'Honda City, Dzire, Verna, Virtus',
    iconType: 'sedan',
    image: '/assets/car-city.jpg'
  },
  suv: {
    id: 'suv',
    label: 'SUV / Compact SUV',
    subtitle: 'Mahindra Thar, Creta, Seltos, Brezza',
    iconType: 'suv',
    image: '/assets/car-thar.jpg'
  },
  sevenSeater: {
    id: 'sevenSeater',
    label: '7 Seater / MUV',
    subtitle: 'Toyota Innova, Ertiga, Scorpio, XUV700',
    iconType: 'suv',
    image: '/assets/car-innova.jpg'
  },
  luxury: {
    id: 'luxury',
    label: 'Luxury',
    subtitle: 'Mercedes-Benz, BMW, Audi',
    iconType: 'luxury',
    image: '/assets/car-luxury.jpg'
  }
};
