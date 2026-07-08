#!/usr/bin/env node
// Enrich data/schedule.json with venue addresses from MileSplit.
//
// For each upcoming event that has a MileSplit `link` and no `venue` yet:
//   1. meet page JSON-LD  -> venue name + city/state
//   2. linked venue page  -> street address ("Address:" block)
// Writes `venue` back to the event, e.g.
//   "Tom Sawyer State Park, 3000 Freys Hill Rd, Louisville, KY 40241"
// Falls back to "VenueName, City, ST" when the venue page has no address.
//
// Exits 0 with "FAILED:" lines on stdout for events it could not resolve;
// the venue-lookup workflow turns those into a GitHub issue.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SCHEDULE = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'schedule.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function fetchText(url) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
}

function jsonLd(html) {
    for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
        try {
            const data = JSON.parse(m[1]);
            if (data['@type'] === 'SportsEvent') return data;
        } catch { /* skip malformed blocks */ }
    }
    return null;
}

async function lookupVenue(meetUrl) {
    const meetHtml = await fetchText(meetUrl);
    const ld = jsonLd(meetHtml);
    const place = ld?.location;
    const name = place?.name?.trim();
    if (!name) throw new Error('no venue name in meet page JSON-LD');
    const city = place.address?.addressLocality?.trim();
    const region = place.address?.addressRegion?.trim();

    const cityState = city && region ? `${city}, ${region}` : null;

    // Venue page carries the street address the meet page lacks
    const venueLink = meetHtml.match(/href="(https?:\/\/[a-z]+\.milesplit\.com\/venues\/\d+[^"]*)"/)?.[1];
    if (venueLink) {
        try {
            const venueHtml = await fetchText(venueLink);
            const address = venueHtml.match(/<strong>Address:<\/strong>\s*([^<]+?)\s*<\/p>/)?.[1]?.trim();
            if (address) return { venue: `${name}, ${address}`, cityState };
        } catch { /* fall through to city/state */ }
    }
    if (cityState) return { venue: `${name}, ${cityState}`, cityState };
    throw new Error('venue page has no address and meet page has no city/state');
}

const events = JSON.parse(readFileSync(SCHEDULE, 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const failures = [];
let changed = false;

for (const event of events) {
    if ((event.venue && event.location) || !event.link || (event.date && event.date < today)) continue;
    if (!/milesplit\.com\/meets\//.test(event.link)) continue;
    try {
        const { venue, cityState } = await lookupVenue(event.link);
        if (!event.venue) event.venue = venue;
        if (!event.location && cityState) event.location = cityState;
        changed = true;
        console.log(`OK: ${event.eventName} -> ${event.venue}`);
    } catch (err) {
        failures.push(`${event.eventName} (${event.date}): ${err.message} [${event.link}]`);
    }
}

if (changed) {
    writeFileSync(SCHEDULE, JSON.stringify(events, null, 2) + '\n');
    console.log('schedule.json updated');
}
for (const f of failures) console.log(`FAILED: ${f}`);
