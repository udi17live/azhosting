const mongoose = require('mongoose');

const DedicatedServerSchema = new mongoose.Schema({
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

const DedicatedServerPlan = mongoose.model('DedicatedServerPlan', DedicatedServerSchema);

module.exports = DedicatedServerPlan;