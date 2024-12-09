import { z } from 'zod';



export const titleSchema = z.string()
    .min(4, { message: 'Title must be at least 4 characters long.' })
    .max(100, { message: 'Title must not exceed 100 characters.' })
    .regex(/^[a-zA-Z0-9\s]+$/, { message: "Title can only contain letters, numbers, and spaces." });


export const briefSchema = z.string()
    .min(50, { message: 'Title must be at least 150 characters long.' })
    .max(800, { message: 'Title must not exceed 800 characters.' })
    .regex(/^[a-zA-Z0-9\s]+$/, { message: "Title can only contain letters, numbers, and spaces." });
