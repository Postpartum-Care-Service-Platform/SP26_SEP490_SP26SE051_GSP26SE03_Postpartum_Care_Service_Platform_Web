'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import styles from './booking-info.module.css';

export function BookingInfo() {
  return (
    <div className={styles.bookingCard}>
      <h5 className={styles.title}>Booking Info</h5>

      <div className={styles.statusBadge}>
        <CheckCircledIcon width={16} height={16} />
        <span>Booking Confirmed</span>
      </div>

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

      <div className={styles.actionButtons}>
        <button type="button" className={styles.editButton}>
          Edit
        </button>
        <button type="button" className={styles.cancelButton}>
          Cancel Booking
        </button>
      </div>
    </div>
  );
}
