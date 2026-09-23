/**
 * ANAVANDI CONNECT - Kerala Public Transport Data Repository
 * Sourced & aggregated from https://github.com/razinahmed/kerala-public-transport-api
 * Contains KSRTC Depots, Real Routes, Major Bus Stops & Districts across all 14 Districts of Kerala.
 */

export const KSRTC_DEPOTS = [
  {
    "code": "TVM-C",
    "name": "Thiruvananthapuram Central",
    "district": "Thiruvananthapuram",
    "lat": 8.4875,
    "lng": 76.9525,
    "bus_count": 180,
    "routes_operated": 85,
    "types": ["ordinary", "fast", "superfast", "superdeluxe", "ac", "volvo"]
  },
  {
    "code": "EKM",
    "name": "Ernakulam Depot",
    "district": "Ernakulam",
    "lat": 9.9816,
    "lng": 76.2999,
    "bus_count": 160,
    "routes_operated": 75,
    "types": ["ordinary", "fast", "superfast", "superdeluxe", "ac", "volvo"]
  },
  {
    "code": "KKD",
    "name": "Kozhikode Depot",
    "district": "Kozhikode",
    "lat": 11.2588,
    "lng": 75.7804,
    "bus_count": 140,
    "routes_operated": 65,
    "types": ["ordinary", "fast", "superfast", "superdeluxe", "ac"]
  },
  {
    "code": "TSR",
    "name": "Thrissur Depot",
    "district": "Thrissur",
    "lat": 10.5210,
    "lng": 76.2108,
    "bus_count": 120,
    "routes_operated": 55,
    "types": ["ordinary", "fast", "superfast", "superdeluxe"]
  },
  {
    "code": "PKD",
    "name": "Palakkad Depot",
    "district": "Palakkad",
    "lat": 10.7750,
    "lng": 76.6515,
    "bus_count": 90,
    "routes_operated": 40,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "KNR",
    "name": "Kannur Depot",
    "district": "Kannur",
    "lat": 11.8650,
    "lng": 75.3700,
    "bus_count": 100,
    "routes_operated": 48,
    "types": ["ordinary", "fast", "superfast", "superdeluxe"]
  },
  {
    "code": "KTM",
    "name": "Kottayam Depot",
    "district": "Kottayam",
    "lat": 9.5930,
    "lng": 76.5210,
    "bus_count": 85,
    "routes_operated": 38,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "KLM",
    "name": "Kollam Depot",
    "district": "Kollam",
    "lat": 8.8878,
    "lng": 76.5985,
    "bus_count": 80,
    "routes_operated": 35,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "ALP",
    "name": "Alappuzha Depot",
    "district": "Alappuzha",
    "lat": 9.4981,
    "lng": 76.3388,
    "bus_count": 65,
    "routes_operated": 30,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "KSD",
    "name": "Kasaragod Depot",
    "district": "Kasaragod",
    "lat": 12.5000,
    "lng": 74.9900,
    "bus_count": 55,
    "routes_operated": 25,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "PTA",
    "name": "Pathanamthitta Depot",
    "district": "Pathanamthitta",
    "lat": 9.2648,
    "lng": 76.7870,
    "bus_count": 60,
    "routes_operated": 28,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "SBY",
    "name": "Sulthan Bathery Depot",
    "district": "Wayanad",
    "lat": 11.6647,
    "lng": 76.2530,
    "bus_count": 50,
    "routes_operated": 22,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "MLP",
    "name": "Malappuram Depot",
    "district": "Malappuram",
    "lat": 11.0510,
    "lng": 76.0711,
    "bus_count": 70,
    "routes_operated": 32,
    "types": ["ordinary", "fast", "superfast"]
  },
  {
    "code": "IDK-P",
    "name": "Painavu / Idukki Depot",
    "district": "Idukki",
    "lat": 9.8494,
    "lng": 76.9710,
    "bus_count": 45,
    "routes_operated": 20,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "ALV",
    "name": "Aluva Sub-Depot",
    "district": "Ernakulam",
    "lat": 10.1099,
    "lng": 76.3495,
    "bus_count": 85,
    "routes_operated": 42,
    "types": ["ordinary", "fast", "superfast", "ac"]
  },
  {
    "code": "ATG",
    "name": "Attingal Depot",
    "district": "Thiruvananthapuram",
    "lat": 8.6967,
    "lng": 76.8156,
    "bus_count": 60,
    "routes_operated": 26,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "PLA",
    "name": "Pala Depot",
    "district": "Kottayam",
    "lat": 9.7134,
    "lng": 76.6835,
    "bus_count": 55,
    "routes_operated": 24,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "CKD",
    "name": "Chalakudy Depot",
    "district": "Thrissur",
    "lat": 10.3070,
    "lng": 76.3310,
    "bus_count": 50,
    "routes_operated": 22,
    "types": ["ordinary", "fast"]
  },
  {
    "code": "GVR",
    "name": "Guruvayoor Sub-Depot",
    "district": "Thrissur",
    "lat": 10.5935,
    "lng": 76.0417,
    "bus_count": 65,
    "routes_operated": 30,
    "types": ["ordinary", "fast", "superfast"]
  }
];

