// vibeCodeSpace_clone/backend/migrations/1678886400002_add-stripe-customer-id.js
exports.up = (pgm) => {
  pgm.addColumns("profiles", {
    stripe_customer_id: {
      type: "text",
      unique: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("profiles", ["stripe_customer_id"]);
};
