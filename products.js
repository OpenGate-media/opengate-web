// Catálogo de og.prdct
// Fotos reales: pon la foto en /img/ y escribe su ruta en "img" (ej. "/img/khamrah.webp").
// Giro 360 real: pon 12-24 fotos alrededor del frasco en "frames" (en orden) y la tarjeta las recorre con el cursor.
// Sin foto, se muestra el frasco 3D de muestra con los colores c1/c2.
// Número de WhatsApp para pedidos (con indicativo, sin +). Vacío = se usa Instagram.
const WHATSAPP = '';
const IG = 'og.prdct';
const P = [
 {
  "n": "9 PM Rebel",
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
 }
];
