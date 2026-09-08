const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task-Titel ist erforderlich"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    priority: {
      type: String,
      enum: ["Hoch", "Medium", "Niedrig"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          const dueDate = new Date(value);
          dueDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return dueDate >= today;
        },
        message: "Das Fälligkeitsdatum darf nicht in der Vergangenheit liegen.",
      },
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
