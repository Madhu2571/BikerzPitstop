import { BikeBrand } from '@/types';

export const POPULAR_BIKE_BRANDS: BikeBrand[] = [
  {
    brand: "Royal Enfield",
    models: [
      "Himalayan 450",
      "Hunter 350",
      "Classic 350 (Reborn)",
      "Continental GT 650",
      "Interceptor 650",
      "Meteor 350",
      "Guerrilla 450",
      "Super Meteor 650",
      "Scram 411",
      "Bullet 350",
    ],
  },
  {
    brand: "KTM",
    models: [
      "390 Duke (Gen 3)",
      "250 Duke",
      "200 Duke",
      "RC 390",
      "RC 200",
      "390 Adventure",
      "250 Adventure",
    ],
  },
  {
    brand: "Yamaha",
    models: [
      "YZF R15 V4",
      "MT-15 V2",
      "Aerox 155",
      "FZ-S V4 / V3",
      "FZX 150",
      "R3",
    ],
  },
  {
    brand: "Triumph",
    models: [
      "Speed 400",
      "Scrambler 400X",
      "Daytona 660",
      "Street Triple 765",
    ],
  },
  {
    brand: "TVS",
    models: [
      "Apache RTR 310",
      "Apache RR 310",
      "Apache RTR 200 4V",
      "Apache RTR 160 4V",
      "Ronin 225",
    ],
  },
  {
    brand: "Honda",
    models: [
      "H'ness CB350",
      "CB350RS",
      "CB300R",
      "CB300F",
      "CB200X",
      "Hornet 2.0",
    ],
  },
  {
    brand: "BMW",
    models: [
      "G 310 GS",
      "G 310 R",
      "G 310 RR",
    ],
  },
  {
    brand: "Kawasaki",
    models: [
      "Ninja 300",
      "Ninja 400 / 500",
      "Ninja 650",
      "Z900",
      "Versys 650",
    ],
  },
  {
    brand: "Suzuki",
    models: [
      "V-Strom SX 250",
      "Gixxer SF 250",
      "Gixxer 250",
      "Gixxer 155",
    ],
  },
  {
    brand: "Bajaj",
    models: [
      "Dominar 400",
      "Dominar 250",
      "Pulsar NS400Z",
      "Pulsar NS200",
      "Pulsar RS200",
      "Pulsar N250",
    ],
  },
  {
    brand: "Harley-Davidson",
    models: [
      "X440",
    ],
  },
];

// Helper to get all models as flat list
export const ALL_BIKE_MODELS = POPULAR_BIKE_BRANDS.flatMap((b) => b.models);
