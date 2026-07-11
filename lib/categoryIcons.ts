import {
  Monitor,
  Laptop,
  Smartphone,
  Headphones,
  Keyboard,
  Mouse,
  Printer,
  Camera,
  Tablet,
  Speaker,
  Router,
  HardDrive,
  MemoryStick,
  Tv,
  Gamepad2,
  Cable,
  Watch,
  Cpu,
  Package,
} from 'lucide-react'

type LucideIcon = typeof Monitor

/* Keyword → icon. Matched against the category slug/name (accent-free),
   so "Impresoras láser" or "impresoras" both resolve to Printer.
   First match wins; order groups from most to least specific. */
const keywordIcons: [string[], LucideIcon][] = [
  [['portatil', 'laptop', 'notebook'], Laptop],
  [['computador', 'escritorio', 'torre', 'todo-en-uno', 'aio', 'pc'], Monitor],
  [['celular', 'telefono', 'smartphone', 'movil', 'iphone'], Smartphone],
  [['tablet', 'ipad'], Tablet],
  [['audifono', 'auricular', 'diadema', 'headset'], Headphones],
  [['parlante', 'altavoz', 'bocina', 'sonido', 'audio'], Speaker],
  [['teclado'], Keyboard],
  [['mouse', 'raton'], Mouse],
  [['impresora', 'multifuncional', 'tinta', 'toner'], Printer],
  [['camara', 'webcam', 'video'], Camera],
  [['router', 'red', 'wifi', 'modem', 'switch'], Router],
  [['disco', 'ssd', 'hdd', 'almacenamiento', 'nas'], HardDrive],
  [['memoria', 'ram', 'usb', 'micro-sd', 'microsd'], MemoryStick],
  [['televisor', 'tv', 'pantalla', 'monitor-gamer'], Tv],
  [['consola', 'videojuego', 'gamer', 'gaming', 'juego'], Gamepad2],
  [['cable', 'cargador', 'adaptador', 'hub'], Cable],
  [['reloj', 'smartwatch', 'banda', 'wearable'], Watch],
  [['procesador', 'componente', 'tarjeta', 'board'], Cpu],
  [['accesorio'], Headphones],
]

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Resolve the lucide icon for a category by slug or name keywords. */
export function iconForSlug(slugOrName: string): LucideIcon {
  const n = normalize(slugOrName)
  for (const [keys, Icon] of keywordIcons) {
    if (keys.some(k => n.includes(k))) return Icon
  }
  return Package
}

/* Kept for compatibility with earlier imports */
export const categoryIcons: Record<string, LucideIcon> = {
  computadores: Monitor,
  portatiles: Laptop,
  celulares: Smartphone,
  accesorios: Headphones,
}
