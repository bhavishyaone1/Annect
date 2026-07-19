# 🌐 Annect - Real-Time Perishable Food Redistribution Network

Annect is an AI-powered, sensor-validated surplus food redistribution network designed to connect commercial kitchens (hotels, caterers, corporate canteens, wholesale markets) with nearby recipient hunger shelters under strict FSSAI food safety parameters.

---

## 📖 The Vision
Perishable hot cooked foods are typically discarded by banquet halls and canteens due to a lack of immediate, safe logistics channels. Annect serves as a unified digital coordinator that matches donor surplus with shelter demand in real-time, validating freshness via simulated temperature parameters and facilitating instant volunteer courier dispatches.

---

## 🛠️ Project Structure & Architecture
- **[index.html](file:///c:/Users/bhavishya/Downloads/project/food/index.html)**: The application entry point. Loads Lora (serif headers) and Inter (sans-serif body) typography and hooks the React DOM mount root.
- **[src/App.jsx](file:///c:/Users/bhavishya/Downloads/project/food/src/App.jsx)**: Core application module. Coordinates stats collections, FSSAI temperature sliding calculations, ESG carbon algorithms, SVG route coordinates, and the conversational assistant.
- **[src/index.css](file:///c:/Users/bhavishya/Downloads/project/food/src/index.css)**: Tailored design system styling variables, glassmorphic filters, Vercel-style card hover glow shaders, and extensive responsive media queries.
- **[vite.config.js](file:///c:/Users/bhavishya/Downloads/project/food/vite.config.js)**: Configures Vite compiler plugins and declares relative base outputs (`./`) to support portable builds.

---

## 🚀 Key Interactive Simulators

### 🌡️ FSSAI Thermal Safety Buffer
Simulates temperature diagnostics:
- **Hot-Chain Perishables**: Must be kept above **60°C** and distributed within **2 hours** of preparation.
- **Cold-Chain Items**: Must stay below **5°C**.
- *Adjusting the temperature slider in Card 1 dynamically updates freshness safety status badges (Safe, Caution, or Hazard).*

### 🌍 Carbon Offset Estimator
- Adjust the weekly weight slider in Card 2 to estimate CO₂ emission offsets, equivalent trees planted, and municipal carbon tax savings.

### 🗺️ SVG Route Tracker
- Swap routes using the select dropdown in Card 3. Watch vector map lines, courier details, and ETAs update in real-time.

### 📈 Volunteer XP Chart
- Card 4 renders dynamic line charts (ChartJS) mapping volunteer XP histories and achievement milestones.

### 💬 Conversational AI Assistant
- Locate the floating help bubble in the bottom right. Type questions about `"safety"`, `"tax benefits"`, `"volunteering"`, or `"compliance"` to receive instant advice.

---

## 🖼️ Photography Assets & Sourcing (Unsplash Commercial License)
All graphics and card previews utilize free, commercially-licensed photography with no attribution required:
- **Cooked Paneer Curry Preset** (`/paneer_curry.png`): [Jeevan Singla on Unsplash](https://unsplash.com/photos/h5j4s_O2k5s)
- **Bakery Surplus Preset** (`/bakery_surplus.png`): [Mariana Kurnyk on Unsplash](https://unsplash.com/photos/Clf4d7T7e54)
- **Mandi Fresh Vegetables Preset** (`/mandi_vegetables.png`): [Piyush Kaushal on Unsplash](https://unsplash.com/photos/p_oH4m9k9sY)
- **Packed Meal Packets Preset** (`/packed_meals.png`): [Nathan Dumlao on Unsplash](https://unsplash.com/photos/vC_n6n9K_sQ)
- **Hero Watermark Background** (`/hero_background.jpg`): [Sidekix Media on Unsplash](https://unsplash.com/photos/MSxwG91v5yU)
- **About/Shelter Volunteers Banner** (`/about_shelter.jpg`): [Larm Rmah on Unsplash](https://unsplash.com/photos/wy_L8W0zgwg)

> [!TIP]
> All images have been desaturated, scaled to 600px, and compressed below **150kb (WebP/JPEG)** to ensure rapid, latency-free mobile viewport loads.
> Every image tag is wrapped in a custom React `handleImageError` handler that generates a colored placeholder block (using design tokens and emojis) in case of asset delivery failure.

---

## 🔍 Global Search Command Palette (Try Typing These!)
The search input in the fixed header acts as a universal command center. Try typing:
- **Navigation Scrolls**: `home` (scrolls to Hero), `timeline` (scrolls to steps), `impact` (scrolls to charts), `about` (scrolls to vision), `pitch-deck` (scrolls to investor deck).
- **Setup Portals**: `donate` (opens donation scanner), `register-donor` (opens business registration), `register-ngo` (opens shelter joining forms), `volunteer` (opens volunteer registry), `supervisor` (opens admin login).
- **Shelter Profiles**: `mcf` (opens MCF shelter profile), `children` (opens Children Foundation data), `migrant` (opens Labor Camp stats).

---

## 💻 Developer Installation & Commands

### Prerequisites
Install [Node.js](https://nodejs.org/) (includes npm).

### 1. Clone & Go to Project root
```bash
cd c:/Users/bhavishya/Downloads/project/food
```

### 2. Install Packages
```bash
npm install
```

### 3. Start Development Server
Starts local dev server with HMR:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build Production Distribution
Compiles compressed assets inside `dist/` with relative mappings:
```bash
npm run build
```
The output directory can be dragged and dropped into Netlify or Vercel for instant deployment.
