
---
title: winston
linktitle: winston
type: book
commentable: true
---

# winston

```js
const logger = createLogger({
  level: "debug",
  format: format.combine(
    // Use this function to create a label for additional text to display
    format.label({ label: path.basename(module.parent.filename) }),
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      // We display the label text between square brackets using ${info.label} on the next line
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [new transports.Console()]
});
```

# 生产环境配置

```ts
import * as path from "path";
import * as winston from "winston";

const { createLogger, format, transports } = winston;

const errorStackFormat = format(info => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    });
  }
  return info;
});

const formats = [
  format.label({
    label: path.basename(`${module.parent}/${module.filename}`)
  }),
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  format.printf(
    info =>
      `${info.label}[${info.level}]: ${info.timestamp} --- ${info.message}`
  )
];

export const logger = createLogger({
  level: "info",
  format: format.combine(...formats),
  exitOnError: false,
  transports: [
    // 生产环境下区分 Error 与其他
    new transports.File({
      filename: path.resolve("logs/error.log"),
      level: "error",
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new transports.File({
      filename: path.resolve("logs/info.log"),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

logger.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: format.combine(errorStackFormat(), ...formats, format.colorize())
  })
);
```

    