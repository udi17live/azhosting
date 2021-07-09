const express = require('express');
const resellerPanelURL = process.env.RESELLER_HOSTING_URL;
const axios = require('axios').default;
const xml2js = require('xml2js');
const nodemailer = require('nodemailer');

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

function validateUrl(url) {
    var without_regex = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    return without_regex.test(url);
}

router.get('/', async function (req, res) {
    var domains = await models.Domain.findAll({ where: { tld: ["com", "net", "org", "store", "club", "xyz"] } })
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

            domains_arr.sort(function (a, b) { return a - b; })
            return domains_arr[0];
        })
        .catch(err => console.log(err));

    var minSharedHostingPrice = await models.SharedHostingPlan.findAll()
        .then(result => {
            var sh_arr = [];
            result.forEach((item) => {
                sh_arr.push(parseFloat(item.final_cost));
            });

            sh_arr.sort(function (a, b) { return a - b; });

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

            vps_cloud_arr.sort(function (a, b) { return a - b; });

            return vps_cloud_arr[0];
        })
        .catch(err => console.log(err));


    const minVpsPrice = await await models.VpsHostingPlan.findAll()
        .then(result => {
            var vps_arr = [];
            result.forEach((item) => {
                vps_arr.push(parseFloat(item.final_cost));
            });

            vps_arr.sort(function (a, b) { return a - b; });

            return vps_arr[0];
        })
        .catch(err => console.log(err));


    const minDedicatedServerPrice = await models.DedicatedHostingPlan.findAll()
        .then(result => {
            var ded_arr = [];
            result.forEach((item) => {
                ded_arr.push(parseFloat(item.final_cost));
            });

            ded_arr.sort(function (a, b) { return a - b; });

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
    var sharedHostingPlans = await models.SharedHostingPlan.findAll()
        .then(result => {
            var plans = {};
            result.forEach((item) => {
                var slugified_name = slugify(item.product_name);
                var finalCost = parseFloat(item.final_cost);
                var monthly_cost = finalCost / 12;
                plans[slugified_name] = {
                    name: item.my_custom_product_name,
                    monthly_cost: monthly_cost,
                    cost: finalCost,
                    features: {
                        diskspace: item.diskspace,
                        bandwith: item.bandwith,
                        dedicatedIp: item.dedicated_ip,
                        backups: item.backups,
                        hostedDomains: item.hosted_domains,
                        subDomains: item.sub_domains,
                        emailAccounts: item.email_accounts,
                        emailPerHour: item.email_per_hour
                    }
                };
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/?shared_hosting`;

    res.render('shared-web-hosting', {
        sharedHostingPlans,
        billingURL
    });
});


router.get('/vps', async function (req, res) {
    var vpsHostingPlans = await models.VpsHostingPlan.findAll()
        .then(result => {
            var plans = [];
            result.forEach((item) => {
                var slugified_name = slugify(item.product_name);
                plans.push({
                    name: item.product_name,
                    cost: item.final_cost,
                    features: {
                        cores: item.cores,
                        ram: item.ram,
                        diskspace: item.diskspace,
                        bandwidth: item.bandwidth,
                        dedicatedIp: item.dedicated_ip,
                        mbit: item.mbit
                    }
                });
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/`;

    res.render('vps', {
        vpsHostingPlans,
        billingURL
    });

});


router.get('/vps-cloud', async function (req, res) {
    var vpsCloudHostingPlans = await models.VpsCloudHostingPlan.findAll()
        .then(result => {
            var plans = [];
            result.forEach((item) => {
                var slugified_name = slugify(item.product_name);
                plans.push({
                    name: item.product_name,
                    cost: item.final_cost,
                    features: {
                        cores: item.cores,
                        ram: item.ram,
                        diskspace: item.diskspace,
                        bandwidth: item.bandwidth,
                        dedicatedIp: item.dedicated_ip
                    }
                });
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/`;

    res.render('vps-cloud', {
        vpsCloudHostingPlans,
        billingURL
    });

});

router.get('/ded', async function (req, res) {
    var dedicatedHostingPlans = await models.DedicatedHostingPlan.findAll()
        .then(result => {
            var plans = [];
            result.forEach((item) => {
                plans.push({
                    name: item.my_custom_product_name,
                    cost: item.final_cost,
                    features: {
                        cores: item.cores,
                        ram: item.ram,
                        diskspace: item.diskspace,
                        bandwidth: item.bandwidth,
                        dedicatedIp: item.dedicated_ip,
                        ghz: item.ghz,
                        mbit: item.mbit
                    }
                });
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/`;

    res.render('ded', {
        dedicatedHostingPlans,
        billingURL
    });

});


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


router.get('/addons', async function (req, res) {
    var addons = await models.Addon.findAll()
        .then(result => {
            var addons = [];
            result.forEach((item) => {
                addons.push({
                    name: item.addon_type,
                    cost: item.cost,
                    features: item.features,
                    term: item.term
                });
            });
            return addons;
        })
        .catch(err => console.log(err));
    console.log(addons);
    res.render('addons', {
        addons
    });
});


router.get('/whois-checker', (req, res) => {
    res.render('whois-checker')
});

router.post('/whois-checker', async function (req, res) {

    try {
        domain = req.body.domain;

        if (validateUrl(domain)) {
            const res = await axios.get(`https://api.promptapi.com/whois/query?domain=${domain}`, {
                headers: {
                    'apikey': '5PZcpN8wj5LWfumzEA8IziBTk4Whwmd6'
                }
            });

            data = res.data.result;
        } else {
            data = null;
        }

    } catch (error) {
        console.error(error);
    }



    res.render('whois-checker', {
        data
    });
});


//Legal Section Routes
router.get('/privacy-policy', (req, res) => res.render('legal/privacy-policy'));
router.get('/refund-policy', (req, res) => res.render('legal/refund-policy'));
router.get('/aup', (req, res) => res.render('legal/aup'));

router.get('/contact-us', (req, res) => res.render('contact-us'));
router.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body;
    let errors = [];

    console.log("Name: ", name);
    console.log("email: ", email);
    console.log("message: ", message);

    if (!Boolean(name) || !Boolean(email) || !Boolean(message)) {
        errors.push({ msg: "All fields are required" });
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
    });

    var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    if (errors.length > 0) {
        res.render('contact-us', {
            errors,
            name,
            email,
            message
        });
    } else {
        req.flash(
            'success_msg',
            'Successfully submitted. We will get back to you soon.'
        );
        res.redirect('contact-us');
    }

    return res.render('contact-us', {
        errors
    });
});

module.exports = router;