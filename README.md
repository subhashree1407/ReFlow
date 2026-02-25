# ReFlow — Smart Reverse Logistics Hub Optimizer

## 🚀 Overview

ReFlow is a reverse‑logistics optimization system that prevents unnecessary product returns to the seller warehouse. Instead of sending cancelled parcels back to the seller, ReFlow temporarily stores them in the nearest logistics hub and intelligently redirects them to a nearby customer who orders the same product within a limited time window.

This reduces:

* Delivery time
* Logistics cost
* Fuel usage
* Carbon emissions

---

## 💡 Problem Statement

In traditional e‑commerce logistics, when a customer cancels an order after shipment, the parcel travels all the way back to the seller warehouse. This leads to:

* Double transportation cost
* Increased delivery delays for new buyers
* High operational inefficiency
* Environmental impact due to unnecessary transport

ReFlow solves this by converting returns into nearby deliveries.

---

## 🧠 Solution

ReFlow acts as a middleware intelligence layer between e‑commerce platforms and logistics hubs.

When a cancellation happens:

1. Parcel is moved to the nearest local hub (not the seller warehouse)
2. System searches for nearby customers ordering the same product
3. If match found → redirect parcel
4. If no match within time window → return to seller

---

## 🔁 System Workflow

1. Order placed by customer
2. Parcel shipped from seller warehouse
3. Parcel reaches destination city hub
4. Customer cancels / delivery fails
5. Parcel stored in nearest hub inventory
6. ReFlow searches for nearby demand
7. Parcel redirected to new buyer OR returned to seller

---

## 🏗️ Core Modules

### 1. Order Intake Module

Receives and stores order data from e‑commerce platforms.

### 2. Parcel Tracking System

Tracks parcel movement across statuses:

* shipped_from_seller
* reached_city
* out_for_delivery
* cancelled
* moved_to_hub
* redirected
* returned_to_seller
* delivered

### 3. Hub Management System

Maintains temporary storage of parcels at local hubs.

### 4. ReFlow Decision Engine (Core Logic)

Matches cancelled parcels with nearby new orders using:

* Product ID match
* Pincode proximity
* Time window availability

### 5. Matching Algorithm

Priority based allocation:

1. Same pincode
2. Neighbor pincode
3. Same city

Nearest eligible order receives parcel.

### 6. Time Window Controller

Each parcel has expiry time in hub.
If expired → returned to seller warehouse.

### 8. Analytics Module

Calculates operational savings:

* Distance saved
* Fuel saved
* CO₂ emissions reduced
* Logistics cost reduced

---

## 📊 Impact Metrics Formula

```
distance_saved = warehouse_to_customer − hub_to_customer
fuel_saved = distance_saved × fuel_per_km
co2_saved = fuel_saved × emission_factor
cost_saved = return_cost − redirect_cost
```

---

## 🗄️ Database Design

### products

product_id, name

### hubs

hub_id, city, pincode

### orders

order_id, product_id, customer_pincode, status

### parcels

parcel_id, product_id, current_location, status, hub_id, expiry_time

### reflow_logs

parcel_id, redirected_to_order_id, saved_distance, saved_cost

---

## 🎯 Key Features

* Smart reverse logistics handling
* Real‑time demand matching
* Hub‑level parcel optimization
* Sustainable delivery tracking
* Reduced return‑to‑origin (RTO)

---

## 📈 Future Enhancements

* AI demand prediction
* Dynamic delivery route optimization
* Multi‑hub parcel balancing
* Fraud cancellation detection
* Discount incentives for redirected orders

---

## 🏁 Project Goal

To transform traditional reverse logistics into a dynamic redistribution system that minimizes cost and environmental impact while improving delivery speed.

---

## 📌 One Line Pitch

ReFlow is a hub‑level reverse logistics optimization engine that redirects cancelled parcels to nearby buyers instead of returning them to the seller warehouse.
