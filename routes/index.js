const express = require('express');
const resellerPanelURL = process.env.RESELLER_PANEL_URL;

//Load Models
const Domain = require('../models/Domain');
const SharedHosting = require('../models/SharedHosting');
const VPS = require('../models/VPS');
const VPSCloud = require('../models/VPSCloud');
const DedicatedServer = require('../models/DedicatedServer');

const router = express.Router();

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with _
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

router.get('/', async function (req, res) {
    var domains = await Domain.find({ tld: { $in: ["com", "net", "store", "org", "xyz"] } })
        .then(domains_recieved => {
            var domains_obj = {};
            domains_recieved.forEach((item) => {
                domains_obj[item.tld] = item.final_cost;
            });

            return domains_obj;
        })
        .catch(err => console.log(err));

    var minDomainDoc = await Domain.aggregate(
        [{ $sort: { final_cost: 1 } }, { $limit: 1 }]
    );

    var minSharedHostingPrice = await SharedHosting.find({}, ("product_name final_cost"), { sort: { "final_cost": 1 } })
        .then(result => {
            var sh_obj = {};
            result.forEach((item) => {
                sh_obj[item.product_name] = parseFloat(item.final_cost);
            });

            const final_plans = Object.entries(sh_obj)
                .sort(([, a], [, b]) => a - b)
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            minPlanValue = final_plans[Object.keys(final_plans)[0]] / 12;
            return minPlanValue;
        })
        .catch(err => console.log(err));

    const minVpsCloudPrice = await VPSCloud.find({}, ("product_name final_cost"), { sort: { "final_cost": 1 } })
        .then(result => {
            var sh_obj = {};
            result.forEach((item) => {
                sh_obj[item.product_name] = parseFloat(item.final_cost);
            });

            const final_plans = Object.entries(sh_obj)
                .sort(([, a], [, b]) => a - b)
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            minPlanValue = final_plans[Object.keys(final_plans)[0]];
            return minPlanValue;
        })
        .catch(err => console.log(err));


    const minVpsPrice = await VPS.find({}, ("product_name final_cost"), { sort: { "final_cost": 1 } })
        .then(result => {
            var sh_obj = {};
            result.forEach((item) => {
                sh_obj[item.product_name] = parseFloat(item.final_cost);
            });

            const final_plans = Object.entries(sh_obj)
                .sort(([, a], [, b]) => a - b)
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            minPlanValue = final_plans[Object.keys(final_plans)[0]];
            return minPlanValue;
        })
        .catch(err => console.log(err));


    const minDedicatedServerPrice = await DedicatedServer.find({}, ("product_name final_cost"), { sort: { "final_cost": 1 } })
        .then(result => {
            var sh_obj = {};
            result.forEach((item) => {
                sh_obj[item.product_name] = parseFloat(item.final_cost);
            });

            const final_plans = Object.entries(sh_obj)
                .sort(([, a], [, b]) => a - b)
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            minPlanValue = final_plans[Object.keys(final_plans)[0]];
            return minPlanValue;
        })
        .catch(err => console.log(err));

    var minDomainCost = minDomainDoc.final_cost ? minDomainDoc.final_cost : "0";

    res.render('home', {
        domains,
        minDomainCost,
        minSharedHostingPrice,
        minVpsCloudPrice,
        minVpsPrice,
        minDedicatedServerPrice
    });
});

router.get('/shared-web-hosting', async function (req, res) {
    var sharedHostingPlans = await SharedHosting.find({})
        .then(result => {
            var plans = {};
            result.forEach((item) => {
                var slugified_name = slugify(item.product_name);
                var final_cost = parseFloat(item.final_cost);
                var monthly_cost = final_cost / 12;
                plans[slugified_name] = {
                    name: item.product_name,
                    monthly_cost: monthly_cost,
                    cost: final_cost
                };
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/?shared_hosting`;

    console.log(sharedHostingPlans);
    res.render('shared-web-hosting', {
        sharedHostingPlans,
        billingURL
    });
});


router.get('/vps', async function (req, res) {res.render('vps')});


router.get('/domain-pricing', async function (req, res) {
    var domains = await Domain.find()
        .then(domains_recieved => {
            
            domains_recieved.sort(function(a, b){
                if(a.tld < b.tld) { return -1; }
                if(a.tld > b.tld) { return 1; }
                return 0;
            });

            return domains_recieved;
        })
        .catch(err => console.log(err));

    res.render('domain-pricing', {
        domains
    });
});

module.exports = router;