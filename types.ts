
export interface RamadanDay {
  day: number;
  date: string;
  weekday: string;
  sehri: string;
  iftar: string;
  hijriDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LocationData {
  city: string;
  lat: number;
  lng: number;
}
