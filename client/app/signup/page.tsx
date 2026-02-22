"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Check } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import api from "@/lib/axios";
import { redirect } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      let res = await api.post("users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      let data = res.data;
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Account created successfully!",
        });
        localStorage.setItem("userId", data.user._id);
        redirect("/dashboard");
      }, 500);
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Something went wrong",
      });
    }
  };

  const passwordStrength = {
    hasLength: formData.password.length >= 6,
    hasNumber: /\d/.test(formData.password),
    hasSymbol: /[!@#$%^&*]/.test(formData.password),
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-wellness-light to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-wellness-primary" />
            <h1 className="text-2xl font-bold text-foreground">SoulSync</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Start your wellness journey today
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Password strength
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordStrength.hasLength && (
                        <Check className="w-4 h-4 text-wellness-positive" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.hasNumber && (
                        <Check className="w-4 h-4 text-wellness-positive" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Contains a number
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength.hasSymbol && (
                        <Check className="w-4 h-4 text-wellness-positive" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Contains a symbol (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${
                  errors.confirmPassword ? "border-destructive" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-wellness-primary hover:bg-wellness-positive text-white"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-wellness-primary hover:text-wellness-positive font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
      <Toaster />
    </div>
  );
}
