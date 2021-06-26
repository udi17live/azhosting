const mongoose = require('mongoose');

const SharedHostingSchema = new mongoose.Schema({
    hosting_type: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    final_cost: {
        type: String,
        required: true,
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});

const SharedHostingPlan = mongoose.model('SharedHostingPlan', SharedHostingSchema);

module.exports = SharedHostingPlan;