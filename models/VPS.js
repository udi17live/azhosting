const mongoose = require('mongoose');

const VPSSchema = new mongoose.Schema({
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

const VPSPlan = mongoose.model('VPSPlan', VPSSchema);

module.exports = VPSPlan;