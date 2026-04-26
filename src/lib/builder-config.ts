import { builder } from '@builder.io/react';

// THAY THẾ BẰNG PUBLIC API KEY CỦA BẠN TỪ BUILDER.IO DASHBOARD
export const BUILDER_PUBLIC_API_KEY = 'YOUR_BUILDER_PUBLIC_API_KEY';

builder.init(BUILDER_PUBLIC_API_KEY);

// Bạn có thể đăng ký các component của mình tại đây để nó hiện lên trong editor của Builder.io
export const registerBuilderComponents = () => {
  // Chúng ta sẽ đăng ký các component trong các bước tiếp theo
};
