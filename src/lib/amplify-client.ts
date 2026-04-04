"use client";

import { Amplify } from "aws-amplify";
import "aws-amplify/auth/enable-oauth-listener";
import outputs from "../../amplify_outputs.json";

declare global {
  var __gavinAmplifyConfigured: boolean | undefined;
}

if (!globalThis.__gavinAmplifyConfigured) {
  Amplify.configure(outputs);
  globalThis.__gavinAmplifyConfigured = true;
}

export {};
