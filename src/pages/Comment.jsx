import { Send } from "lucide-react";
import Button from "../components/button";
import { memo, useCallback, useState } from "react";
import { toast, Toaster } from "sonner";
import { Link, useParams } from "react-router-dom";
import useCheckUser from "../hooks/useCheckUser";
import {
  addComment,
  updateUserClient,
} from "../services/userService";
import { sendMessageGroup } from "../services/telegramService";

const FormField = memo(({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  disabled,
  rows
}) => {
  const id = `field-${name}`;
  const isTextarea = type === "textarea";
  const Component = isTextarea ? "textarea" : "input";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground mb-3"
      >
        {label}
      </label>
      <Component
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
});
FormField.displayName = "FormField";

const SubmitButton = memo(({ 
  isLoading, 
  isSubmitted 
}) => (
  <button
    type="submit"
    disabled={isLoading || isSubmitted}
    className={`w-full py-3 px-6 rounded-lg bg-blue-600 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
      isLoading
        ? "bg-muted text-white cursor-not-allowed"
        : isSubmitted
        ? "bg-green-500 hover:bg-green-600 text-white"
        : "bg-primary text-white hover:bg-secondary active:scale-95"
    }`}
  >
    <Send size={20} />
    {isLoading
      ? "Yuborilmoqda..."
      : isSubmitted
      ? "Yuborildi!"
      : "Xabarni Jo'natish"}
  </button>
));
SubmitButton.displayName = "SubmitButton";

const HeroSection = memo(() => (
  <section className="bg-blue-600 from-primary to-secondary py-12 md:py-16 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-1xl text-white md:text-1xl font-bold text-primary-foreground mb-3 text-balance">
        Ovqatlarimiz, xizmat ko'rsatish, restoran haqida, yaxshi va salbiy fikrlaringizni shu yerda qoldiring, fikringiz biz uchun muhim!
      </h1>
      <p className="text-lg text-white text-primary-foreground/90 text-balance">
        Bizning restoranimiz haqida o'z fikringizni yuboring va 5% chegirmaga ega bo'ling!
      </p>
    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  // Format as +998 XX XXX XX XX
  if (cleaned.length >= 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  return `+${cleaned}`;
};

const validatePhone = (phone) => {
  const regex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
  return regex.test(phone);
};

export default function Comment() {
  const { type, stol } = useParams();
  const { data: userId } = useCheckUser();

  const [formData, setFormData] = useState({
    phone: "+998",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback((
    e
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Telefon raqamni to'g'ri formatda kiriting");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Izoh kamida 10 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setIsLoading(true);

    try {
      await updateUserClient(userId, { phone: formData.phone });

      const payload = {
        userId,
        phone: formData.phone,
        comment: formData.message,
        type: type,
        stol: stol ? parseInt(stol) : undefined,
        skidkaPercent: 5
      };

      await Promise.all([
        addComment(payload),
        sendMessageGroup(payload)
      ]);

      setIsSubmitted(true);
      toast.success("Izohingiz muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("Comment submission error:", error);
      toast.error("Xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring");
    } finally {
      setIsLoading(false);
    }
  }, [formData, userId, type, stol]);

  return (
    <main className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      <HeroSection />

      <section className="w-full py-8 px-2 md:py-16 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-4 md:p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    label="Telefon Raqamingiz"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Masalan: +998 90 123 45 67"
                    disabled={isLoading}
                  />

                  <FormField
                    label="Izoh"
                    name="message"
                    type="textarea"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Izohni shu yerda yozing..."
                    disabled={isLoading}
                    rows={6}
                  />

                  <SubmitButton isLoading={isLoading} isSubmitted={isSubmitted} />

                  <p className="text-xs text-muted-foreground text-center">
                    Iltimos raqamni to'g'ri kiriting. Sizning maʼlumotlaringiz himoyalangan
                  </p>
                </form>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/menu" className="w-full bg-blue-600 rounded-lg sm:w-auto">
                  <div className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-bold py-3 px-8 text-lg rounded-lg transition-colors">
                    Menyuni ko'rish
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
