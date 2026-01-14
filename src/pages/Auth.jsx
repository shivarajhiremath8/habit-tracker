import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";

export default function Auth() {
    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    const signInWithEmail = async () => {
        const email = prompt("Enter your email");
        if (!email) return;

        await supabase.auth.signInWithOtp({ email });
        alert("Check your email for the login link");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-4 text-center">
                <h1 className="text-xl font-semibold">
                    Habit Tracker
                </h1>

                <Button onClick={signInWithGoogle}>
                    Sign in with Google
                </Button>

                <Button variant="secondary" onClick={signInWithEmail}>
                    Sign in with Email
                </Button>
            </div>
        </div>
    );
}
