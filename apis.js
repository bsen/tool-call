const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const mockData = {
  company1: {
    tickets: {
      T123: { status: "in-progress", description: "Technical issue" },
      T124: { status: "resolved", description: "Billing query" },
    },
    orders: {
      O789: { items: ["Laptop", "Mouse"], total: 1200 },
      O790: { items: ["Keyboard"], total: 100 },
    },
  },
  company2: {
    shipments: {
      S456: { status: "delivered", destination: "New York" },
      S457: { status: "in-transit", destination: "Boston" },
    },
    products: {
      P101: { name: "Premium Chair", stock: 50 },
      P102: { name: "Desk Lamp", stock: 30 },
    },
  },
};

app.get("/company1/ticket-status/:ticketId", (req, res) => {
  console.log(
    `[API] Company1: Ticket status requested for ${req.params.ticketId}`
  );
  const ticket = mockData.company1.tickets[req.params.ticketId];
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  return res.json({ status: ticket.status });
});

app.get("/company1/order-details/:orderId", (req, res) => {
  console.log(
    `[API] Company1: Order details requested for ${req.params.orderId}`
  );
  const order = mockData.company1.orders[req.params.orderId];
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  return res.json(order);
});

app.get("/company2/api/shipment-status/:shipmentId", (req, res) => {
  console.log(
    `[API] Company2: Shipment status requested for ${req.params.shipmentId}`
  );
  const shipment = mockData.company2.shipments[req.params.shipmentId];
  if (!shipment) {
    return res.status(404).json({ error: "Shipment not found" });
  }
  return res.json({ status: shipment.status });
});

app.get("/company2/api/product-stock/:productId", (req, res) => {
  console.log(
    `[API] Company2: Product stock requested for ${req.params.productId}`
  );
  const product = mockData.company2.products[req.params.productId];
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.json({ stock: product.stock });
});

app.listen(port, () => {
  console.log(`[API] Mock API server running on http://localhost:${port}`);
});
