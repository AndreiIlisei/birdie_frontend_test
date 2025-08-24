# Frontend Developer Technical Assessment

## Overview
Transform this Next.js insights application from mock data to real API connections. You have **2 hours** to demonstrate your frontend development skills and problem solving.


## Current State
- **Functional UI** with mock data
- **TypeScript + Next.js 15.3.2** 
- **Your task**: Connect to real APIs and enhance the user experience
- **API Url**: Placed as API_FACTSHEET in .env.local


## Assignment
Replace the mock implementation with performant API integration. Focus on:

1. **API Integration** - Connect `src/services/insights.service.ts` to real endpoints. Feel free to use the template pattern outlined in `src/app/api/insight` or another
2. **Data Fetching** - Implement your preferred data fetching strategy 
3. **User Experience** - Add loading states, error handling, and UI improvements
4. **Performance** - Optimize for real-world usage patterns


## Available Resources
- **External API**: http://n484a0c8oog4kogwwccc880w.91.99.109.140.sslip.io:3000/docs#/
  - `GET /api/v1/data_group/` - Get data groups
  - `GET /api/v1/fact_sheet/` - Get fact sheets  
  - `GET /api/v1/fact_sheet/{fact_sheet_id}` - Get specific fact sheet

- **Current Implementation**: Check `src/services/insights.service.ts` for mock data structure
- **API Routes**: Placeholder endpoints in `src/app/api/insight/**/route.ts` (optional to implement)


## Page-to-API Mapping
These are the pages used in the insights application and the API enpoints used in each page.

### `/insights` (Main Insights Page)
**Purpose:** Display overview of all data groups with counts

**API Endpoint Used:**
- `GET /api/insight/data-group?offset=0&limit=100&user_id=1`
  - Fetches all data groups for the overview cards

---

### `/insights/[alias-group]` (Data Group Detail Page)  
**Purpose:** Show all fact sheets within a specific data group

**API Endpoint Used:**
- `GET /api/insight/fact-sheet?offset=0&limit=100&data_group_id={foundGroupId}`
  - Gets all fact sheets for the specific data group

---

### `/insights/[alias-group]/[id]` (Fact Sheet Detail Page)
**Purpose:** Display detailed view of a single fact sheet

**API Endpoints Used:**
- `GET /api/insight/fact-sheet?id={id}&user_id=1`
  - Gets specific fact sheet details by ID

---

So the user path from: 
1. /insights --> 
2. /insights/group_1 --> 
3. /insights/group_1/fact_sheet_1 

Uses the following endpoint calls: 
1. /api/v1/data_group/?offset=0&limit=100&user_id=1 
2. /api/v1/fact_sheet/?user_id=1&offset=0&limit=100&data_group_id=29
3. /api/v1/fact_sheet/47?user_id=1


## Getting Started
1. `npm install && npm run dev`
2. Visit `http://localhost:3000/insights`
3. Explore the current functionality and plan your approach

## What We're Looking For
- **Problem-solving approach** and technical decision-making
- **Real API integration** with proper error handling
- **Performance considerations** for production use
- **Code quality** and modern React patterns

---
* We're excited to see your approach! *