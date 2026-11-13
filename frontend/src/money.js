// currency formatting - sab jagah PKR use hota hai
export const money = (n) => "Rs " + Number(n || 0).toLocaleString();
