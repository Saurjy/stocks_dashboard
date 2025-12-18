import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ProfileHeader() {
  return (
    <Card>
      <CardContent className="flex items-center gap-6 p-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div>
          <h2 className="text-xl font-semibold">Saurjya Chatterjee</h2>
          <p className="text-muted-foreground">
            saurjya@email.com
          </p>
          </div>
          <div className="p-1">
          <Button className="md:hidden rounded-xl text-primary border border-blue-500 
        shadow-md bg-slate-200 hover:bg-slate-400 
        dark:shadow-white/10 dark:bg-slate-700 dark:hover:bg-slate-500 
                           ">Edit Profile</Button>
          </div>
        </div>

        <Button className="hidden md:block rounded-xl text-primary border border-blue-500 
        shadow-md bg-slate-200 hover:bg-slate-400 
        dark:shadow-white/10 dark:bg-slate-700 dark:hover:bg-slate-500 
                           ">Edit Profile</Button>

      </CardContent>
    </Card>
  )
}
