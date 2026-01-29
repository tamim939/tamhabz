
import React from 'react';
import { RamadanDay } from './types';

// Real-world approx timings for Dhaka, Bangladesh (Ramadan 2025 starts around March 1st)
export const RAMADAN_DATA: RamadanDay[] = [
  { day: 1, date: "০১ মার্চ", weekday: "শনিবার", sehri: "০৫:০৬", iftar: "০৬:০৩", hijriDate: "১ রমজান, ১৪৪৬" },
  { day: 2, date: "০২ মার্চ", weekday: "রবিবার", sehri: "০৫:০৫", iftar: "০৬:০৪", hijriDate: "২ রমজান, ১৪৪৬" },
  { day: 3, date: "০৩ মার্চ", weekday: "সোমবার", sehri: "০৫:০৪", iftar: "০৬:০৪", hijriDate: "৩ রমজান, ১৪৪৬" },
  { day: 4, date: "০৪ মার্চ", weekday: "মঙ্গলবার", sehri: "০৫:০৩", iftar: "০৬:০৫", hijriDate: "৪ রমজান, ১৪৪৬" },
  { day: 5, date: "০৫ মার্চ", weekday: "বুধবার", sehri: "০৫:০২", iftar: "০৬:০৫", hijriDate: "৫ রমজান, ১৪৪৬" },
  { day: 6, date: "০৬ মার্চ", weekday: "বৃহস্পতিবার", sehri: "০৫:০১", iftar: "০৬:০৬", hijriDate: "৬ রমজান, ১৪৪৬" },
  { day: 7, date: "০৭ মার্চ", weekday: "শুক্রবার", sehri: "০৫:০০", iftar: "০৬:০৬", hijriDate: "৭ রমজান, ১৪৪৬" },
  { day: 8, date: "০৮ মার্চ", weekday: "শনিবার", sehri: "০৪:৫৯", iftar: "০৬:০৭", hijriDate: "৮ রমজান, ১৪৪৬" },
  { day: 9, date: "০৯ মার্চ", weekday: "রবিবার", sehri: "০৪:৫৮", iftar: "০৬:০৭", hijriDate: "৯ রমজান, ১৪৪৬" },
  { day: 10, date: "১০ মার্চ", weekday: "সোমবার", sehri: "০৪:৫৭", iftar: "০৬:০৮", hijriDate: "১০ রমজান, ১৪৪৬" },
  { day: 11, date: "১১ মার্চ", weekday: "মঙ্গলবার", sehri: "০৪:৫৬", iftar: "০৬:০৮", hijriDate: "১১ রমজান, ১৪৪৬" },
  { day: 12, date: "১২ মার্চ", weekday: "বুধবার", sehri: "০৪:৫৫", iftar: "০৬:০৯", hijriDate: "১২ রমজান, ১৪৪৬" },
  { day: 13, date: "১৩ মার্চ", weekday: "বৃহস্পতিবার", sehri: "০৪:৫৪", iftar: "০৬:০৯", hijriDate: "১৩ রমজান, ১৪৪৬" },
  { day: 14, date: "১৪ মার্চ", weekday: "শুক্রবার", sehri: "০৪:৫৩", iftar: "০৬:১০", hijriDate: "১৪ রমজান, ১৪৪৬" },
  { day: 15, date: "১৫ মার্চ", weekday: "শনিবার", sehri: "০৪:৫২", iftar: "০৬:১০", hijriDate: "১৫ রমজান, ১৪৪৬" },
  { day: 16, date: "১৬ মার্চ", weekday: "রবিবার", sehri: "০৪:৫১", iftar: "০৬:১১", hijriDate: "১৬ রমজান, ১৪৪৬" },
  { day: 17, date: "১৭ মার্চ", weekday: "সোমবার", sehri: "০৪:৫০", iftar: "০৬:১১", hijriDate: "১৭ রমজান, ১৪৪৬" },
  { day: 18, date: "১৮ মার্চ", weekday: "মঙ্গলবার", sehri: "০৪:৪৮", iftar: "০৬:১২", hijriDate: "১৮ রমজান, ১৪৪৬" },
  { day: 19, date: "১৯ মার্চ", weekday: "বুধবার", sehri: "০৪:৪৭", iftar: "০৬:১২", hijriDate: "১৯ রমজান, ১৪৪৬" },
  { day: 20, date: "২০ মার্চ", weekday: "বৃহস্পতিবার", sehri: "০৪:৪৬", iftar: "০৬:১৩", hijriDate: "২০ রমজান, ১৪৪৬" },
  { day: 21, date: "২১ মার্চ", weekday: "শুক্রবার", sehri: "০৪:৪৫", iftar: "০৬:১৩", hijriDate: "২১ রমজান, ১৪৪৬" },
  { day: 22, date: "২২ মার্চ", weekday: "শনিবার", sehri: "০৪:৪৪", iftar: "০৬:১৪", hijriDate: "২২ রমজান, ১৪৪৬" },
  { day: 23, date: "২৩ মার্চ", weekday: "রবিবার", sehri: "০৪:৪৩", iftar: "০৬:১৪", hijriDate: "২৩ রমজান, ১৪৪৬" },
  { day: 24, date: "২৪ মার্চ", weekday: "সোমবার", sehri: "০৪:৪২", iftar: "০৬:১৫", hijriDate: "২৪ রমজান, ১৪৪৬" },
  { day: 25, date: "২৫ মার্চ", weekday: "মঙ্গলবার", sehri: "০৪:৪১", iftar: "০৬:১৫", hijriDate: "২৫ রমজান, ১৪৪৬" },
  { day: 26, date: "২৬ মার্চ", weekday: "বুধবার", sehri: "০৪:৪০", iftar: "০৬:১৬", hijriDate: "২৬ রমজান, ১৪৪৬" },
  { day: 27, date: "২৭ মার্চ", weekday: "বৃহস্পতিবার", sehri: "০৪:৩৯", iftar: "০৬:১৬", hijriDate: "২৭ রমজান, ১৪৪৬" },
  { day: 28, date: "২৮ মার্চ", weekday: "শুক্রবার", sehri: "০৪:৩৮", iftar: "০৬:১৭", hijriDate: "২৮ রমজান, ১৪৪৬" },
  { day: 29, date: "২৯ মার্চ", weekday: "শনিবার", sehri: "০৪:৩৭", iftar: "০৬:১৭", hijriDate: "২৯ রমজান, ১৪৪৬" },
  { day: 30, date: "৩০ মার্চ", weekday: "রবিবার", sehri: "০৪:৩৬", iftar: "০৬:১৮", hijriDate: "৩০ রমজান, ১৪৪৬" },
];

