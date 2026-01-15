'use client';

import React from 'react';

import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/textarea/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/Select';

import styles from './booking.module.css';

export function BookingForm() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đặt lịch ngay</h1>

      <form className={styles.form}>
        <div className={styles.twoCol}>
          <Input variant="booking" placeholder="Họ và Tên" />

          <Select>
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Quốc tịch" />
            </SelectTrigger>
            <SelectContent className={styles.selectContent} position="popper">
              <SelectItem className={styles.selectItem} value="VN">
                Việt Nam
              </SelectItem>
              <SelectItem className={styles.selectItem} value="Other">
                Khác
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.twoCol}>
          <Input variant="booking" placeholder="Số điện thoại" />
          <Input variant="booking" placeholder="Email" type="email" />
        </div>

        <Input variant="booking" placeholder="Quận/Huyện và Thành phố" />

        <div className={styles.twoCol}>
          <div>
            <div className={styles.fieldLabel}>Đây là lần đầu bạn sinh con?</div>
            <Select>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="Lựa chọn" />
              </SelectTrigger>
              <SelectContent className={styles.selectContent} position="popper">
                <SelectItem className={styles.selectItem} value="yes">
                  Có
                </SelectItem>
                <SelectItem className={styles.selectItem} value="no">
                  Không
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className={styles.fieldLabel}>Tháng dự sinh</div>
            <Input variant="booking" placeholder="yyyy/mm/dd" />
          </div>
        </div>

        <Select>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="Bạn biết đến The Joyful Nest như thế nào?" />
          </SelectTrigger>
          <SelectContent className={styles.selectContent} position="popper">
            <SelectItem className={styles.selectItem} value="facebook">
              Facebook
            </SelectItem>
            <SelectItem className={styles.selectItem} value="instagram">
              Instagram
            </SelectItem>
            <SelectItem className={styles.selectItem} value="google">
              Google
            </SelectItem>
            <SelectItem className={styles.selectItem} value="friend">
              Bạn bè giới thiệu
            </SelectItem>
            <SelectItem className={styles.selectItem} value="other">
              Khác
            </SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          variant="booking"
          placeholder="Lời nhắn (Ví dụ: Ngày giờ bạn muốn ghé thăm The Joyful Nest.)"
        />

        <Button type="submit" variant="booking" size="booking" className={styles.submit} fullWidth>
          Hoàn tất
        </Button>
      </form>
    </div>
  );
}
