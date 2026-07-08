import { create } from "zustand";
import type { Reservation } from "@/types/reservation";

interface ReservationStore {
  reservation: Reservation;

  setReservation: (data: Reservation) => void;

  clearReservation: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservation: {
    name: "",
    email: "",
    duration: 10,
    date: "",
    time: "",
  },

  setReservation: (data) =>
    set({
      reservation: data,
    }),

  clearReservation: () =>
    set({
      reservation: {
        name: "",
        email: "",
        duration: 10,
        date: "",
        time: "",
      },
    }),
}));