export const DUAS = [
  {
    title: "রোজার নিয়ত",
    arabic: "نويت أن أصوم غدا من شهر رمضان المبارক فرضا لك يا الله فتقبل مني إنক أنت السميع العليم",
    transliteration: "নাওয়াইতু আন আসুমা গাদান মিন শাহরি রামাদ্বানাল মুবারাকি ফারদ্বান লাকা ইয়া আল্লাহু ফাতাকাব্বাল মিন্নি ইন্নাকা আনতাস সামিউল আলিম।",
    translation: "হে আল্লাহ! আগামীকাল পবিত্র রমজান মাসে তোমার পক্ষ থেকে নির্ধারিত ফরজ রোজা রাখার নিয়ত করলাম। অতএব তুমি আমার পক্ষ থেকে তা কবুল করো। নিশ্চয়ই তুমি সর্বশ্রোতা ও সর্বজ্ঞ।"
  },
  {
    title: "ইফতারের দোয়া",
    arabic: "اللهم لك صمت وعلى رزقك أفطرت",
    transliteration: "আল্লাহুম্মা লাকা সুমতু ওয়া আলা রিজকিকা আফতারতু।",
    translation: "হে আল্লাহ! আমি তোমারই সন্তুষ্টির জন্য রোজা রেখেছি এবং তোমারই দেয়া রিজিক দ্বারা ইফতার করছি।"
  }
];
