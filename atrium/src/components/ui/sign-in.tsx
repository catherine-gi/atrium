import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        //await signIn("google")
        await signIn("google", { prompt: "select_account" });
      }}
    >
      <Button type="submit">Signin with Google</Button>
    </form>
  )
} 