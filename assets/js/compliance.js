import * as CookieConsent from '/assets/js/cookieconsent.esm.js';

// Consent popup configuration
const Requirement = Object.freeze({
    OptIn: 'opt-in',
    OptOut: 'opt-out',
    Inform: 'inform'
});
const revision = 1; // Increment this number when the cookie policy or privacy policy changes
let requirement = Requirement.OptIn;

// Get the user's location for the purpose of tailoring the consent popup
let isError = false;
let isEU = false;
let country = '';
let region = '';

const locationInfoKey = 'locationInfo';
const oneDayMilliseconds = 24 * 60 * 60 * 1000;
let useStored = false;
const stored = localStorage.getItem(locationInfoKey);

// Use the stored location data if exists and was created within the last 24 hours
if (stored) {
    try {
        const info = JSON.parse(stored);
        if (info.timestamp && (Date.now() - info.timestamp < oneDayMilliseconds)) {
            isEU = info.isEU === true;
            country = info.country;
            region = info.region;
            useStored = true;
        }
    } catch (e) {
        // Ignore parse errors
    }
}
// If the stored data does not exist or is too old, get the user's location
if (!useStored) {
    await fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            isEU = data.in_eu;
            country = data.country;
            region = data.region_code;
            localStorage.setItem(locationInfoKey, JSON.stringify({
                isEU,
                country,
                region,
                timestamp: Date.now()
            }));
        })
        .catch(error => {
            isError = true;
            console.error('Error fetching user location:', error);
        });
}

// DEBUG
// isError = false;
// isEU = false;
// country = 'GB';
// region = 'NA';

// Tailor the consent popup based on the user's location
const optInCountries = ['GB', 'AD', 'AR', 'AM', 'BR', 'CA', 'CL', 'CN', 'CO', 'IS', 'IN', 'ID', 'JP', 'MY', 'MA', 'NZ', 'NO', 'PH', 'QA', 'RU', 'SA', 'ZA', 'KR', 'LK', 'TW', 'TH', 'AE', 'VN'];
const optOutCountries = ['AU', 'HK', 'MX', 'SG', 'CH'];

if (isError) {
    // If there was an error fetching the user's location, default to opt-in consent
    requirement = Requirement.OptIn;
}
else if (isEU) {
    // EU requires opt-in consent
    requirement = Requirement.OptIn;
}
else if (optInCountries.includes(country)) {
    // Countries that require opt-in consent
    requirement = Requirement.OptIn;
}
else if (optOutCountries.includes(country)) {
    // Countries that require opt-out consent
    requirement = Requirement.OptOut;
}
else if (country === 'US' && region === 'CA') {
    // California requires opt-out consent
    requirement = Requirement.OptOut;
}
else {
    // All other countries require informing the user
    requirement = Requirement.Inform;
}

// If requirement isn't opt-in, we can initialize analytics right away
if (requirement !== Requirement.OptIn) {
    informClarityOfConsentChange(true);
}

// If the requirement is 'Inform', we will not show the consent popup
if (requirement !== Requirement.Inform) {
    // Show the consent popup
    // Config reference: https://cookieconsent.orestbida.com/reference/configuration-reference.html
    CookieConsent.run({
        mode: requirement === Requirement.OptOut ? 'opt-out' : 'opt-in',
        revision: revision,
        categories: {
            necessary: {
                enabled: true,
                readOnly: true,
            },
            analytics: {
                enabled: requirement === Requirement.OptOut
            }
        },
        language: {
            default: 'en',
            translations: {
                'en': '/assets/data/cookieconsent.en.json'
            }
        },
        // Intentionally not listening to onFirstConsent since onChange is triggered whenever the user changes their preferences, including from the default.
        // This means that if the user makes a choice that lines up with the default, we will not log it.
        // Subsequent changes will be logged. This is the intended behavior.
        onChange: () => {
            onConsentChanged();
        }
    });
}

/**
 * Triggered whenever the user changes their consent preferences.
 * Logs the consent data to the server for compliance reasons and informs Clarity of the change.
 */
