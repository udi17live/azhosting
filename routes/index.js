const express = require('express');
const resellerPanelURL = process.env.RESELLER_HOSTING_URL;
const axios = require('axios').default;
const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
const fetch = require('node-fetch');

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
            var domains_arr = [];
            domains_recieved.forEach((item) => {
                domains_arr.push({
                    tld: item.tld,
                    cost: item.final_cost
                });
            });

            return domains_arr;
        })
        .catch(err => console.log(err));

    var minDomainCost = await models.Domain.findAll()
        .then(domains_recieved => {
            var domains_arr = [];
            domains_recieved.forEach((item) => {
                domains_arr.push(parseFloat(item.final_cost).toFixed(2));
            });

            domains_arr.sort(function (a, b) { return a - b; })
            return domains_arr[0];
        })
        .catch(err => console.log(err));

    var minSharedHostingPrice = await models.SharedHostingPlan.findAll()
        .then(result => {
            var sh_arr = [];
            result.forEach((item) => {
                sh_arr.push(parseFloat(item.final_cost).toFixed(2));
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
                vps_cloud_arr.push(parseFloat(item.final_cost).toFixed(2));
            });

            vps_cloud_arr.sort(function (a, b) { return a - b; });

            return vps_cloud_arr[0];
        })
        .catch(err => console.log(err));


    const minVpsPrice = await await models.VpsHostingPlan.findAll()
        .then(result => {
            var vps_arr = [];
            result.forEach((item) => {
                vps_arr.push(parseFloat(item.final_cost).toFixed(2));
            });

            vps_arr.sort(function (a, b) { return a - b; });

            return vps_arr[0];
        })
        .catch(err => console.log(err));


    const minDedicatedServerPrice = await models.DedicatedHostingPlan.findAll()
        .then(result => {
            var ded_arr = [];
            result.forEach((item) => {
                ded_arr.push(parseFloat(item.final_cost).toFixed(2));
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
            var plans = [];
            result.forEach((item) => {
                var slugified_name = slugify(item.product_name);
                var finalCost = parseFloat(item.final_cost).toFixed(2);
                var monthly_cost = parseFloat(finalCost / 12).toFixed(2);
                var costWhenPaidMonthly = item.monthly_cost * 12;
                var diffOfMonthlyAnnualCost = costWhenPaidMonthly - finalCost
                var save_percentage = parseInt((diffOfMonthlyAnnualCost/costWhenPaidMonthly) * 100);
                plans.push({
                    name: item.my_custom_product_name,
                    annual_monthly_cost: monthly_cost,
                    cost: finalCost,
                    monthly_cost: item.monthly_cost,
                    save_percentage: save_percentage,
                    features: {
                        diskspace: item.diskspace,
                        bandwidth: item.bandwidth,
                        dedicatedIp: item.dedicated_ip,
                        backups: item.backups,
                        hostedDomains: item.hosted_domains,
                        subDomains: item.sub_domains,
                        emailAccounts: item.email_accounts,
                        emailPerHour: item.email_per_hour
                    }
                });
            });
            return plans;
        })
        .catch(err => console.log(err));

    const billingURL = `${resellerPanelURL}/bill/?shared_hosting`;

    res.render('shared-web-hosting', {
        sharedHostingPlans,
        billingURL,
        title: 'Shared Web Hosting'
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
        billingURL,
        title: 'VPS Hosting'
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
        billingURL,
        title: 'Cloud VPS Hosting'
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
        billingURL,
        title: 'Dedicated Servers'
    });

});


