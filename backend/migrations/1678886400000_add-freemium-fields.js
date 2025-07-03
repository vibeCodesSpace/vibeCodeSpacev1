// vibeCodeSpace_clone/backend/migrations/1678886400000_add-freemium-fields.js
exports.up = (pgm) => {
  pgm.addColumns("profiles", {
    plan: {
      type: "varchar(50)",
      notNull: true,
      default: "free", // 'free', 'pro', 'enterprise'
    },
    generations_used: {
      type: "integer",
      notNull: true,
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("profiles", ["plan", "generations_used"]);
};
