const companies = {
  1: {
    name: "Tech Corp",
    apiBaseUrl: "http://localhost:3000/company1",
    functions: [
      {
        name: "getTicketStatus",
        description: "Get the status of a support ticket",
        endpoint: "/ticket-status",
        parameters: {
          type: "object",
          properties: {
            ticketId: {
              type: "string",
              description: "The ID of the ticket",
            },
          },
          required: ["ticketId"],
        },
      },
      {
        name: "getOrderDetails",
        description: "Get details of a customer order",
        endpoint: "/order-details",
        parameters: {
          type: "object",
          properties: {
            orderId: {
              type: "string",
              description: "The ID of the order",
            },
          },
          required: ["orderId"],
        },
      },
    ],
  },
  2: {
    name: "Retail Plus",
    apiBaseUrl: "http://localhost:3000/company2",
    functions: [
      {
        name: "getShipmentStatus",
        description: "Get status of a shipment",
        endpoint: "/api/shipment-status",
        parameters: {
          type: "object",
          properties: {
            shipmentId: {
              type: "string",
              description: "The ID of the shipment",
            },
          },
          required: ["shipmentId"],
        },
      },
      {
        name: "getProductStock",
        description: "Get current stock of a product",
        endpoint: "/api/product-stock",
        parameters: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "The ID of the product",
            },
          },
          required: ["productId"],
        },
      },
    ],
  },
};

module.exports = companies;
