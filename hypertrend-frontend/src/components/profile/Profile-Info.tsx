import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ProfileInfo() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value="Saurjya Chatterjee" disabled />
          </div>

          <div>
            <Label>Email</Label>
            <Input value="saurjya@email.com" disabled />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value="+91 98765 43210" disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
