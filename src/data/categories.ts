interface CategoriesData {
  [regionName: string]: string[];
}

export const categoryOptions: CategoriesData = {
  Electronics: [
    "Smartphones",
    "Feature phones",
    "Tablets",
    "Smartwatches",
    "Phone cases & covers",
    "Screen protectors",
    "Laptop",
    "Desktops",
    "Monitors",
    "Computer parts ( RAM,SSD,CPU,GPU)",
    "Storage Devices ( SSD, EXTERNAL HDD & etc)",
    "Keyboards & Mice",
    "Headphones & Earbuds",
    "Routers, modems, & Switches",
  ],
  Furniture: ["Living room", "Bedroom", "Office", "Outdoor", "Kitchen"],
  Vehicles: ["Cars", "Motorbikes", "Trucks", "Bicycles"],
  Clothing: ["Men", "Women", "Kids", "Accessories"],
  Books: ["Textbooks", "Novels", "Comics", "Children's books"],
};
