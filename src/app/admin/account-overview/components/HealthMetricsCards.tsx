'use client';

import Image from 'next/image';

import bloodPressureIcon from '@/assets/images/accountOverview/blood-pressure.png';
import heartRateIcon from '@/assets/images/accountOverview/heart-attack.png';
import oxygenIcon from '@/assets/images/accountOverview/red-blood-cells.png';
import temperatureIcon from '@/assets/images/accountOverview/temperature.png';

import styles from './health-metrics-cards.module.css';

export function HealthMetricsCards() {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.iconWrapper}>
            <Image
              src={bloodPressureIcon}
              alt="Blood Pressure"
              width={28}
              height={28}
              className={styles.icon}
            />
          </div>
          <p className={styles.label}>Blood Pressure</p>
          <h4 className={styles.value}>
            120 / 80 <small className={styles.unit}>mmHg</small>
          </h4>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.iconWrapper}>
            <Image
              src={heartRateIcon}
              alt="Heart Rate"
              width={28}
              height={28}
              className={styles.icon}
            />
          </div>
          <p className={styles.label}>Heart Rate</p>
          <h4 className={styles.value}>
            78 <small className={styles.unit}>/ min</small>
          </h4>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.iconWrapper}>
            <Image
              src={temperatureIcon}
              alt="Temperature"
              width={28}
              height={28}
              className={styles.icon}
            />
          </div>
          <p className={styles.label}>Temperature</p>
          <h4 className={styles.value}>
            98.6 <small className={styles.unit}>°F</small>
          </h4>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.iconWrapper}>
            <Image
              src={oxygenIcon}
              alt="Oxygen"
              width={28}
              height={28}
              className={styles.icon}
            />
          </div>
          <p className={styles.label}>Oxygen (SpO₂)</p>
          <h4 className={styles.value}>
            97 <small className={styles.unit}>%</small>
          </h4>
        </div>
      </div>
    </div>
  );
}
