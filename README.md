# 🏢 Apartment Household Management

A simple web application to manage apartments, households, residents, and daily building operations.

---

## 🗺️ System Overview

Here is the functional mindmap of the system:

![System Mindmap](./image.png)

---

## ⭐ Main Features

The system has **7 main modules**. The highlighted items (**⭐**) are the core parts:

### 1. 🏢 Apartments & Buildings
- **⭐ Manage Apartments**: Room number, size, floor, and current status (*empty, rented, living*).
- **⭐ Manage Owners**: Owner contact and legal documents.
- Manage building and floor information.

### 2. 👨‍👩‍👧‍👦 Households
- Create and update household profiles.
- Manage the head of the household.
- **⭐ Manage Family Members**: Keep track of people living together in each home.

### 3. 👤 Residents (Core)
- **⭐ Personal Info**: Full name, Citizen ID, birthday, gender, and contact details.
- **⭐ Resident Status**: Check who is currently living here, moved out, or temporarily away.
- Relationship to the household head (spouse, child, tenant, etc.).

### 4. 📋 Move-in & Stay Tracking
- Register move-ins and move-outs.
- Report temporary stays (*tạm trú*) and absences (*tạm vắng*).

### 5. 🚗 Vehicles & Parking
- Register cars, motorbikes, and bicycles.
- Manage license plates and parking slots.

### 6. 💰 Bills & Payments
- Calculate monthly fees (management, parking, water, electricity).
- Create invoices and track paid or unpaid bills.

### 7. 📢 Resident Feedback
- Receive questions and complaints (noise, repairs, cleaning).
- Assign staff to fix issues and reply to residents.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

---

## 🚀 Quick Start

### 1. Install packages
```bash
npm install
```

### 2. Run the app
```bash
npm run dev
```

### 3. Open in browser
Visit **[http://localhost:3000](http://localhost:3000)**.
