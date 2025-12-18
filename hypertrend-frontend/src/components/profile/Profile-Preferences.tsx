import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function ProfilePreferences() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Preferences</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">
              Toggle theme appearance
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}
