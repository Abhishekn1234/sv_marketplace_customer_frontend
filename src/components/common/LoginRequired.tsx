import { useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import { useLanguage } from "@/features/context/LanguageContext";
import { LockIcon, XIcon } from "../icons";
import CommonModal from "./CommonModal";

interface LoginRequiredProps {
  title?: string;
  description?: string;
}

export default function LoginRequired({
  title,
  description,
}: LoginRequiredProps) {
  const navigate = useNavigate();
  const { t: language, isRTLOrder } = useLanguage();

  const text = language.loginRequired;

  return (
   <CommonModal
  open={true}
  onClose={() => navigate("/")}
  width="max-w-md"
  className="rounded-3xl"
>
  <div
    dir={isRTLOrder ? "rtl" : "ltr"}
    className="relative flex flex-col items-center text-center"
  >
    {/* Close Button */}
    <Button
      onClick={() => navigate("/")}
      variant="ghost"
     
    >
      <XIcon size={20} />
    </Button>

    {/* Icon */}
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
      <LockIcon
        color="blue"
        className="h-10 w-10"
      />
    </div>

    {/* Title */}
    <h2 className="mt-6 text-2xl font-bold text-gray-900">
     {title}
    </h2>

    {/* Description */}
    <p className="mt-3 text-gray-500">
      {description}
    </p>

    {/* Buttons */}
    <div className="mt-8 flex w-full gap-3">
      <Button
        onClick={() => navigate("/login")}
        className="h-12 flex-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        {text.login}
      </Button>

      <Button
        onClick={() => navigate("/register")}
        className="h-12 flex-1 rounded-xl border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
      >
        {text.signup}
      </Button>
    </div>
  </div>
</CommonModal>
  );
}