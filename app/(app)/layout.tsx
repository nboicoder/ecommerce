import React from "react";
import {Toaster} from "@/components/ui/sonner";
import {CartStoreProvider} from "@/lib/store/cart-store-provider";
import {SanityLive} from "@/sanity/lib/live";
import {ClerkProvider} from "@clerk/nextjs";
import {Header} from "@/components/app/Header";
import {ChatStoreProvider} from "@/lib/store/chat-store-provider";
import {CartSheet} from "@/components/app/CartSheet";

function Layout({children}: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <CartStoreProvider>
                <ChatStoreProvider>
                    <Header/>
                    <main>{children}</main>
                    <Toaster position="bottom-center"/>
                    <CartSheet/>
                    <SanityLive/>
                </ChatStoreProvider>
            </CartStoreProvider>
        </ClerkProvider>
    );
}

export default Layout;