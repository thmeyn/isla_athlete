#!/usr/bin/env node
// Build calendar.ics — the subscribable feed of Isla's meets — from
// data/schedule.json. Served at https://islameyn.com/calendar.ics;
// the venue-lookup workflow regenerates it whenever the schedule changes.
//
// Confirmed events only (tentative ones join the feed once their status
// flips to upcoming). UIDs are stable (date + meet name) so edits update
// subscribers' copies instead of duplicating them.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const events = JSON.parse(readFileSync(join(ROOT, 'data', 'schedule.json'), 'utf8'));

const esc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// RFC 5545 wants content lines under 75 octets; fold conservatively so
// multi-byte characters keep us under the limit.
const fold = line => {
    const out = [];
    while (line.length > 60) {
        out.push(line.slice(0, 60));
        line = ' ' + line.slice(60);
    }
    out.push(line);
    return out.join('\r\n');
};

const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//islameyn.com//Meet Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Isla Meyn – Meet Schedule',
    'X-WR-CALDESC:Upcoming meets for Isla Meyn\\, Class of 2028 distance runner\\, Highlands High School',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H'
];

for (const event of events) {
    if (event.status === 'tentative' || !event.date) continue;
    const start = event.date.replace(/-/g, '');
    const endDate = new Date(event.date + 'T12:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const pad = n => String(n).padStart(2, '0');
    const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}`;

    const place = event.venue || event.location || '';
    const details = `${event.sport} meet — Isla Meyn, Highlands High School, Class of 2028.` +
        (event.link ? `\nMeet info: ${event.link}` : '') +
        `\n\nContact: isla.meyn@gmail.com` +
        `\nNCAA ID: 2607988649` +
        `\nAthlete profile: https://islameyn.com` +
        `\nMileSplit: https://ky.milesplit.com/athletes/15029501-isla-meyn` +
        `\nSchedule: https://islameyn.com/schedule.html`;

    lines.push(
        'BEGIN:VEVENT',
        `UID:${event.date}-${encodeURIComponent(event.eventName).replace(/%/g, '')}@islameyn.com`,
        `DTSTAMP:${start}T000000Z`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${esc(`${event.eventName} – Isla Meyn`)}`,
        `LOCATION:${esc(place)}`,
        `DESCRIPTION:${esc(details)}`,
        event.link ? `URL:${event.link}` : '',
        'END:VEVENT'
    );
}

lines.push('END:VCALENDAR');

writeFileSync(join(ROOT, 'calendar.ics'), lines.filter(Boolean).map(fold).join('\r\n') + '\r\n');
console.log(`calendar.ics written (${events.filter(e => e.status !== 'tentative' && e.date).length} events)`);