router.get('/domain-pricing', async function (req, res) {
    var domains = await models.Domain.findAll()
        .then(domains_recieved => {
            return domains_recieved;
        })
        .catch(err => console.log(err));

    var domain_fiters = ["com", "org", "store", "xyz"];

    var selected_domains = domains.filter(function (domain) {
        if (domain_fiters.includes(domain.tld)) {
            // console.log(domain);
            return true;
        }

        return false;
    });

    // console.log(selected_domains);

    res.render('domain-pricing', {
        domains,
        selected_domains,
        title: 'Domain Pricing'
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
    res.render('addons', {
        addons,
        title: 'Addons'
    });
});


router.get('/whois-checker', (req, res) => {
    res.render('whois-checker', {
        title: 'WHOIS Checker'
    });
});

router.post('/whois-checker', async function (req, res) {
    // @todo: To be implemented;
});


//Legal Section Routes
router.get('/privacy-policy', (req, res) => res.render('legal/privacy-policy',{title: 'Privacy Policy'}));
router.get('/refund-policy', (req, res) => res.render('legal/refund-policy',{title: 'Refund Policy'}));
router.get('/aup', (req, res) => res.render('legal/aup',{title: 'Acceptable Use Policy'}));

router.get('/contact-us', (req, res) => res.render('contact-us',{title: 'Contact Us'}));
router.post('/contact-us', async function (req, res) {

    return res.json({ success: false, msg: 'An unknown error occured. Please reachout to us by sending an email to hello@azpirehosting.com or login to your Panel via https://panel.azpire-hosting.com/login to open a support ticket. This will be fixed soon. We appologize for any inconvenience caused' });

    const { name, email, phoneNumber, subject, message, captcha } = req.body;
    
    if (!req.body.captcha){
        return res.json({ success: false, msg: 'Please select captchaa' });
    }

    // reCaptcha Validation
    // Secret key
    const recaptchaSecretKey = process.env.RECAPTCHA_SITE_SECRET;

    const query = `secret=${recaptchaSecretKey}&response=${captcha}`;
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    
    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(res => res.json());

    // If not successful
    if (body.success !== undefined && !body.success)
        return res.json({ success: false, msg: 'Failed reCaptcha verification' });

    // Email Sending   

    let errors = 0;

    var text_body = "name=" + name + "&email=" + email + "&msg_subject=" + subject + "&phone_number=" + phoneNumber + "&message=" + message;

    var html_body = await fetch('https://cdn.jsdelivr.net/gh/udi17live/azpire-cdn/email_templates/contact-form-template.html')
        .then(response => response.text())
        .then(html => {
            var replace_data_var = ["name", "email", "phone_number", "msg_subject", "message"];
            var replace_data_with = [name, email, phoneNumber, subject, message];

            for (var i = 0; i < replace_data_var.length; i++) {
                html = html.replace(new RegExp('{{' + replace_data_var[i] + '}}', 'gi'), replace_data_with[i]);
            }

            return html;
        });

    environment = typeof process.env.NODE_ENV === 'undefined' ? "development" : process.env.NODE_ENV;

    var payload = {
        "SandboxMode": environment === 'production' ? false: true,
        "Messages": [
            {
                "From": {
                    "Email": "forms@azpirehosting.com",
                    "Name": "CF from Azpire Hosting"
                },
                "To": [
                    {
                        "Email": "hello@azpirehosting.com",
                        "Name": "Azpire Hosting Client"
                    }
                ],
                "Subject": subject,
                "TextPart": text_body,
                "HTMLPart": html_body
            }
        ]
    }

    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request(payload);

    await request
        .then((result) => {
            console.log(result.body);
            if (result.body.Messages[0].Status === 'success') {
                success_msg = "Form Submitted Successfully"
            } else {
                errors = 1;
            }
        })
        .catch((err) => {
            errors = 1;
        })

    error_msg = "Failed to send form. Please try again";

    successStatus = errors === 0 ? true : false;
    msg = successStatus === false ? error_msg : success_msg;

    return res.json({ success: successStatus, msg: msg });
});

router.get('/freq-ask-q', (req, res) => res.render('faq',{title: 'Frequently Asked Questions (FAQ) '}));
router.get('/about-us', (req, res) => res.render('about-us',{title: 'About Us'}));

module.exports = router;