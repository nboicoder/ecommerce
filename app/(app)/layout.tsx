import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/app/Header";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { CartSheet } from "@/components/app/CartSheet";
import { ChatSheet } from "@/components/app/ChatSheet";
import { AppShell } from "@/components/app/AppShell";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
          <AppShell>
            <Header />
            <main>{children}</main>
          </AppShell>
          <Toaster position="bottom-center" />
          <CartSheet />
          <ChatSheet />
          <SanityLive />
        </ChatStoreProvider>
      </CartStoreProvider>
    </ClerkProvider>
  );
}

export default Layout;
