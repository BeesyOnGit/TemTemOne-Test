import { createLogger, format, transports } from "winston";
import validator from "validator";

// General logger function
export const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    defaultMeta: { service: "user-service" },
    transports: [new transports.File({ filename: "error.log", level: "error" }), new transports.File({ filename: "combined.log" })],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: format.simple(),
        })
    );
}

// Function to escape special characters
export const escapeInput = (input: string): string => {
    return validator.escape(input); // Escapes special characters in the input
};