export const SAMPLE_ROUTES = [
  {
    "route_id": "TVM-EKM-SF01",
    "name": "Thiruvananthapuram - Kochi SuperFast",
    "origin": "Thampanoor Bus Station",
    "destination": "Ernakulam KSRTC Bus Stand",
    "type": "superfast",
    "operator": "KSRTC",
    "distance_km": 220,
    "duration_minutes": 270,
    "via": ["Kollam KSRTC", "Alappuzha KSRTC", "Cherthala"],
    "departure_times": ["05:00", "06:30", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    "fare_inr": 210,
    "status": "On Time"
  },
  {
    "route_id": "TVM-EKM-AC01",
    "name": "Thiruvananthapuram - Kochi AC Volvo",
    "origin": "Thampanoor Bus Station",
    "destination": "Vyttila Mobility Hub",
    "type": "volvo",
    "operator": "KSRTC Swift",
    "distance_km": 220,
    "duration_minutes": 240,
    "via": ["Kollam KSRTC", "Alappuzha KSRTC"],
    "departure_times": ["06:00", "10:00", "14:00", "18:00", "22:00"],
    "fare_inr": 580,
    "status": "Boarding"
  },
  {
    "route_id": "EKM-KKD-SF01",
    "name": "Kochi - Kozhikode SuperFast",
    "origin": "Ernakulam KSRTC Bus Stand",
    "destination": "Kozhikode KSRTC",
    "type": "superfast",
    "operator": "KSRTC",
    "distance_km": 250,
    "duration_minutes": 330,
    "via": ["Thrissur KSRTC", "Malappuram KSRTC"],
    "departure_times": ["05:30", "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    "fare_inr": 240,
    "status": "Departed"
  },
  {
    "route_id": "TVM-KLM-ORD01",
    "name": "Thiruvananthapuram - Kollam Ordinary",
    "origin": "Thampanoor Bus Station",
    "destination": "Kollam KSRTC",
    "type": "ordinary",
    "operator": "KSRTC",
    "distance_km": 72,
    "duration_minutes": 120,
    "via": ["Attingal", "Kallambalam"],
    "departure_times": ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00"],
    "fare_inr": 55,
    "status": "On Time"
  },
  {
    "route_id": "EKM-TSR-FP01",
    "name": "Kochi - Thrissur Fast Passenger",
    "origin": "Ernakulam KSRTC Bus Stand",
    "destination": "Thrissur KSRTC",
    "type": "fast",
    "operator": "KSRTC",
    "distance_km": 80,
    "duration_minutes": 120,
    "via": ["Aluva Bus Stand", "Angamaly", "Chalakudy"],
    "departure_times": ["05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    "fare_inr": 72,
    "status": "Boarding"
  },
  {
    "route_id": "EKM-MNR-ORD01",
    "name": "Kochi - Munnar Hill Highway Express",
    "origin": "Ernakulam KSRTC Bus Stand",
    "destination": "Munnar",
    "type": "ordinary",
    "operator": "KSRTC",
    "distance_km": 130,
    "duration_minutes": 270,
    "via": ["Perumbavoor", "Muvattupuzha", "Thodupuzha"],
    "departure_times": ["06:00", "08:00", "10:00", "12:00", "14:30"],
    "fare_inr": 95,
    "status": "On Time"
  },
  {
    "route_id": "TVM-KKD-SD01",
    "name": "Thiruvananthapuram - Kozhikode Super Deluxe",
    "origin": "Thampanoor Bus Station",
    "destination": "Kozhikode KSRTC",
    "type": "superdeluxe",
    "operator": "KSRTC Swift",
    "distance_km": 400,
    "duration_minutes": 540,
    "via": ["Kollam KSRTC", "Alappuzha KSRTC", "Ernakulam KSRTC Bus Stand", "Thrissur KSRTC"],
    "departure_times": ["06:00", "14:00", "20:00"],
    "fare_inr": 450,
    "status": "Scheduled"
  },
  {
    "route_id": "KKD-WYD-ORD01",
    "name": "Kozhikode - Wayanad Ghats Shuttle",
    "origin": "Kozhikode KSRTC",
    "destination": "Wayanad Kalpetta",
    "type": "ordinary",
    "operator": "KSRTC",
    "distance_km": 100,
    "duration_minutes": 180,
    "via": ["Thamarassery", "Lakkidi Ghats"],
    "departure_times": ["06:00", "07:30", "09:00", "11:00", "13:30", "15:00"],
    "fare_inr": 85,
    "status": "On Time"
  }
];

export const KERALA_DISTRICTS = [
  { "code": "TVM", "name": "Thiruvananthapuram", "headquarters": "Thiruvananthapuram", "lat": 8.5241, "lng": 76.9366, "depotCount": 3, "totalBuses": 340 },
  { "code": "KLM", "name": "Kollam", "headquarters": "Kollam", "lat": 8.8932, "lng": 76.6141, "depotCount": 2, "totalBuses": 140 },
  { "code": "PTA", "name": "Pathanamthitta", "headquarters": "Pathanamthitta", "lat": 9.2648, "lng": 76.7870, "depotCount": 2, "totalBuses": 115 },
  { "code": "ALP", "name": "Alappuzha", "headquarters": "Alappuzha", "lat": 9.4981, "lng": 76.3388, "depotCount": 2, "totalBuses": 130 },
  { "code": "KTM", "name": "Kottayam", "headquarters": "Kottayam", "lat": 9.5916, "lng": 76.5222, "depotCount": 2, "totalBuses": 140 },
  { "code": "IDK", "name": "Idukki", "headquarters": "Painavu", "lat": 9.8494, "lng": 76.9710, "depotCount": 1, "totalBuses": 45 },
  { "code": "EKM", "name": "Ernakulam", "headquarters": "Kochi", "lat": 9.9312, "lng": 76.2673, "depotCount": 3, "totalBuses": 330 },
  { "code": "TSR", "name": "Thrissur", "headquarters": "Thrissur", "lat": 10.5276, "lng": 76.2144, "depotCount": 3, "totalBuses": 235 },
  { "code": "PKD", "name": "Palakkad", "headquarters": "Palakkad", "lat": 10.7750, "lng": 76.6515, "depotCount": 2, "totalBuses": 160 },
  { "code": "MLP", "name": "Malappuram", "headquarters": "Malappuram", "lat": 11.0510, "lng": 76.0711, "depotCount": 2, "totalBuses": 150 },
  { "code": "KKD", "name": "Kozhikode", "headquarters": "Kozhikode", "lat": 11.2588, "lng": 75.7804, "depotCount": 2, "totalBuses": 210 },
  { "code": "WYD", "name": "Wayanad", "headquarters": "Kalpetta", "lat": 11.6854, "lng": 76.0839, "depotCount": 1, "totalBuses": 85 },
  { "code": "KNR", "name": "Kannur", "headquarters": "Kannur", "lat": 11.8650, "lng": 75.3700, "depotCount": 2, "totalBuses": 180 },
  { "code": "KSD", "name": "Kasaragod", "headquarters": "Kasaragod", "lat": 12.5000, "lng": 74.9900, "depotCount": 1, "totalBuses": 75 }
];
