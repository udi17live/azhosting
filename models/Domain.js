const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema({
    tld: {
        type: String,
        required: true,
    },
    final_cost: {
        type: String,
        required: true,
    },
    renewal_cost: {
        type: String,
        required: true,
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});

const Domain = mongoose.model('Domain', DomainSchema);

module.exports = Domain;