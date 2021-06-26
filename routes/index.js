const express = require('express');
const resellerPanelURL = process.env.RESELLER_PANEL_URL;

//Load Models
const models = require('../models');

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
    var domains = await models.Domain.findAll({where: {tld: ["com","net","org","store","club","xyz"]}})
        .then(domains_recieved => {
            var domains_obj = {};
            domains_recieved.forEach((item) => {
                domains_obj[item.tld] = item.final_cost;
            });
            
            return domains_obj;
        })
        .catch(err => console.log(err));

    var minDomainCost = await models.Domain.findAll()
        .then(domains_recieved => {
            var domains_arr = [];
            domains_recieved.forEach((item) => {
                domains_arr.push(parseFloat(item.final_cost));
            });
            
            domains_arr.sort(function(a,b) { return a - b;})
            return domains_arr[0];
        })
        .catch(err => console.log(err));

    var minSharedHostingPrice = await models.SharedHostingPlan.findAll()
        .then(result => {
            var sh_arr = [];
            result.forEach((item) => {
                sh_arr.push(parseFloat(item.final_cost));
            });

            sh_arr.sort(function(a,b) { return a - b;});

            minPlanValue = sh_arr[0] / 12;
            return minPlanValue;
        })
        .catch(err => console.log(err));

    const minVpsCloudPrice = await await models.VpsCloudHostingPlan.findAll()
    .then(result => {
        var vps_cloud_arr = [];
        result.forEach((item) => {
            vps_cloud_arr.push(parseFloat(item.final_cost));
        });

        vps_cloud_arr.sort(function(a,b) { return a - b;});

        return vps_cloud_arr[0];
    })
    .catch(err => console.log(err));


    const minVpsPrice = await await models.VpsHostingPlan.findAll()
    .then(result => {
        var vps_arr = [];
        result.forEach((item) => {
            vps_arr.push(parseFloat(item.final_cost));
        });

        vps_arr.sort(function(a,b) { return a - b;});

        return vps_arr[0];
    })
    .catch(err => console.log(err));


    const minDedicatedServerPrice = await models.DedicatedHostingPlan.findAll()
    .then(result => {
        var ded_arr = [];
        result.forEach((item) => {
            ded_arr.push(parseFloat(item.final_cost));
        });

        ded_arr.sort(function(a,b) { return a - b;});

        return ded_arr[0];
    })
    .catch(err => console.log(err));

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
    var sharedHostingPlans =  await models.SharedHostingPlan.findAll()
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
    var domains = await models.Domain.findAll()
        .then(domains_recieved => {
            return domains_recieved;
        })
        .catch(err => console.log(err));

    res.render('domain-pricing', {
        domains
    });
});

module.exports = router;