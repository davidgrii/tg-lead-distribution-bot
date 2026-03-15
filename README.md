# tg-requests-bot-manager

A Telegram bot system for automated lead routing from multiple websites to dedicated manager channels, with round-robin distribution, status tracking, and Excel export.

## Overview

Built for a client with three product categories (ATVs, snowmobiles, mini tractors). Each category has its own bot and two dedicated Telegram channels (one per manager). Leads from websites are automatically routed between managers in equal rotation.

**Key features:**
- Round-robin lead distribution between managers per category
- Per-category bots — leads from ATV site go only to ATV channels
- Customers can share their Telegram contact directly in the bot after submitting a form
- Managers can mark each lead with inline buttons: `Contacted` / `Duplicate` / `Declined`
- Admin command to export all leads as an Excel file
- All leads stored in MongoDB

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Bot framework | grammY |
| Web server | Express 5 |
| Database | MongoDB + Mongoose |
| Export | Excel generation |

## Architecture

```
Website form submit
       │
       ▼
  Express webhook
       │
       ▼
 Lead Router Service
  ├── Category detection (ATV / Snowmobile / Tractor)
  └── Round-robin assignment → Manager Channel A or B
       │
       ▼
  Telegram Channel
  └── Inline buttons: Contacted / Duplicate / Declined
       │
       ▼
  MongoDB (lead status updates)
```

## Project Structure

```
src/
├── bots/          # Per-category bot instances
├── routes/        # Express webhook endpoints
├── services/      # Lead routing, round-robin logic
├── models/        # MongoDB schemas (Lead, Manager, Category)
└── server.ts      # Entry point
```

## Environment Variables

```env
# Database
DB_URL=

# Bot tokens (per category)
MINITRAKKTORY_BOT_TOKEN=
SNEGOHODY_BOT_TOKEN=
KVADROCIKLY_BOT_TOKEN=
ADMIN_BOT_TOKEN=

# Telegram channel URLs
TG_CHANNEL_KVADROCIKLY_URL=
TG_CHANNEL_SNEGOHODY_URL=
TG_CHANNEL_MINITRAKTORY_URL=

# Channel IDs (round-robin distribution)
CHANNEL_MINITRAKKTORY_PART_1=
CHANNEL_MINITRAKKTORY_PART_2=
CHANNEL_KVADROCIKLY_PART_1=
CHANNEL_KVADROCIKLY_PART_2=
CHANNEL_SNEGOHODY_PART_1=
CHANNEL_SNEGOHODY_PART_2=

# Admin
ADMIN_IDS=
PORT=
```

## Getting Started

```bash
npm install
cp .env.example .env
# fill in your values
npm run dev
```

## Notes

This is a real client project. The repository contains the full source with sensitive credentials removed. Built and deployed solo — architecture, bot logic, and database design by me.
```