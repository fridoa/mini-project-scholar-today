import { useNavigate } from "react-router";
import { MdHome } from "react-icons/md";
import illustration404 from "@/assets/illustrations/404.png";
import Footer from "@/components/layouts/MainLayout/Footer";
import Button from "@/components/ui/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <img
          src={illustration404}
          alt="Page Not Found"
          className="w-full max-w-xl"
        />

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-gray-500">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>

        <Button
          onClick={() => navigate("/")}
          icon={<MdHome size={18} />}
          className="mt-8 shadow-md hover:shadow-lg active:scale-95"
        >
          Back to Home
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
