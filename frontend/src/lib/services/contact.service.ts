import { ContactForm } from "@/types";
import api from "../api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const contactService = {
  /** Submit contact form */
  submitForm: (data: ContactForm) =>
    api.post<ApiResponse<{ id: string }>>("/contact", data),
};

export default contactService;
