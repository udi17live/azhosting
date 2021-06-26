const mongoose = require('mongoose');

const VPSCloudSchema = new mongoose.Schema({
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

const VPSCloudPlan = mongoose.model('VPSCloudPlan', VPSCloudSchema);

module.exports = VPSCloudPlan;