export interface Policy {
  id: string;
  title: string;
  summary: string;
  points: string[];
}

export const policies: Policy[] = [
  {
    id: "cancellation",
    title: "Cancellation and rescheduling",
    summary: "We hold time for you and turn other clients away. Please give us 24 hours.",
    points: [
      "Cancel or reschedule at least 24 hours before your appointment by phone, email or the link in your reminder.",
      "Changes with less than 24 hours' notice forfeit the $50 deposit or, for members, one banked facial.",
      "No-shows are charged the deposit and may require prepayment for future bookings.",
      "We understand emergencies. Call us and we will do our best to be fair.",
    ],
  },
  {
    id: "deposits",
    title: "Deposits",
    summary: "A small deposit holds treatment appointments. It is always applied to your service.",
    points: [
      "Treatment appointments over 30 minutes require a $50 deposit at booking.",
      "The deposit is applied to your treatment total on the day.",
      "Deposits are refunded in full with 24 hours' notice.",
      "Virtual consultations require no deposit. In-person consultations are $50, credited toward treatment within 60 days.",
    ],
  },
  {
    id: "refunds",
    title: "Refunds and packages",
    summary: "Services are non-refundable once performed. Packages are handled fairly.",
    points: [
      "Fees for completed treatments are not refundable. Results vary, and we cannot guarantee outcomes.",
      "Unused portions of prepaid series and packages may be refunded within 30 days of purchase, minus services used at single-session pricing.",
      "Unopened skincare may be exchanged within 14 days. Opened products cannot be returned.",
      "Gift cards are non-refundable and do not expire.",
    ],
  },
  {
    id: "age",
    title: "Age requirement",
    summary: "All clients must be 18 or older.",
    points: [
      "We do not treat minors, even with parental consent.",
      "Photo ID is required at the first visit and may be requested again.",
    ],
  },
  {
    id: "late",
    title: "Late arrivals",
    summary: "We hold your appointment for 10 minutes.",
    points: [
      "Arriving more than 10 minutes late may mean a shortened treatment at full price, or a reschedule with the deposit forfeited.",
      "Please arrive 10 minutes early for first visits to complete intake.",
    ],
  },
  {
    id: "conduct",
    title: "Guests, children and conduct",
    summary: "Velmora is a medical clinic and a quiet space.",
    points: [
      "Children may not attend appointments for safety reasons.",
      "One adult guest may wait in the lounge. Guests may join consultations on request.",
      "We reserve the right to decline treatment when it is not in a client's best interest, or when a client is under the influence of alcohol or drugs.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy and photos",
    summary: "Your records are protected and your photos are yours.",
    points: [
      "Clinical photographs are part of your medical record and are stored securely.",
      "We never use your images without written consent for a specific purpose.",
      "Booking and contact forms on this site send an email to our team and are not stored on the web server. See our privacy policy for details.",
    ],
  },
];
