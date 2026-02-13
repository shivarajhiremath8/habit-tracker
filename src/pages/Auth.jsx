import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";

export default function Auth() {
    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    const signInWithEmail = async () => {
        const email = prompt("Enter your email");
        if (!email) return;

        await supabase.auth.signInWithOtp({ email });
        alert("Check your email for the login link");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Habit Tracker
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Sign in to track your progress
                    </p>
                </div>

                <div className="space-y-4">
                    <Button onClick={signInWithGoogle}>
                        Sign in with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" onClick={signInWithEmail}>
                        Sign in with Email
                    </Button>
                </div>
            </div>
        </div>
    );
}
