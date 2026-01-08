import { z } from 'zod';

const roomSelectionSchema = z.object({
  type: z.string(),
  quantity: z.number().int().positive(),
});

export const createBookingSchema = z.object({
  boatId: z.string(),
  dates: z.object({
    checkIn: z.string(),
    checkOut: z.string(),
  }),
  pax: z.number().int().min(1).max(100),
  roomsBooked: z.array(roomSelectionSchema).nonempty(),
  places: z.array(z.string()).min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
