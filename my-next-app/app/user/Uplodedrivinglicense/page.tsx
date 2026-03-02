import DrivingLicenseForm from "../Uplodedrivinglicense/_components/drivinglicense";
import ThemeToggle from "@/app/_components/ThemeToggle";

export default function DrivingLicensePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Driving License Registration
      </h1>

      <DrivingLicenseForm />
      <ThemeToggle />
    </div>
  );
}