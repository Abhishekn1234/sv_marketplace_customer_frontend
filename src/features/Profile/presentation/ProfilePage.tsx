import DangerZone from "./components/Dangerzone";
import PrefeneceandNotifications from "./components/Preferenceandnotifications";
import ProfileList from "./components/ProfileList";
import ProfileTop from "./components/ProfileTop";
import ProfileUpdate from "./components/ProfileUpdate";
import QuickActions from "./components/QuickActions";
import SavedAddress from "./components/SavedAddress";

export default function Profile() {
  return (
    <div className="w-full">
      {/* Top Section */}
      <ProfileTop />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProfileList />
            <QuickActions />
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-7">
            <ProfileUpdate />
            <SavedAddress/>
            <PrefeneceandNotifications/>
            <DangerZone/>
          </div>

        </div>
      </div>
    </div>
  );
}