function onConsentChanged() {
    // Get or create a session ID
    const sessionIdKey = 'sessionId';
    let sessionId = localStorage.getItem(sessionIdKey);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(sessionIdKey, sessionId);
    }

    // Get the user's consent preferences
    const preferences = CookieConsent.getUserPreferences();
    const acceptingAnalytics = preferences.acceptedCategories.includes('analytics');

    // Inform Clarity of the user's consent preferences
    informClarityOfConsentChange(acceptingAnalytics);

    // Get the user's device info from the user agent string
    const deviceInfo = new UAParser().getResult();

    // Send the consent data to the server (required for compliance with regulations like GDPR and CCPA)
    fetch('https://cookieconsentfunction.azurewebsites.net/api/CookieConsent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Id: sessionId,
            // If we add more categories, Consenting should be updated to be true if any category is accepted (besides necessary)
            Consenting: acceptingAnalytics,
            CookiePolicyVersion: revision,
            AnalyticsAllowed: acceptingAnalytics,
            CountryCode: country,
            // Only send the region code if the country is US since it isn't relevant for other countries
            RegionCode: country == "US" ? region : null,
            Browser: deviceInfo.browser.name,
            OperatingSystem: deviceInfo.os.name
        })
    });
}

/**
 * Inform Clarity about the user's consent preferences so that it can expand or limit its operations accordingly.
 * @param {boolean} consenting - True if the user has consented to analytics, false otherwise.
 */
function informClarityOfConsentChange(consenting) {
    window.clarity('consentv2', {
        ad_Storage: "denied", // We do not use Clarity for ads, so always deny this
        analytics_Storage: consenting ? "granted" : "denied" // Set based on user consent
    })
}

// If the consent summary is on the page, update it with the current information
const consentSummary = document.getElementById('consent-summary');

if (consentSummary) {
    const preferences = CookieConsent.getUserPreferences();
    const acceptedAnalytics = preferences.acceptedCategories.includes('analytics');

    if (isError) {
        consentSummary.innerHTML = `
            <p>There was an issue getting your location, so we will not collect your data or use cookies without your consent.</p>
            <p><strong>Opted Into Analytics:</strong> ${acceptedAnalytics ? 'Yes' : 'No'}</p>`;
        
        const preferencesButton = document.createElement('button');
        preferencesButton.type = 'button';
        preferencesButton.innerText = 'Change Preferences';
        preferencesButton.addEventListener('click', () => {
            CookieConsent.showPreferences();
        });
        consentSummary.appendChild(preferencesButton);
    }
    else if (requirement === Requirement.OptIn) {
        consentSummary.innerHTML = `
            <p>You are in a country that requires opt-in consent for analytics and cookies (${country}).</p>
            <p><strong>Opted Into Analytics:</strong> ${acceptedAnalytics ? 'Yes' : 'No'}</p>`;

        const preferencesButton = document.createElement('button');
        preferencesButton.type = 'button';
        preferencesButton.innerText = 'Change Preferences';
        preferencesButton.addEventListener('click', () => {
            CookieConsent.showPreferences();
        });
        consentSummary.appendChild(preferencesButton);
    }
    else if (requirement === Requirement.OptOut && country === 'US' && region === 'CA') {
        consentSummary.innerHTML = `
            <p>You are in a US state that allows you to opt-out of analytics and cookies (${region}).</p>
            <p><strong>Opted Out of Analytics:</strong> ${acceptedAnalytics ? 'No' : 'Yes'}</p>`;

        const preferencesButton = document.createElement('button');
        preferencesButton.type = 'button';
        preferencesButton.innerText = 'Change Preferences';
        preferencesButton.addEventListener('click', () => {
            CookieConsent.showPreferences();
        });
        consentSummary.appendChild(preferencesButton);
    }
    else if (requirement === Requirement.OptOut) {
        consentSummary.innerHTML = `
            <p>You are in a country that allows you to opt-out of analytics and cookies (${country}).</p>
            <p><strong>Opted Out of Analytics:</strong> ${acceptedAnalytics ? 'No' : 'Yes'}</p>`;

        const preferencesButton = document.createElement('button');
        preferencesButton.type = 'button';
        preferencesButton.innerText = 'Change Preferences';
        preferencesButton.addEventListener('click', () => {
            CookieConsent.showPreferences();
        });
        consentSummary.appendChild(preferencesButton);
    }
    else if (country === 'US') {
        consentSummary.innerHTML = `
            <p>You are in a US state that does not require consent for analytics and cookies (${region}).</p>
            <p><strong>Analytics Enabled:</strong> Yes</p>`;
    }
    else {
        consentSummary.innerHTML = `
            <p>You are in a country that does not require consent for analytics and cookies (${country}).</p>
            <p><strong>Analytics Enabled:</strong> Yes</p>`;
    }
}
