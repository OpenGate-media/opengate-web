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
  "p": "$ 266.666",
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
  "pn": 266666
 },
 {
  "n": "Liquid Brun",
  "vid": 67842845245805,
  "b": "French Avenue",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 277.777",
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
  "pn": 277777
 },
 {
  "n": "Atlas",
  "vid": 67842845278573,
  "b": "Lattafa",
  "c": "EDP",
  "ml": 55,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 188.888",
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
  "pn": 188888
 },
 {
  "n": "Khamrah",
  "vid": 67842845311341,
  "b": "Lattafa",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 199.999",
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
  "pn": 199999
 },
 {
  "n": "Hawas Ice",
  "vid": 67842845376877,
  "b": "Rasasi",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 233.333",
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
  "pn": 233333
 },
 {
  "n": "Cedrus Blanc",
  "vid": 67842848260461,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 377.777",
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
  "pn": 377777
 },
 {
  "n": "Nocturno Elixir",
  "vid": 67842848751981,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 199.999",
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
  "pn": 199999
 },
 {
  "n": "Terra",
  "vid": 67842848817517,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Unisex",
  "p": "$ 233.333",
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
  "pn": 233333
 },
 {
  "n": "Wolf",
  "vid": 67842849309037,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 222.222",
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
  "pn": 222222
 },
 {
  "n": "Black XS",
  "vid": 67842849538413,
  "b": "Paco Rabanne",
  "c": "EDT",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 277.777",
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
  "pn": 277777
 },
 {
  "n": "Pacific Aura",
  "vid": 67852551225709,
  "b": "Rayhaan",
  "c": "EDP",
  "ml": 100,
  "g": "el",
  "gen": "Hombre",
  "p": "$ 211.111",
  "pn": 211111,
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
  "g": "el",
  "gen": "Hombre",
  "p": "Precio por confirmar",
  "pn": 0,
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
  "vid": 0,
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
  "p": "Precio por confirmar",
  "pn": 0,
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
  "vid": 0,
  "img": "",
  "frames": []
 },
 {
  "n": "Dreamscape",
  "b": "Mykonos",
  "c": "EDP",
  "ml": 100,
  "g": "uni",
  "gen": "Por confirmar",
  "p": "Precio por confirmar",
  "pn": 0,
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
  "vid": 0,
  "img": "",
  "frames": []
 },
 {
  "n": "Reflection",
  "b": "Mykonos",
  "c": "EDP",
  "ml": null,
  "g": "uni",
  "gen": "Unisex",
  "p": "Precio por confirmar",
  "pn": 0,
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
  "vid": 0,
  "img": "",
  "frames": []
 },
 {
  "n": "Inception",
  "b": "Mykonos",
  "c": "EDP",
  "ml": null,
  "g": "uni",
  "gen": "Por confirmar",
  "p": "Precio por confirmar",
  "pn": 0,
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
  "vid": 0,
  "img": "",
  "frames": []
 }
];
