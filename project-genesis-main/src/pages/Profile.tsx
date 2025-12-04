// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // <-- agar tumhara firebase init kahin aur hai to path yahan change karna

type ProfileState = {
  name: string;
  email: string;
  budget: string;
  risk: string;
  horizon: string;
};

const STORAGE_KEY = "stockadvisor_profile_v1";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProfileState>({
    name: "",
    email: "",
    budget: "",
    risk: "moderate",
    horizon: "medium",
  });

  // --- AUTO LOGOUT: agar user /profile kholta hai to turant sign out karke home bhej do
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn("Sign out on profile mount failed:", err);
      } finally {
        if (mounted) {
          navigate("/", { replace: true });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // load saved profile from localStorage on mount (kept for completeness; user will be redirected before seeing this)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<ProfileState>;
        setForm((f) => ({ ...f, ...parsed }));
      } catch (err) {
        console.warn("Could not parse saved profile", err);
      }
    } else {
      setForm({
        name: "John Doe",
        email: "john@example.com",
        budget: "50000",
        risk: "moderate",
        horizon: "medium",
      });
    }
  }, []);

  const handleChange = (key: keyof ProfileState, value: string) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name.trim() || !form.email.includes("@")) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid name and email.",
      });
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Save failed",
        description: "Could not save profile. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your investment preferences and risk profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Investment Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={form.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="Enter your budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk">Risk Tolerance</Label>
                <Select value={form.risk} onValueChange={(v) => handleChange("risk", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horizon">Investment Horizon</Label>
                <Select value={form.horizon} onValueChange={(v) => handleChange("horizon", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time horizon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (&lt; 1 year)</SelectItem>
                    <SelectItem value="medium">Medium-term (1-5 years)</SelectItem>
                    <SelectItem value="long">Long-term (&gt; 5 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;