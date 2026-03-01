'use client';

import { CheckCircledIcon, PersonIcon, SquareIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

import styles from './booking-card.module.css';

const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16M2 8h18M6 8v8M18 8v8" />
  </svg>
);

export function BookingCard() {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.bookingInfo}>
          <h5 className={styles.title}>Booking Info</h5>

          <div className={styles.statusBadge}>
            <CheckCircledIcon width={16} height={16} />
            <span>Booking Confirmed</span>
          </div>

          <div className={styles.threeColumnGrid}>
            <div className={styles.column}>
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Booking ID:</span>
                  <span className={styles.value}>LG-B00109</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Booking Date/Time:</span>
                  <span className={styles.value}>June 17, 2024, 9.46 AM</span>
                </div>
              </div>

              <div className={styles.infoSection}>
                <h6 className={styles.sectionTitle}>Room Details</h6>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Room Type:</span>
                  <span className={styles.value}>Deluxe</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Room Number:</span>
                  <span className={styles.value}>101</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Price:</span>
                  <span className={styles.value}>$150/night</span>
                </div>
              </div>
            </div>

            <div className={styles.column}>
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Guests:</span>
                  <span className={styles.value}>2 Adults</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Requests:</span>
                  <span className={styles.value}>Late Check-Out</span>
                </div>
              </div>

              <div className={styles.infoSection}>
                <h6 className={styles.sectionTitle}>Check-in/Check-out & Duration</h6>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Check In:</span>
                  <span className={styles.value}>June 19, 2024, 1.45 PM</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Check Out:</span>
                  <span className={styles.value}>June 22, 2024, 11.45 AM</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>3 nights</span>
                </div>
              </div>
            </div>

            <div className={styles.column}>
              <div className={styles.infoSection}>
                <h6 className={styles.sectionTitle}>Notes (Guest Requests)</h6>
                <p className={styles.notes}>
                  Guest requested extra pillows and towels. Ensure room service is available upon arrival.
                </p>
              </div>

              <div className={styles.infoSection}>
                <h6 className={styles.sectionTitle}>Additional Information</h6>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Loyalty Program:</span>
                  <span className={styles.value}>Platinum Member</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Transportation:</span>
                  <span className={styles.value}>Airport pickup arranged</span>
                </div>
                <div className={styles.amenitiesList}>
                  <div className={styles.amenityItem}>
                    <CheckCircledIcon width={16} height={16} />
                    <span>Complimentary breakfast</span>
                  </div>
                  <div className={styles.amenityItem}>
                    <CheckCircledIcon width={16} height={16} />
                    <span>Free Wi-Fi</span>
                  </div>
                  <div className={styles.amenityItem}>
                    <CheckCircledIcon width={16} height={16} />
                    <span>Access to gym and pool</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Extras:</span>
                  <span className={styles.value}>-</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button type="button" className={styles.editButton}>
              Edit
            </button>
            <button type="button" className={styles.cancelButton}>
              Cancel Booking
            </button>
          </div>
        </div>

        <div className={styles.roomInfo}>
          <div className={styles.roomHeader}>
            <h5 className={styles.roomTitle}>Room Info</h5>
            <a href="#" className={styles.viewDetailLink}>View Detail</a>
          </div>

          <div className={styles.roomImageWrapper}>
            <Image
              src="/placeholder-room.jpg"
              alt="Room"
              width={400}
              height={250}
              className={styles.roomImage}
            />
          </div>

          <div className={styles.roomSpecs}>
            <div className={styles.specItem}>
              <SquareIcon width={16} height={16} />
              <span>35 m²</span>
            </div>
            <div className={styles.specItem}>
              <BedIcon />
              <span>King Bed</span>
            </div>
            <div className={styles.specItem}>
              <PersonIcon width={16} height={16} />
              <span>2 guests</span>
            </div>
          </div>

          <div className={styles.priceSummary}>
            <div className={styles.priceHeader}>
              <h6 className={styles.priceTitle}>Price Summary</h6>
              <span className={styles.paidBadge}>Paid</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Room and offer:</span>
              <span className={styles.priceValue}>$450.00</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Extras:</span>
              <span className={styles.priceValue}>$0.00</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>8% VAT:</span>
              <span className={styles.priceValue}>$36.00</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>City Tax:</span>
              <span className={styles.priceValue}>$49.50</span>
            </div>
            <div className={styles.priceRowTotal}>
              <span className={styles.totalLabel}>Total Price:</span>
              <span className={styles.totalValue}>$535.50</span>
            </div>
          </div>

          <div className={styles.notesSection}>
            <h6 className={styles.notesTitle}>Notes</h6>
            <p className={styles.notesText}>
              Invoice sent to corporate account; payment confirmed by BIG Corporation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
