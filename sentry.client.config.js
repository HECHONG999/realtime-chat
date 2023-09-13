/**
 * Date: 2023/09/13 09:59
 * Author: chonghe
 * Email: chong@intrii.com
 * Copyright: (c) 2023, 英荟科技有限公司
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0", // 请使用你自己的DSN
    // 考虑在这里添加其他Sentry的配置选项
});
