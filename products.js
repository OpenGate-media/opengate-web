// Catálogo de og.prdct
// Fotos reales: pon la foto en /img/ y escribe su ruta en "img" (ej. "/img/khamrah.webp").
// Giro 360 real: pon 12-24 fotos alrededor del frasco en "frames" (en orden) y la tarjeta las recorre con el cursor.
// Sin foto, se muestra el frasco 3D de muestra con los colores c1/c2.
// Número de WhatsApp para pedidos (con indicativo, sin +). Vacío = se usa Instagram.
const WHATSAPP = '';
const IG = 'og.prdct';
// Tienda Shopify (checkout con Mercado Pago). "vid" = id de la variante en Shopify.
const SHOP = 'w9akid-2m.myshopify.com';
// Cupones válidos (también deben existir en Shopify → Descuentos con el mismo código)
const COUPONS = { DULCE: 0.99 };
const P = [
 {
  "n": "9 PM Rebel",
  "vid": 67842845213037,
  "b": "Afnan",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 255.555",
  "fam": "Frutal amaderado",
  "top": [
   "Piña",
   "manzana verde",
   "mandarina"
  ],
  "heart": [
   "Musgo de roble",
   "cedro",
   "vainilla"
  ],
  "base": [
   "Maderas secas",
   "ámbar gris",
   "caramelo",
   "almizcle"
  ],
  "cat": "Árabe",
  "c1": "#3b3f46",
  "c2": "#0c0d10",
  "img": "",
  "frames": [],
  "pn": 255555
 },
 {
  "n": "Liquid Brun",
  "vid": 67842845245805,
  "b": "French Avenue",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 255.555",
  "fam": "Oriental especiado",
  "top": [
   "Bergamota",
   "canela",
   "cardamomo",
   "azahar"
  ],
  "heart": [
   "Vainilla bourbon",
   "elemí"
  ],
  "base": [
   "Almizcle",
   "praliné",
   "ambroxan",
   "guayaco"
  ],
  "cat": "Árabe",
  "c1": "#6b4a2e",
  "c2": "#1a100a",
  "img": "",
  "frames": [],
  "pn": 255555
 },
 {
  "n": "Atlas",
  "vid": 67842845278573,
  "b": "Lattafa",
  "c": "EDP",
  "ml": 55,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 166.666",
  "fam": "Acuático amaderado",
  "top": [
   "Sal",
   "notas marinas",
   "limón"
  ],
  "heart": [
   "Iris",
   "davana"
  ],
  "base": [
   "Ámbar gris",
   "sándalo",
   "musgo de roble"
  ],
  "cat": "Árabe",
  "c1": "#5d6f78",
  "c2": "#151b1f",
  "img": "",
  "frames": [],
  "pn": 166666
 },
 {
  "n": "Khamrah",
  "vid": 67842845311341,
  "b": "Lattafa",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 177.777",
  "fam": "Oriental dulce especiado",
  "top": [
   "Canela",
   "nuez moscada",
   "bergamota"
  ],
  "heart": [
   "Dátiles",
   "praliné",
   "nardo"
  ],
  "base": [
   "Vainilla",
   "haba tonka",
   "ámbar",
   "mirra"
  ],
  "cat": "Árabe",
  "c1": "#7a4e2c",
  "c2": "#20120a",
  "img": "",
  "frames": [],
  "pn": 177777
 },
 {
  "n": "Hawas Ice",
  "vid": 67842845376877,
  "b": "Rasasi",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 211.111",
  "fam": "Fresco frutal",
  "top": [
   "Manzana helada",
   "bergamota",
   "limón",
   "anís estrellado"
  ],
  "heart": [
   "Azahar",
   "ciruela",
   "cardamomo"
  ],
  "base": [
   "Musgo",
   "madera flotante",
   "ámbar",
   "almizcle"
  ],
  "cat": "Árabe",
  "c1": "#8fa9b5",
  "c2": "#26343b",
  "img": "",
  "frames": [],
  "pn": 211111
 },
 {
  "n": "Cedrus Blanc",
  "vid": 67842848260461,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 344.444",
  "fam": "Amaderado cítrico",
  "top": [
   "Bergamota",
   "aldehídos"
  ],
  "heart": [
   "Azahar"
  ],
  "base": [
   "Cedro",
   "almizcle blanco"
  ],
  "cat": "Árabe",
  "c1": "#d9d4c9",
  "c2": "#77736b",
  "img": "",
  "frames": [],
  "pn": 344444
 },
 {
  "n": "Nocturno Elixir",
  "vid": 67842848751981,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 188.888",
  "fam": "Amaderado aromático",
  "top": [
   "Limón",
   "pomelo",
   "menta"
  ],
  "heart": [
   "Jengibre",
   "nuez moscada"
  ],
  "base": [
   "Sándalo",
   "cedro"
  ],
  "cat": "Árabe",
  "c1": "#2c2f3a",
  "c2": "#08090d",
  "img": "",
  "frames": [],
  "pn": 188888
 },
 {
  "n": "Terra",
  "vid": 67842848817517,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 211.111",
  "fam": "Oriental amaderado",
  "top": [
   "Cardamomo",
   "elemí",
   "limón",
   "pimienta de Sichuan",
   "bergamota"
  ],
  "heart": [
   "Pachulí",
   "azafrán",
   "rosa",
   "geranio"
  ],
  "base": [
   "Incienso",
   "ámbar",
   "vainilla",
   "oud",
   "almizcle"
  ],
  "cat": "Árabe",
  "c1": "#6e5a44",
  "c2": "#1d160f",
  "img": "",
  "frames": [],
  "pn": 211111
 },
 {
  "n": "Wolf",
  "vid": 67842849309037,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 211.111",
  "fam": "Amaderado oriental",
  "top": [
   "Jengibre"
  ],
  "heart": [
   "Maderas"
  ],
  "base": [
   "Vainilla bourbon"
  ],
  "cat": "Árabe",
  "c1": "#4a4d52",
  "c2": "#111214",
  "img": "",
  "frames": [],
  "pn": 211111
 },
 {
  "n": "Black XS",
  "vid": 67842849538413,
  "b": "Paco Rabanne",
  "c": "EDT",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 255.555",
  "fam": "Oriental especiado",
  "top": [
   "Limón de Calabria",
   "calamansi"
  ],
  "heart": [
   "Canela",
   "praliné"
  ],
  "base": [
   "Ámbar negro",
   "pachulí"
  ],
  "cat": "Diseñador",
  "c1": "#2a2a2a",
  "c2": "#050505",
  "img": "",
  "frames": [],
  "pn": 255555
 },
 {
  "n": "Pacific Aura",
  "vid": 67852551225709,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 188.888",
  "pn": 188888,
  "fam": "Cítrico aromático",
  "top": [
   "Cidra",
   "mandarina",
   "menta",
   "bergamota",
   "grosella negra",
   "cilantro"
  ],
  "heart": [
   "Albahaca",
   "rosa",
   "semilla de zanahoria"
  ],
  "base": [
   "Ámbar",
   "higo",
   "ambroxan"
  ],
  "cat": "Árabe",
  "c1": "#6f97a8",
  "c2": "#14242c",
  "img": "",
  "frames": []
 },
 {
  "n": "Kiss",
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "ella",
  "gen": "Mujer",
  "p": "$ 211.111",
  "pn": 211111,
  "fam": "Aromático gourmand",
  "top": [
   "Menta",
   "bergamota"
  ],
  "heart": [
   "Lavanda",
   "benjuí"
  ],
  "base": [
   "Vainilla",
   "haba tonka"
  ],
  "cat": "Árabe",
  "c1": "#a3445a",
  "c2": "#2a0d14",
  "vid": 67854425489773,
  "img": "",
  "frames": []
 },
 {
  "n": "Imperia",
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 211.111",
  "pn": 211111,
  "fam": "Oriental floral",
  "top": [
   "Bergamota",
   "orquídea negra",
   "buchu",
   "lino",
   "macarons"
  ],
  "heart": [
   "Ámbar",
   "cedro",
   "láudano",
   "petitgrain"
  ],
  "base": [
   "Ámbar",
   "cuero",
   "almizcle",
   "whisky"
  ],
  "cat": "Árabe",
  "c1": "#b08d4c",
  "c2": "#2b200c",
  "vid": 67854425751917,
  "img": "",
  "frames": []
 },
 {
  "n": "Dreamscape",
  "b": "Mykonos",
  "c": "Extrait",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 277.777",
  "pn": 277777,
  "fam": "Frutal tropical especiado",
  "top": [
   "Mango",
   "jengibre",
   "ámbar"
  ],
  "heart": [],
  "base": [],
  "cat": "Árabe",
  "c1": "#d98b3a",
  "c2": "#3a1e08",
  "vid": 67854426505581,
  "img": "",
  "frames": []
 },
 {
  "n": "Reflection",
  "b": "Mykonos",
  "c": "Extrait",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 277.777",
  "pn": 277777,
  "fam": "Cítrico fresco",
  "top": [
   "Pomelo",
   "jengibre",
   "pachulí"
  ],
  "heart": [],
  "base": [],
  "cat": "Árabe",
  "c1": "#9fb8c8",
  "c2": "#1f2c35",
  "vid": 67854427423085,
  "img": "",
  "frames": []
 },
 {
  "n": "Inception",
  "b": "Mykonos",
  "c": "Extrait",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 277.777",
  "pn": 277777,
  "fam": "Cítrico fresco amaderado",
  "top": [
   "Bergamota",
   "jengibre",
   "notas ambaradas"
  ],
  "heart": [],
  "base": [],
  "cat": "Árabe",
  "c1": "#c9c2b0",
  "c2": "#3b372d",
  "vid": 67854428143981,
  "img": "",
  "frames": []
 },
 {
  "n": "Obsidian",
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 166.666",
  "pn": 166666,
  "fam": "Amaderado especiado ámbar",
  "top": [
   "Cítricos",
   "iris"
  ],
  "heart": [
   "Cuero",
   "acorde floral"
  ],
  "base": [
   "Cedro",
   "sándalo",
   "ambreta",
   "oud"
  ],
  "cat": "Árabe",
  "c1": "#2a2a2a",
  "c2": "#050505",
  "vid": 67856326426989,
  "img": "",
  "frames": []
 },
 {
  "n": "Hawas Fire",
  "b": "Rasasi",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 222.222",
  "pn": 222222,
  "fam": "Aromático acuático",
  "top": [
   "Salvia esclarea"
  ],
  "heart": [
   "Notas marinas",
   "jazmín egipcio"
  ],
  "base": [
   "Notas minerales",
   "ámbar gris",
   "ámbar"
  ],
  "cat": "Árabe",
  "c1": "#c4161c",
  "c2": "#2a0507",
  "vid": 67856326459757,
  "img": "",
  "frames": []
 },
 {
  "n": "Club de Nuit Untold",
  "b": "Armaf",
  "c": "EDP",
  "ml": 105,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 211.111",
  "pn": 211111,
  "fam": "Ámbar floral amaderado",
  "top": [
   "Azafrán",
   "jazmín"
  ],
  "heart": [
   "Madera de ámbar",
   "ámbar gris"
  ],
  "base": [
   "Resina de abeto",
   "cedro"
  ],
  "cat": "Árabe",
  "c1": "#f2c84b",
  "c2": "#9b5fd0",
  "vid": 67856326492525,
  "img": "",
  "frames": []
 },
 {
  "n": "Supremacy in Heaven",
  "b": "Afnan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 188.888",
  "pn": 188888,
  "fam": "Cítrico amaderado",
  "top": [
   "Bergamota",
   "mandarina"
  ],
  "heart": [
   "Té",
   "grosella negra"
  ],
  "base": [
   "Almizcle",
   "sándalo",
   "maderas"
  ],
  "cat": "Árabe",
  "c1": "#bcd3e6",
  "c2": "#5d7f9c",
  "vid": 67856326525293,
  "img": "",
  "frames": []
 },
 {
  "n": "Supremacy Noir",
  "b": "Afnan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 166.666",
  "pn": 166666,
  "fam": "Aromático cuero",
  "top": [
   "Abeto",
   "bergamota",
   "violeta"
  ],
  "heart": [
   "Pino",
   "cuero",
   "lavanda"
  ],
  "base": [
   "Pachulí",
   "láudano"
  ],
  "cat": "Árabe",
  "c1": "#2b2b2e",
  "c2": "#070708",
  "vid": 67856326558061,
  "img": "",
  "frames": []
 },
 {
  "n": "Supremacy Silver · Set",
  "b": "Afnan",
  "c": "Set EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 166.666",
  "pn": 166666,
  "fam": "Chipre frutal · EDP 100 ml + gel de ducha + bálsamo after shave",
  "top": [
   "Bergamota",
   "musgo de roble",
   "manzana"
  ],
  "heart": [
   "Piña",
   "jazmín",
   "pachulí"
  ],
  "base": [
   "Abedul",
   "almizcle",
   "ámbar gris"
  ],
  "cat": "Árabe",
  "c1": "#d9d9d6",
  "c2": "#6e6e6b",
  "vid": 67856326590829,
  "img": "",
  "frames": []
 },
 {
  "n": "Collection II · Set",
  "b": "Jo Milano",
  "c": "Set 3 × 30 ml",
  "ml": null,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 444.444",
  "pn": 444444,
  "fam": "Set de 3 fragancias: Double Bonus, All In y Bonus",
  "top": [
   "Double Bonus",
   "All In",
   "Bonus"
  ],
  "heart": [],
  "base": [],
  "cat": "Nicho",
  "c1": "#3fa9f5",
  "c2": "#ff7a1a",
  "vid": 67856326623597,
  "img": "",
  "frames": []
 },
 {
  "n": "Aquatica",
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 300.000",
  "pn": 300000,
  "fam": "Acuático tropical",
  "top": [
   "Lima",
   "coco",
   "bergamota",
   "mandarina"
  ],
  "heart": [
   "Jengibre",
   "hibisco",
   "ylang-ylang",
   "jazmín"
  ],
  "base": [
   "Almizcle",
   "caña de azúcar",
   "ron blanco"
  ],
  "cat": "Árabe",
  "c1": "#3fc1c9",
  "c2": "#0d3b4a",
  "vid": 67856328917357,
  "img": "",
  "frames": []
 },
 {
  "n": "Pride Mini Set No. 2",
  "b": "Lattafa",
  "c": "Set 5 × 20 ml",
  "ml": null,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 155.555",
  "pn": 155555,
  "fam": "Set de 5 fragancias: Artisan Ethnique, Natural Oud, Tharwah Silver, Eternal Oud y Shuyukh Gold",
  "top": [
   "Artisan Ethnique",
   "Natural Oud",
   "Tharwah Silver",
   "Eternal Oud",
   "Shuyukh Gold"
  ],
  "heart": [],
  "base": [],
  "cat": "Árabe",
  "c1": "#e9e4da",
  "c2": "#8a1c1c",
  "vid": 67856328982893,
  "img": "",
  "frames": []
 }
];
