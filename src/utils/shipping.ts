export function isDomestic(country: string): boolean {
    return country === "United States"; // adjust if needed
  }
  
  export function getEstimatedDeliveryDate(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate; // ✅ GOOD: returns actual Date object
  }
  
  