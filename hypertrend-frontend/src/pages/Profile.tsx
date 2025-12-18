import { ProfileHeader } from "@/components/profile/Profile-Header"
import { ProfileInfo } from "@/components/profile/Profile-Info"
import { ProfilePreferences } from "@/components/profile/Profile-Preferences"

export default function Profile() {
  return (
    <div className="p-6 space-y-6 w-full">
      <ProfileHeader />
      <ProfileInfo />
      <ProfilePreferences />
    </div>
  )
}




